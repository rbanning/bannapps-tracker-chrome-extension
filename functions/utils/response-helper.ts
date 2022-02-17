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
}


export class ResponseHelper {
  statusCode: number;
  message: string;
  result?: any | any[];
  error?: string | string[] | any;
  state?: any;
  contentType: ContentTypes;

  get isValid() {
    return this.statusCode > 0 && !!this.message;
  }

  constructor(resp?: IStandardResponse) {
    //setup default
    this.statusCode = 0;
    this.message = null;
    this.contentType = 'json';
    
    if (resp) {
      this.statusCode = resp.statusCode;
      this.message = resp.body?.message;
      this.result = resp.body?.result;
      this.error = resp.body?.error;
      this.contentType = resp.contentType || this.contentType;
    }
  }

  //#region >>> STATIC METHODS <<<

  static MethodNotAllowed() {
    const resp = new ResponseHelper();
    resp.setNegativeResp(405, "Method Not Allowed");
    return resp;
  }

  //#endregion

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