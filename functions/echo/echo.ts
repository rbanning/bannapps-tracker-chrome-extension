import { Handler, HandlerContext, HandlerEvent } from "@netlify/functions";
import { RequestHelper } from "../utils/request-helper";
import { ResponseHelper } from "../utils/response-helper";

export const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  const { httpMethod, path, headers, queryStringParameters, body } = event;

  const req = new RequestHelper('echo/:id/:action', event, context);

  switch (httpMethod) {
    case 'GET': 
      return ResponseHelper.OK({
        httpMethod, path, headers, queryStringParameters, req
      }).respond();
    case 'PUT':
    case 'POST':
    case 'PATCH':
      return ResponseHelper.OK({
        httpMethod, path, headers, queryStringParameters, body, req
      }).respond();
    }

  //else
  return ResponseHelper.MethodNotAllowed().respond();
}