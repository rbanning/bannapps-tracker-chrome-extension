import { HandlerResponse } from "@netlify/functions";

export interface IResponseBody {
  message: string;
  result?: any | any[];
  error?: string | string[] | any;
  state?: any;
}

export type ContentTypes = 'json' | 'text' | 'html' | 'none';

export interface IStandardResponse {
  statusCode: number;
  body: IResponseBody | null;
  contentType: ContentTypes;
  headers?: {[key: string]: string}
}


export class ResponseHelper {
  statusCode: number;
  message: string;
  result?: any | any[];
  error?: string | string[] | any;
  state?: any;
  contentType: ContentTypes;
  private _headers?: {[key: string]: string};
  get headers() {
    return {...this._headers};
  }

  get isValid() {
    return this.statusCode > 0 && !!this.message;
  }

  constructor(resp?: IStandardResponse) {
    //setup default
    this.statusCode = 0;
    this.message = null;
    this.contentType = 'json';
    this._headers = {};

    if (resp) {
      this.statusCode = resp.statusCode;
      this.message = resp.body?.message;
      this.result = resp.body?.result;
      this.error = resp.body?.error;
      this.contentType = resp.contentType || this.contentType;
    }

    //HANDLE CORS?
    this.addHeader("Access-Control-Allow-Origin", "*");

  }

  //#region >>> STATIC METHODS <<<

  static MethodNotAllowed(error?: any) {
    const resp = new ResponseHelper();
    resp.setNegativeResp(405, "Method Not Allowed", error);
    return resp;
  }
  static NotFound(error?: any) {
    const resp = new ResponseHelper();
    resp.setNegativeResp(404, "Not Found", error);
    return resp;
  }
  static UnAuthorized(error?: any) {
    const resp = new ResponseHelper();
    resp.setNegativeResp(401, "Unauthorized", error);
    return resp;
  }
  static Forbidden(error?: any) {
    const resp = new ResponseHelper();
    resp.setNegativeResp(403, "Forbidden - You do not have permission");
    return resp;
  }
  static BadRequest(message: string, error?: any) {
    const resp = new ResponseHelper();
    resp.setNegativeResp(400, message, error);
    return resp;
  }
  static ServerError(message: string, error?: any) {
    const resp = new ResponseHelper();
    resp.setNegativeResp(500, message, error);
    return resp;
  }
  static CORS() {
    const resp = new ResponseHelper();
    resp.setPositiveResp(200, "OK - CORS");
    return resp;
  }
  static OK(result: any | any[]) {
    const resp = new ResponseHelper();
    resp.setPositiveResp(200, "OK", result);
    return resp;
  }

  //#endregion



  clone(resp: ResponseHelper) {
    this.statusCode = resp?.statusCode;
    this.message = resp?.message;
    this.result = resp?.result;
    this.error = resp?.error;
    this.contentType = resp?.contentType;
    this.state = resp?.state;
    return this;
  }

  addHeader(key: string, value: string) {
    if (!this._headers) { this._headers = {}; }
    this._headers[key] = value;
    return this;
  }


  setPositiveResp(statusCode: number, message: string, result?: any | any[]) {
    this.setResp(statusCode, message, result);
  }
  setNegativeResp(statusCode: number, message: string, error?: string | string[] | any) {
    this.setResp(statusCode, message, undefined, error);
  }
  private setResp(statusCode: number, message: string, result?: any | any[], error?: string | string[] | any) {
    this.statusCode = statusCode;
    this.message = message;
    this.result = result || this.result;
    this.error = error || this.error;
  }


  respond(): HandlerResponse {
    return {
      statusCode: this.statusCode,
      body: JSON.stringify(this.parseBody()), 
      headers: {
        ...this.headers,
        'Content-Type': this.parseContentType(this.contentType)
      }
    };
  }

  private parseBody(): IResponseBody {
    return {
      message: this.message,
      result: this.result,
      error: this.error,
      state: this.state
    };
  }
  private parseContentType(contentType: ContentTypes): string | null {
    switch (contentType) {
      case 'html':
        return 'text/html';
      case 'text':
        return 'text/plain';
      case 'json':
        return 'application/json'
    }
    //else
    return null;
  }
}