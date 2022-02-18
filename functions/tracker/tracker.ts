import { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import { ITracker, Tracker } from "../models/tracker.model";
import { TrackerService } from "../services/tracker.service";
import { UserService } from "../services/user.service";
import { RequestHelper } from "../utils/request-helper";
import { ResponseHelper } from "../utils/response-helper";


export const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  
  const req = new RequestHelper('users/:id', event, context);
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
        //path = tracker/ ... get single tracker record
        return await getTrackerRecord(event, context, req);
      } else {
        return ResponseHelper.NotFound().respond();
      }
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

const getTrackerRecord = async (event: HandlerEvent, context: HandlerContext, req: RequestHelper) => {

  try {
    //check if the user id is in the route
    if (!req.requestPath.params.id) {
      return ResponseHelper.NotFound().respond();
    }

    const trackerService = new TrackerService();

    const result = await trackerService.find(req.requestPath.params.id);

    //todo: verify that this user can access this record

    return ResponseHelper.OK(result);

  } catch (error) {
    const resp = new ResponseHelper();
    //check for error reported from airtable api
    if (error?.statusCode && error?.message) {
      resp.setNegativeResp(error.statusCode, error.message);
    } else {
      //general error
      resp.setNegativeResp(500, "Oops! Something went wrong on our end.  Please try again later.", error);
    }
    return resp.respond();
  }
}


const createUser = async (event: HandlerEvent, context: HandlerContext, req: RequestHelper) => {

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

    await trackerService.create({
      ...record
    })
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
