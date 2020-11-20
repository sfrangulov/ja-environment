import { get, hasIn } from "lodash";

export enum EStates {
  NotLoaded = "NotLoaded",
  Loaded = "Loaded",
  NotFound = "NotFound",
  Error = "Error"
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

  has(path: string): boolean {
    return hasIn(this.data, path);
  }

  get(path: string): unknown {
    return get(this.data, path);
  }
}
