import { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import { AuthService } from "../services/auth.service";
import { RequestHelper } from "../utils/request-helper";
import { ResponseHelper } from "../utils/response-helper";

export const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  const { httpMethod, path, headers, queryStringParameters, body } = event;

  const req = new RequestHelper('auth/:id/:action', event, context);

  switch (httpMethod) {
    case 'POST': 
      if (req.requestPath.paramCount === 0) {
        //path = auth/
        const auth = new AuthService();
        const {email, password, key, error } = auth.parseLoginBody(event.body);
        const result = await auth.login(email, password, key);
        if (result?.token) {
          return ResponseHelper.OK(result).respond();
        } else {
          return ResponseHelper.BadRequest("Invalid email, key and/or password").respond();
        }
      } else if (req.requestPath.params?.id === 'refresh') {
        //path = auth/refresh
        if (req.isAuthenticated()) {
          const auth = new AuthService();
          const token = auth.createToken(req.identity);
          if (token) {
            return ResponseHelper.OK({identity: req.identity, token}).respond();
          } else {
            return ResponseHelper.BadRequest("Token is invalid and/or has expired").respond();
          }
        }
      }
  }

  //else
  return ResponseHelper.MethodNotAllowed(req).respond();
}