import { Handler, HandlerContext, HandlerEvent } from '@netlify/functions'
import { IUser, User } from '../models/user.model';
import { UserService } from '../services/user.service';
import { RequestHelper } from '../utils/request-helper';
import { ResponseHelper } from '../utils/response-helper';

export const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  const { httpMethod } = event;

  const req = new RequestHelper('users/:id/:action', event, context);
  //all access to Users requires authentication
  if (!req.isAuthenticated()) {
    return ResponseHelper.UnAuthorized().respond();
  }

  switch (httpMethod) {
    case 'GET':
      if (req.requestPath.paramCount === 0) {
        //path = users/ ... get all users
        if (req.authState === 'manager') {
          //only managers can view all users
          return await getUsers(event, context, req);
        } else {
          return await getThisUser(event, context, req);
        }
      } else if (req.requestPath.paramCount === 1) {
        //path = users/:id
        return await getUser(event, context, req);
      } else {
        return ResponseHelper.NotFound().respond();
      }
      break;
    case 'POST':
      if (req.requestPath.paramCount === 0) {
        //only managers can create users
        if (req.authState === 'manager') {
          return await createUser(event, context, req);
        } else {
          return ResponseHelper.Forbidden().respond();
        }
      } else {
        return ResponseHelper.NotFound().respond();
      }
  }
  //else
  return ResponseHelper.MethodNotAllowed().respond();
}

const getUsers = async (event: HandlerEvent, context: HandlerContext, req: RequestHelper) => {
  const resp = new ResponseHelper();

  try {
    //request has already been validated
    const userService = new UserService();

    const result = await userService.getAll();

    resp.setPositiveResp(200, 'OK', result);

  } catch (error) {
    resp.setNegativeResp(500, "Oops! Something went wrong on our end.  Please try again later.", error);
  }

  return resp.respond();
}

const getUser = async (event: HandlerEvent, context: HandlerContext, req: RequestHelper) => {
  const resp = new ResponseHelper();

  try {
    //check if the user id is in the route
    if (!req.requestPath.params.id) {
      return ResponseHelper.NotFound().respond();
    }

    const userService = new UserService();

    const result = await userService.find(req.requestPath.params.id);

    resp.setPositiveResp(200, 'OK', result);

  } catch (error) {
    //check for error reported from airtable api
    if (error?.statusCode && error?.message) {
      resp.setNegativeResp(error.statusCode, error.message);
    } else {
      //general error
      resp.setNegativeResp(500, "Oops! Something went wrong on our end.  Please try again later.", error);
    }
  }

  return resp.respond();

}
const getThisUser = async (event: HandlerEvent, context: HandlerContext, req: RequestHelper) => {
  const resp = new ResponseHelper();

  try {
    const userService = new UserService();

    const result = await userService.getByUid(req.identity.id);

    resp.setPositiveResp(200, 'OK', result);

  } catch (error) {
    //check for error reported from airtable api
    if (error?.statusCode && error?.message) {
      resp.setNegativeResp(error.statusCode, error.message);
    } else {
      //general error
      resp.setNegativeResp(500, "Oops! Something went wrong on our end.  Please try again later.", error);
    }
  }

  return resp.respond();

}

const createUser = async (event: HandlerEvent, context: HandlerContext, req: RequestHelper) => {

  const resp = new ResponseHelper();

  try {

    const req = new RequestHelper('user/:id', event, context);
    const { httpMethod } = req;
    const user = User.Deserialize(event.body);

    //validate request
    if (!req.isAuthenticated()) {
      resp.clone(ResponseHelper.UnAuthorized());
    }
    else if (httpMethod !== "POST") {
      //only accept POST
      resp.clone(ResponseHelper.MethodNotAllowed());
    }
    else if (!user?.uid || !user?.name || !user?.email) {
        //missing required fields
        const err = [];
        if (!user) { err.push("Could not deserialize payload"); }
        else {
          if (!user.uid) { err.push("Missing user id"); }
          if (!user.name) { err.push("Missing user name"); }
          if (!user.email) { err.push("Missing user email"); }
        }
        resp.clone(ResponseHelper.BadRequest("Bad Request", err));
    }

    if (resp.isValid) { return resp.respond(); }

    //is there a user with this email already in the system?
    const userService = new UserService();

    if (await userService.emailExists(user.email)) {
      resp.setNegativeResp(400, 'Bad Request', 'A user record with this email address already exists');
    }

    if (resp.isValid) { return resp.respond(); }

    //OK... Create a record in the db
    const data: any = {...user};
    delete data.key;
    await userService.create(data)
    .then((result: IUser) => {
      resp.setPositiveResp(200, "OK", result);
      console.log("Successfully created user: " + user.uid);
    })
    .catch((err) => {
      console.warn("There was a problem creating user: " + user.uid);
      throw err;
    });


  } catch (error) {
    resp.setNegativeResp(500, "Oops! Something went wrong on our end.  Please try again later.", error);
  }

  return resp.respond();
  
}

