import { ITracker, Tracker } from "../models/tracker.model";
import { AirtableBaseService } from "./airtable-base.service";

export class TrackerService extends AirtableBaseService<ITracker> {
  
  constructor() {
    super(
      process.env.AT_TABLE_TRACKER,
      Tracker
    );
  }

  async getAllForUser(uid: string) {
    const filterByFormula = `{uid} = "${uid}"`;
    return this.getAll({filterByFormula}); 
  }

  async getAllForUserSingleDomain(uid: string, domain: string) {
    const filterByFormula = `AND({uid} = "${uid}", {domain} = "${domain}")`;
    return this.getGeneric({filterByFormula}); 
  }

  async getDomainsForUser(uid: string) {
    const filterByFormula = `{uid} = "${uid}"`;
    const fields = ['uid', 'domain'];
    return this.getGeneric({fields, filterByFormula}); 
  }

}