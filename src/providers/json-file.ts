import Path from "path";
import fs from "fs";

import { jsoncSafe } from "jsonc/lib/jsonc.safe";
import { IReadOptions } from "jsonc/lib/interfaces";

import BaseProvider from "./base-provider";
import { EStates } from "../environment";

import Helper from "../helper";
import { Encryptor } from "..";

interface Params {
  path?: string;
  encrypt?: boolean;
}

class JsonFileProvider extends BaseProvider {
  private path: string;
  private encrypt: boolean;
  private encryptor: Encryptor;
  private filesExt = {
    decrypted: [".json", ".jsonc"],
    encrypted: [".jsone", ".jsonce"],
  };

  constructor({ path = Path.join(process.cwd(), "__environment__") }: Params) {
    super();
    this.path = path;
    this.encrypt = Helper.getEnvSecret() !== "";
    if (this.encrypt) {
      this.encryptor = new Encryptor({ key: Helper.getEnvSecret() });
    }
  }

  init(): void {
    this.load();
  }

  private generateFileNames(name: string, type: string) {
    return this.filesExt[type].map((ext) => `${name}${ext}`);
  }

  private getFiles(type?: string) {
    let files = fs.existsSync(this.path) ? fs.readdirSync(this.path) : [];
    if (type) {
      files = files.filter(
        (file) => this.filesExt[type].indexOf(Path.extname(file)) !== -1
      );
    }
    return files;
  }

  private encryptFiles() {
    const files = this.getFiles("decrypted");
    for (const file of files) {
      const [error, data] = jsoncSafe.readSync(Path.join(this.path, file), {
        reviver: this.reviverEncrypt(this.encryptor),
      });
      if (!error) {
        jsoncSafe.writeSync(Path.join(this.path, `${file}e`), data, {
          space: 2,
        });
      }
    }
  }

  private decryptFiles() {
    const files = this.getFiles("encrypted");
    for (const file of files) {
      const [error, data] = jsoncSafe.readSync(Path.join(this.path, file), {
        reviver: this.reviverDecrypt(this.encryptor),
      });
      if (!error) {
        jsoncSafe.writeSync(
          Path.join(this.path, file.substring(0, file.length - 1)),
          data,
          {
            space: 2,
          }
        );
      }
    }
  }

  private deleteDecryptedFiles() {
    const files = this.getFiles("decrypted");
    for (const file of files) {
      //
    }
  }

  protected load(): void {
    if (this.encrypt) {
      this.encryptFiles();
      if (["development", "test"].indexOf(Helper.getNodeEnv()) !== -1) {
        this.decryptFiles();
      } else {
        this.deleteDecryptedFiles();
      }
    }
    const files = this.getFiles();
    const fileByName = (name) => {
      return files.find(
        (file) =>
          this.generateFileNames(
            name,
            this.encrypt ? "encrypted" : "decrypted"
          ).indexOf(file) !== -1
      );
    };
    for (const [name, environment] of this.environments) {
      const file = fileByName(name);
      if (file) {
        const options: IReadOptions = {};
        if (this.encrypt) {
          options.reviver = this.reviverDecryptLoad(this.encryptor);
        }
        const [error, data] = jsoncSafe.readSync(
          Path.join(this.path, file),
          options
        );
        if (error) {
          environment.state = EStates.Error;
          environment.error = error.message;
          // console.error(error.message);
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
