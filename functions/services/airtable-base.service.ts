import Airtable, { FieldSet, Record, Records, Table } from "airtable";

export interface IRecordSort {
  field: string;
  direction: 'asc' | 'desc';
}
export interface IGetterConfig {
  fields?: string[];
  filterByFormula?: string;
  maxRecords?: number;
  pageSize?: number;  //default is 100
  offset?: number;
  sort?: IRecordSort[];
  view?: string;  //only include records in this view
}

export abstract class AirtableBaseService<T> {
  protected readonly base: Airtable.Base;
  protected readonly table: Table<FieldSet>;
  protected readonly tableName: string;
  protected readonly modelBuilder: {new (obj?: any, id?: string): T};

  constructor(
    tableName: string,
    modelBuilder: {new (obj?: any, id?: string): T}
  ) {
    this.tableName = tableName;
    this.modelBuilder = modelBuilder;

    this.base = new Airtable({ apiKey: process.env.AT_API})
    .base(process.env.AT_BASE);

    if (!this.base) { throw new Error("AirtableService: Could not connect to base"); }

    this.table = this.base(tableName);
  }

  //TODO: add in standard error handling


  //#region >> GETTERS <<

  async find(id: string): Promise<T | null> {
    return await this.table.find(id)
      .then((resp: Record<FieldSet>) => {
        return this.postGetterSingle(resp);
      });
  }

  async get(filterByFormula: string): Promise<T | null> {
    return await this.getAll({filterByFormula})
      .then((resp: T[] | null) => {
        return resp?.length > 0 ? resp[0] : null;
      });
  }

  async exists(filterByFormula: string): Promise<boolean> {
    return await this.getAll({filterByFormula})
      .then((resp: T[] | null) => {
        return resp?.length > 0;
      });
  }

  async getAll(config?: IGetterConfig): Promise<T[] | null> {
    return await this.table.select(config)
      .all()
      .then((resp: Records<FieldSet>) => {
        return this.postGetterMultiple(resp);
      });
  }

  //#endregion

  //#region >> SETTERS <<

  async create(data: T): Promise<T | null> {
    return await this.table.create(data)
      .then((resp: Record<FieldSet>) => {
        return this.postGetterSingle(resp);
      });
  }

  //#endregion

  //#region >> HELPERS (can be overridden in service)<<

  protected postGetterSingle(resp: Record<FieldSet>): T | null {
    if (resp) {
      return new this.modelBuilder(resp.fields, resp.id);
    }
    //else
    return null;
  }
  protected postGetterMultiple(resp: Records<FieldSet>): T[] | null {
    if (Array.isArray(resp)) {
      return resp
        .map(obj => this.postGetterSingle(obj));
    }
    //else
    return null;
  }

  //#endregion
}