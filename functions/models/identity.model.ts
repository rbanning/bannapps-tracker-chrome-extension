

export interface IAuthIdentity {
  id: string;
  name: string;
  contact?: string;
  isValid: () => boolean;
}

export class AuthIdentity implements IAuthIdentity {
  id: string = '';
  name: string = '';
  contact?: string;

  constructor(obj: any = null) {
    if (obj) {
      this.id = obj.id || obj.uid || this.id;
      this.name = obj.name || this.name;
      this.contact = obj.contact || obj.email || obj.phone || this.contact;
    }
  }

  isValid() {
    return !!this.id && !!this.name;
  }

  static Deserialize(body: string): AuthIdentity | null {
    try {
      const obj = JSON.parse(body);
      return new AuthIdentity(obj);
    } catch (error) {
      console.warn("Could not deserialize identity", {error, body});
      return null;
    }
  }
}
