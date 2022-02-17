
export type UserStatus = 'Pending' | 'Active' | 'Under Review' | 'Suspended';

export interface IUser {
  uid: string;
  status: UserStatus;
  name?: string;
  email?: string;
  phone?: string;
  notes?: string;
}

export class User implements IUser {
  uid: string;
  status: UserStatus;
  name?: string;
  email?: string;
  phone?: string;
  notes?: string;

  constructor(obj: any = null) {
    this.uid = User.GenerateUserId();
    this.status = 'Pending';
    if (obj) {
      this.uid = obj.uid || this.uid;
      this.status = obj.status || this.status;
      this.name = obj.name;
      this.email = obj.email;
      this.phone = obj.phone;
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
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'.split('');
    let ret = '';
    while (ret.length < size) {
      ret += chars[Math.floor(Math.random() * chars.length)];
    }
    return ret;
  }
}