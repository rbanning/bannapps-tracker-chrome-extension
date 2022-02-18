import { HandlerContext, HandlerEvent } from "@netlify/functions";
import { IAuthIdentity } from "../models/identity.model";
import { AuthService, AuthState } from "../services/auth.service";

export interface IRequestPath {
  path: string;
  params: {[key: string]: string};
  readonly paramCount: number;    //number of non-falsey params
  template: string;
}

export class RequestPath implements IRequestPath {
  path: string;
  params: {[key: string]: string} = {};
  get paramCount() {
    return !!this.params 
      ? Object.keys(this.params)
      .map(key => this.params[key])
      .filter(Boolean)
      .length
      : 0;
  }
  template: string;

  constructor(obj: any = null) {
    if (obj) {
      this.path = obj.path;
      this.params = obj.params || this.params;
      this.template = obj.template;
    }
  }
}



export class RequestHelper {
  readonly PATH_DELIM = '/';
  readonly ROUTE_PARAM_DELIM = ":";
  private readonly AUTH_KEY: string = AuthService.AUTH_KEY;
  
  private _authState: AuthState | null = null;
  get authState() { return this._authState; }
  private _identity: IAuthIdentity | null = null;
  get identity() { return this.isAuthenticated() ? this._identity : null; }

  private _httpMethod: string;
  get httpMethod() { return this._httpMethod; }

  requestPath: IRequestPath;

  constructor(
    template: string,   //used to extract route params
    event: HandlerEvent, 
    context: HandlerContext) {

      const { path, httpMethod } = event;
      this._httpMethod = httpMethod;
      this.requestPath = new RequestPath({
        path,
        params: {},
        template
      });

      this.parsePath();
      this.parseAuthToken(event.headers['authorization']);
  }

  isAuthenticated() {
    return this._authState === 'viewer' || this._authState === 'manager' && this.identity?.isValid();
  }


  private parsePath() {
    if (this.requestPath.path) {
      const templateParts = this.requestPath.template.split(this.PATH_DELIM);
      if (templateParts.some(m => m.startsWith(this.ROUTE_PARAM_DELIM))) {
        const parts = this.requestPath.path.split(this.PATH_DELIM);
        //find the index of the first parts element that matches templateParts[0]
        let index: number | null = null;
        for(let i=0; i < parts.length && index === null; i++) {
          if (parts[i] === templateParts[0]) {
            index = i;
          }
        }

        if (index !== null) {
          //starting with the second part of the template path...
          //  find each template segment that starts with ':' (ROUTE_PARAM_DELIM)
          //  and add that key to the requestPath.params
          for(let i=1; i < templateParts.length; i++) {
            if (templateParts[i].startsWith(this.ROUTE_PARAM_DELIM)) {
              const key = templateParts[i].substring(this.ROUTE_PARAM_DELIM.length);
              const value = (i + index < parts.length) ? parts[i + index] : null;
              this.requestPath.params[key] = value;
            }
          }
        }
      }
    }
  }

  private parseAuthToken(token: string) {
    const authService = new AuthService();
    console.log("DEBUG: parsing Auth Token", token);
    const { identity, authState } = authService.parseAuthToken(token);
    this._identity = identity;
    this._authState = authState;
  }
}