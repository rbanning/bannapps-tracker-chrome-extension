
export class DateModel {
  protected _raw: number;
  protected _year: number;
  protected _month: number;
  protected _day: number;
  protected _hr: number;
  protected _min: number;
  protected _sec: number;

  constructor(source: Date | string | number, isUtc: boolean = true) {
    if (typeof(source) === 'string') {
      this._raw = Date.parse(source);
    } else if (typeof(source) === 'number') {
      this._raw = source;
    } else if (source instanceof Date) {
      this._raw = source.getTime();
    }

    if (this._raw) {
      this.reset();
    }
  }

  protected reset() {

  }
}