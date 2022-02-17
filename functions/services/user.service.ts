import { IUser, User } from "../models/user.model";
import { AirtableBaseService } from "./airtable-base.service";

export class UserService extends AirtableBaseService<IUser> {

  constructor() {
    super(
      process.env.AT_TABLE_USERS,   //name of the user table
      User                          //the class associated with IUser
    );
  }
}