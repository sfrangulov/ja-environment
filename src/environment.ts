
import has from "lodash/has";
import get from "lodash/get";

export enum EStates {
  NotLoaded = "NotLoaded",
  Loaded = "Loaded",
  NotFound = "NotFound",
  Error = "Error",
}

export interface IEnvironment {
  name: string;
  state: EStates;
  data?: unknown; // Record<string, unknown> | Array<Record<string, unknown>>;
  error?: string;
}

export default class Environment implements IEnvironment {
  name;
  state;
  data;
  error;

  constructor(environment: IEnvironment) {
    this.name = environment.name;
    this.state = environment.state;
    this.data = environment.data || {}; // NOTE: ?? - не работает в nodejs 12
  }

  private deepCopy(original) {
    return JSON.parse(JSON.stringify(original));
  }

  has(path: string): boolean {
    return has(this.data, path);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get(path: string, copy = true): any {
    return copy ? this.deepCopy(get(this.data, path)) : get(this.data, path);
  }
}
