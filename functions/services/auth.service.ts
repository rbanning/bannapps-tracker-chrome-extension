import { AuthIdentity, IAuthIdentity, Role } from "../models/identity.model";
import { IUser, User } from "../models/user.model";
import { StringHelpers } from "../utils/string-helpers";
import { UserService } from "./user.service";

export type AuthState = Role | 'invalid' | 'none';

export interface IAuthLoginBody {
  email: string | null;
  password: string | null;
  key: string | null;
  error: any | null;
}
export interface IAuthLoginResult {
  identity: IAuthIdentity;
  token: string;
}
export interface IAuthTokenParseResult {
  identity: IAuthIdentity | null;
  authState: AuthState;
}

export class AuthService {
  static readonly TOKEN_ALG = process.env.TOKEN_ALG;
  static readonly AUTH_KEY = process.env.AUTH_KEY;
  static readonly SIG_LEN = 5;


  async login(email: string, password: string, key: string): Promise<IAuthLoginResult | null> {
    let user: IUser;
    
    try {
      const userService =  new UserService();
      user = await userService.find(password);  //password is the user's uid  
    } catch (err) {
      console.warn("Problem getting user", err);
    }

    if (user 
      && user.status === 'Active'
      && user.email.toLocaleLowerCase() === email.toLocaleLowerCase()) {
      const identity = new AuthIdentity(user);
      if (identity.isValid() && key === AuthService.AUTH_KEY) {
        identity.role = user.hash === StringHelpers.btoa(user.uid) ? 'manager' : 'viewer';
        const token = this.createToken(identity);
        return { identity, token };
      }
    }

    //else
    return null;
  }

  createToken(identity: IAuthIdentity): string | null {
    identity = new AuthIdentity(identity);
    if (identity.isValid()) {
      const header = { alg: AuthService.TOKEN_ALG };
      const payload = {
        ...identity
      };
      const signature = {
        id: identity.id,
        role: payload.role === 'manager' ? this.managerRoleSecret() : payload.role,
        key: AuthService.AUTH_KEY,
        secret: this.pickRandomFromString(AuthService.AUTH_KEY, AuthService.SIG_LEN)
      };

      const token = [
        JSON.stringify(header),
        JSON.stringify(payload),
        StringHelpers.reverse(StringHelpers.btoa(JSON.stringify(signature)))
      ];

      return token.map(btoa).join('.');
    }

    //else
    return null;

  }

  parseLoginBody(body: string): IAuthLoginBody {
    let ret = {
      email: null,
      password: null,
      key: null,
      error: null
    };
    try {
      const obj = JSON.parse(body);
      ret = {
        ...ret,
        ...obj
      };
    } catch (error) {
      ret.error = error;
    }

    return ret;
  }

  parseAuthToken(token: string): IAuthTokenParseResult {
    let identity: IAuthIdentity | null = null;
    let authState: AuthState = 'none';

    if (token) {
      try {
        const prefix = 'Bearer ';
        if (token.startsWith(prefix)) { token = token.substring(prefix.length); }
        const parts = token.split('.')
                .map(StringHelpers.atob); //each part should be encoded in BASE64
        if (parts.length === 3) {
          const header = JSON.parse(parts[0]);
          const payload = JSON.parse(parts[1]);
          const signature = JSON.parse(StringHelpers.atob(StringHelpers.reverse(parts[2])));
          if (header?.alg === AuthService.TOKEN_ALG 
            && signature?.key === AuthService.AUTH_KEY
            && signature?.secret?.length === AuthService.SIG_LEN
            && AuthService.AUTH_KEY.includes(signature?.secret)) {
              //all looks good so far
              identity = new AuthIdentity(payload);
              if (identity.isValid() && signature.id === identity.id) {
                //authenticated
                if (signature?.role === this.managerRoleSecret()) {
                  authState = 'manager';
                } else {
                  authState = 'viewer';
                }
              } else {
                authState = 'invalid';
              }
            }
        }
      } catch {
        authState = 'invalid';
      }
    }

    return { identity, authState };
  }

  private managerRoleSecret() {
    if (AuthService.AUTH_KEY.length > 10) {
      return AuthService.AUTH_KEY.substring(5,10);
    }
    //else
    return null;
  }
  private pickRandomFromString(text: string, count: number) {
    if (text?.length >= count) {
      const index = Math.floor(Math.random() * (text.length - count));
      return text.substring(index, index + count);
    }
    //else
    return null;
  }
}