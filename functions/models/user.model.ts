import { StringHelpers } from "../utils/string-helpers";
import { AirtableBaseModel, IAirtableBaseModel } from "./airtable-base.model";

export type UserStatus = 'Pending' | 'Active' | 'Under Review' | 'Suspended';

export interface IUser extends IAirtableBaseModel {
  uid: string;
  status: UserStatus;
  name?: string;
  email?: string;
  phone?: string;
  hash?: string;
  notes?: string;
}

export class User extends AirtableBaseModel implements IUser {
  uid: string;
  status: UserStatus;
  name?: string;
  email?: string;
  phone?: string;
  hash?: string;
  notes?: string;

  constructor(obj: any = null, key: string | null = null) {
    super(key);

    this.uid = User.GenerateUserId();
    this.status = 'Pending';
    if (obj) {
      this.key = obj.key || this.key; //for deserializing
      this.uid = obj.uid || this.uid;
      this.status = obj.status || this.status;
      this.name = obj.name;
      this.email = obj.email;
      this.phone = obj.phone;
      this.hash = obj.hash;
      this.notes = obj.notes;
    }
  }

  static Deserialize(body: string): User | null {
    try {
      const obj = JSON.parse(body);
      return new User(obj);
    } catch (error) {
      console.warn("Could not deserialize user", {error, body});
      return null;
    }
  }
  static GenerateUserId(size: number = 6) {
    return StringHelpers.generateId(size);
  }
}