import Environment from "./environment";
import Helper from "./helper";
import JsonFileProvider from "./providers/json-file";

type Providers = JsonFileProvider;

interface Params {
  provider?: Providers;
}

export default class JAEnvironment {
  private provider: Providers;
  private environments: Map<unknown, Environment> = new Map();

  constructor({ provider = new JsonFileProvider({}) }: Params) {
    this.provider = provider;
  }

  async initAsync(): Promise<void> {
    await this.provider.initAsync();
    this.setEnvironments();
  }

  init(): void {
    this.provider.init();
    this.setEnvironments();
  }

  private setEnvironments(): void {
    for (const [name, environment] of this.provider.environments) {
      this.environments.set(name, new Environment(environment));
    }
  }

  getNodeEnv(): string {
    return Helper.getNodeEnv();
  }

  stat(): Array<unknown> {
    return this.provider.stat();
  }

  has(path: string): boolean {
    for (const [, environment] of this.environments) {
      if (environment.has(path)) {
        return true;
      }
    }
    return false;
  }

  get(path: string, defaultValue?: unknown, copy = true): any {
    for (const [, environment] of this.environments) {
      if (environment.has(path)) {
        return environment.get(path, copy);
      }
    }
    return defaultValue;
  }
}
