import { Handler, HandlerContext, HandlerEvent } from '@netlify/functions'
import { IUser, User } from '../models/user.model';
import { UserService } from '../services/user.service';
import { ResponseHelper } from '../utils/response-helper';

export const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  const { httpMethod } = event;
  switch (httpMethod) {
    case 'GET': 
      return await getUsers(event, context);
    case 'POST':
      return await createUser(event, context);
  }
  //else
  return ResponseHelper.MethodNotAllowed().respond();
}

const getUsers = async (event: HandlerEvent, context: HandlerContext) => {
  const resp = new ResponseHelper();

  try {

    const { httpMethod } = event;

    //validate request
    if (httpMethod !== "GET") {
      //only accept POST
      resp.setNegativeResp(405, "Method Not Allowed");
    }

    if (resp.isValid) { return resp.respond(); }

    //is there a user with this email already in the system?
    const userService = new UserService();

    const result = await userService.getAll();

    resp.setPositiveResp(200, 'OK', result);

  } catch (error) {
    resp.setNegativeResp(500, "Oops! Something went wrong on our end.  Please try again later.", error);
  }

  return resp.respond();
}

const createUser = async (event: HandlerEvent, context: HandlerContext) => {

  const resp = new ResponseHelper();

  try {

    const { httpMethod } = event;
    const user = User.Deserialize(event.body);

    //validate request
    if (httpMethod !== "POST") {
      //only accept POST
      resp.setNegativeResp(405, "Method Not Allowed");
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
        resp.setNegativeResp(400, "Bad Request", err);
    }

    if (resp.isValid) { return resp.respond(); }

    //is there a user with this email already in the system?
    const userService = new UserService();

    const filterByFormula = `{email} = "${user.email}"`;
    if (await userService.exists(filterByFormula)) {
      resp.setNegativeResp(400, 'Bad Request', 'A user record with this email address already exists');
    }

    if (resp.isValid) { return resp.respond(); }

    //OK... Create a record in the db
    await userService.create({
      ...user
    })
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

