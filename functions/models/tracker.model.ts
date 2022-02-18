import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { StringHelpers } from "../utils/string-helpers";
dayjs.extend(utc);

import { AirtableBaseModel, IAirtableBaseModel } from "./airtable-base.model";


export interface ITracker extends IAirtableBaseModel {
  id: string;
  uid: string;
  name: string;
  domain: string;
  url: string;
  notes?: string;
  due?: dayjs.Dayjs;
}

export interface ITrackerCreateDto {
  id: string;
  uid: string;
  name: string;
  domain: string;
  url: string;
  notes?: string;
  due?: string;
}



export class Tracker extends AirtableBaseModel implements ITracker {
  id: string = '';
  uid: string = '';
  name: string = '';
  domain: string = '';
  url: string = '';
  notes?: string;
  due?: dayjs.Dayjs;

  constructor(obj: any = null, key: string = null) {
    super(key);

    this.id = Tracker.GenerateTrackerId();

    if (obj) {
      this.id = obj.id || this.id;
      this.uid = obj.uid;
      this.name = obj.name;
      this.domain = obj.domain;
      this.url = obj.url;
      this.notes = obj.notes;
      if (obj.due) {
        this.due = dayjs.utc(obj.due);  //come in as UTC
      }
    }
  }

  static Deserialize(body: string): Tracker | null {
    try {
      const obj = JSON.parse(body);
      return new Tracker(obj);
    } catch (error) {
      console.warn("Could not deserialize tracker record", {error, body});
      return null;
    }
  }
  static GenerateTrackerId(size: number = 10) {
    return StringHelpers.generateId(size);
  }

}