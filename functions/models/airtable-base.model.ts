export interface IAirtableBaseModel {
  key: string | null;
}
export abstract class AirtableBaseModel {
  key: string | null;

  constructor(key: string | null = null) {
    this.key = key;
  }
}