import { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import { ITracker, Tracker } from "../models/tracker.model";
import { TrackerService } from "../services/tracker.service";
import { UserService } from "../services/user.service";
import { RequestHelper } from "../utils/request-helper";
import { ResponseHelper } from "../utils/response-helper";


export const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  
  const req = new RequestHelper('tracker/:domain', event, context);
  //all access to Users requires authentication
  if (!req.isAuthenticated()) {
    return ResponseHelper.UnAuthorized().respond();
  }

  switch (req.httpMethod) {
    case 'GET':
      if (req.requestPath.paramCount === 0) {
        //path = tracker/ ... get all tracker records
        if (req.authState === 'manager') {
          return await getAllRecords(event, context, req);
        } else {
          return await getAllRecordsForUser(event, context, req);
        }
      } else if (req.requestPath.paramCount === 1) {
        //special case...
        if (req.requestPath.params.domain === 'domains') {
          return await getDomainsForUser(event, context, req);
        }
        //else
        //path = tracker/ ... get all tracker records for single domain
        return await getAllRecordsForUserSingleDomain(event, context, req);
      }
      //else
      return ResponseHelper.NotFound().respond();
    case 'POST':
        //path = tracker/ ... create tracker record
      if (req.requestPath.paramCount === 0) {
        return await createTrackerRecord(event, context, req);
      }
      //else
      return ResponseHelper.NotFound().respond();      
  }

  //else
  return ResponseHelper.MethodNotAllowed().respond();

}

const getAllRecords = async (event: HandlerEvent, context: HandlerContext, req: RequestHelper) => {
  try {
    //request has already been validated
    const trackerService = new TrackerService();

    const result = await trackerService.getAll();

    return ResponseHelper.OK(result).respond();

  } catch (error) {
    //todo: check for any airtable api errors?
    return ResponseHelper.ServerError("Oops! Something went wrong on our end.  Please try again later.", error);
  }
}

const getAllRecordsForUser = async (event: HandlerEvent, context: HandlerContext, req: RequestHelper) => {
  try {
    //request has already been validated
    const trackerService = new TrackerService();

    const result = await trackerService.getAllForUser(req.identity.id);

    return ResponseHelper.OK(result).respond();

  } catch (error) {
    //todo: check for any airtable api errors?
    return ResponseHelper.ServerError("Oops! Something went wrong on our end.  Please try again later.", error);
  }
}
const getAllRecordsForUserSingleDomain = async (event: HandlerEvent, context: HandlerContext, req: RequestHelper) => {
  try {
    //request has already been validated
    const trackerService = new TrackerService();

    const result = await trackerService.getAllForUserSingleDomain(req.identity.id, req.requestPath.params.domain);

    return ResponseHelper.OK(result).respond();

  } catch (error) {
    //todo: check for any airtable api errors?
    return ResponseHelper.ServerError("Oops! Something went wrong on our end.  Please try again later.", error);
  }
}

const getDomainsForUser = async (event: HandlerEvent, context: HandlerContext, req: RequestHelper) => {
  try {
    //request has already been validated
    const trackerService = new TrackerService();

    const records = await trackerService.getDomainsForUser(req.identity.id);
    const result = Array.isArray(records)
      ? records.reduce((arr: any[], rec: any) => {
        const obj = arr.find(m => m.domain === rec.domain);

        if (obj) {
          obj.count += 1;
        } else {
          arr.push({
            domain: rec.domain,
            count: 1
          });
        }
        return arr;
      }, [])
      : [];
    result.sort((a,b) => (a.domain > b.domain) ? 1 : ((a.domain < b.domain) ? -1 : 0));
    return ResponseHelper.OK(result).respond();

  } catch (error) {
    //todo: check for any airtable api errors?
    return ResponseHelper.ServerError("Oops! Something went wrong on our end.  Please try again later.", error);
  }
}


const createTrackerRecord = async (event: HandlerEvent, context: HandlerContext, req: RequestHelper) => {

  const resp = new ResponseHelper();

  try {

    const req = new RequestHelper('user/:id', event, context);
    const { httpMethod } = req;
    const record = Tracker.Deserialize(event.body);

    //validate request
    if (!req.isAuthenticated()) {
      resp.clone(ResponseHelper.UnAuthorized());
    }
    else if (httpMethod !== "POST") {
      //only accept POST
      resp.clone(ResponseHelper.MethodNotAllowed());
    }
    else if (!record?.id || !record?.name || !record?.domain || !record?.url) {
        //missing required fields
        const err = [];
        if (!record) { err.push("Could not deserialize payload"); }
        else {
          if (!record.id) { err.push("Missing tracker id"); }
          if (!record.name) { err.push("Missing tracker name"); }
          if (!record.domain) { err.push("Missing tracker domain"); }
          if (!record.url) { err.push("Missing tracker url"); }
        }
        resp.clone(ResponseHelper.BadRequest("Bad Request", err));
    }

    if (resp.isValid) { return resp.respond(); }

    //is there a user with this email already in the system?
    const userService = new UserService();
    const trackerService = new TrackerService();

    if (!(await userService.uidExists(req.identity.id))) {
      resp.setNegativeResp(400, 'Bad Request', 'Could not find your uid in our database');
    }

    if (resp.isValid) { return resp.respond(); }

    //OK... Create a record in the db
    record.uid = req.identity.id;

    await trackerService.create(record.toCreateDto())
    .then((result: ITracker) => {
      resp.setPositiveResp(200, "OK", result);
      console.log("Successfully created tracker record: " + result.id);
    })
    .catch((err) => {
      console.warn("There was a problem creating tracker record: " + record.id);
      throw err;
    });


  } catch (error) {
    resp.setNegativeResp(500, "Oops! Something went wrong on our end.  Please try again later.", error);
  }

  return resp.respond();
  
}
