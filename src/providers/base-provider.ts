import { IEnvironment, EStates } from "../environment";
import Helper from "../helper";

abstract class BaseProvider {
  protected _environments: Map<unknown, IEnvironment> = new Map();

  constructor() {
    this._environments.set(Helper.getNodeEnv(), {
      name: Helper.getNodeEnv(),
      state: EStates.NotLoaded,
    });
    this._environments.set("default", {
      name: "default",
      state: EStates.NotLoaded,
    });
  }

  abstract async initAsync(): Promise<void>;

  abstract init(): void;

  protected abstract async loadAsync(): Promise<void>;

  protected abstract load(): void;

  get environments(): Map<unknown, IEnvironment> {
    return this._environments;
  }

  stat(): Array<unknown> {
    return Array.from(this._environments).map(([name, env]) => {
      return {
        name,
        state: env.state,
      };
    });
  }
}

export default BaseProvider;
