import Path from "path";
import fs from "fs";
import util from "util";

import { jsonc } from "jsonc";

import BaseProvider from "./base-provider";
import { EStates } from "../environment";

interface Params {
  path?: string;
}

class JsonFileProvider extends BaseProvider {
  private path: string;

  constructor({ path = Path.join(process.cwd(), "__environment__") }: Params) {
    super();
    this.path = path;
  }

  async initAsync(): Promise<void> {
    await this.loadAsync();
  }

  init(): void {
    this.load();
  }

  protected async loadAsync(): Promise<void> {
    const exist = util.promisify(fs.exists);
    const readdir = util.promisify(fs.readdir);
    const files = (await exist(this.path)) ? await readdir(this.path) : [];
    const fileByName = (name) => {
      return files.find(
        (file) => file === `${name}.json` || file === `${name}.jsonc`
      );
    };
    for (const [name, environment] of this.environments) {
      const file = fileByName(name);
      if (file) {
        try {
          const data = await jsonc.safe.read(Path.join(this.path, file));
          environment.data = data;
          environment.state = EStates.Loaded;
        } catch (e) {
          environment.state = EStates.Error;
          environment.error = e.message;
        }
      } else {
        environment.state = EStates.NotFound;
      }
    }
  }

  protected load(): void {
    const files = fs.existsSync(this.path) ? fs.readdirSync(this.path) : [];
    const fileByName = (name) => {
      return files.find(
        (file) => file === `${name}.json` || file === `${name}.jsonc`
      );
    };
    for (const [name, environment] of this.environments) {
      const file = fileByName(name);
      if (file) {
        const [error, data] = jsonc.safe.readSync(Path.join(this.path, file));
        if (error) {
          environment.state = EStates.Error;
          environment.error = error.message;
        } else {
          environment.data = data;
          environment.state = EStates.Loaded;
        }
      } else {
        environment.state = EStates.NotFound;
      }
    }
  }
}

export default JsonFileProvider;
