import process from "process";

export default class Helper {
  static getNodeEnv(): string {
    return process.env.NODE_ENV ? process.env.NODE_ENV : "development";
  }

  static getEnvSecret(): string {
    return process.env.ENV_SECRET ? process.env.ENV_SECRET : "";
  }
}
