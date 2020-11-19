import Path from "path";
import process from "process";

import jsonc from "jsonc";
import { defaults } from "lodash/defaults";
import { get } from "lodash/get";

enum FileStates {
    NotLoaded = 1,
    Loaded,
    NotFound
  }

interface File {
    state: FileStates
}

class JAEnvironment {
  private NODE_ENV: string = process.env.NODE_ENV
    ? process.env.NODE_ENV
    : "development";
  private path: string;
  private files:Map<unknown, File> = new Map();

  constructor(path: string = Path.join(process.cwd(), "__environment__")) {
    this.path = path;
    this.files.set("default", { state: FileStates.NotLoaded, xxx: 1 });
    this.files.set(this.nodeEnv(), { state: FileStates.NotLoaded });
  }

  nodeEnv(): string {
    return this.NODE_ENV;
  }

  get(path: string): any {
    return this.path;
  }
}

export default JAEnvironment;
