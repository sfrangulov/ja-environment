import { Encryptor } from "..";
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

  abstract init(): void;

  protected abstract load(): void;

  get environments(): Map<unknown, IEnvironment> {
    return this._environments;
  }

  status(): Array<unknown> {
    return Array.from(this._environments).map(([name, env]) => {
      return {
        name,
        state: env.state,
      };
    });
  }

  protected reviverEncrypt(encryptor: Encryptor) {
    return function (key: string, value: string): unknown {
      if (key[0] === "!") {
        if (key.indexOf('!!') === 0) {
          return encryptor.encrypt(JSON.stringify(value));
        } else {
          return encryptor.encrypt(value);
        }
      }
      return value;
    };
  }

  protected reviverDecrypt(encryptor: Encryptor) {
    return function (key: string, value: string): unknown {
      if (key[0] === "!") {
        if (key.indexOf('!!') === 0) {
          return JSON.parse(encryptor.decrypt(value));
        } else {
          return encryptor.decrypt(value);
        }
      }
      return value;
    };
  }

  protected reviverDecryptLoad(encryptor: Encryptor) {
    return function (key: string, value: string): unknown {
      if (key[0] === "!") {
        if (key.indexOf('!!') === 0) {
          this[key.substring(2)] = JSON.parse(encryptor.decrypt(value));
        } else {
          this[key.substring(1)] = encryptor.decrypt(value);
        }
        return;
      }
      return value;
    };
  }
}

export default BaseProvider;
