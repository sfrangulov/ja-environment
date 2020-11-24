import Path from "path";
import process from "process";

import { JAEnvironment, JsonFileProvider, Encryptor } from "../src";

process.env.ENV_SECRET = "janvironment1234"

const provider = new JsonFileProvider({
  path: Path.join(process.cwd(), "__test_data__", "__environment__")
});

const env = new JAEnvironment({
  provider
});

env.init();

describe("JAEnvironment", () => {
  describe("common functions", () => {
    it("NODE_ENV equals to 'test'", () => {
      expect(env.getNodeEnv()).toEqual("test");
    });
    it("status() returns that default and test environment is loaded", () => {
      expect(env.status()).toEqual([
        { name: "test", state: "Loaded" },
        { name: "default", state: "Loaded" },
      ]);
    });
  });
  describe("has()", () => {
    it("has('test') equals to true", () => {
      expect(env.has("test")).toEqual(true);
    });

    it("has('test1') equals to false", () => {
      expect(env.has("test1")).toEqual(false);
    });

    it("has('level_1.level_2') equals to true", () => {
      expect(env.has("level_1.level_2")).toEqual(true);
    });

    it("has('level_1.level_2_2') equals to flase", () => {
      expect(env.has("level_1.level_2_2")).toEqual(false);
    });
  });
  describe("get()", () => {
    it("get('test') equals to 'it is a test'", () => {
      expect(env.get("test")).toEqual("it is a test");
    });
    it("get('default') equals to 'it is a default'", () => {
      expect(env.get("default")).toEqual("it is a default");
    });
    it('get(\'level_1.level_2.level_3_1\') equals to { a: "a", b: "b" }', () => {
      expect(env.get("level_1.level_2.level_3_1")).toEqual({
        a: "a",
        b: "b",
      });
    });
    it("get('default_2') equals to undefined'", () => {
      expect(env.get("default_2")).toEqual(undefined);
    });
    it("get('test', 'default value for test') equals to 'it is a test'", () => {
      expect(env.get("test", "default value for test")).toEqual("it is a test");
    });
    it("get('test_1', 'default value for test_1') equals to 'it is a test'", () => {
      expect(env.get("test1", "default value for test1")).toEqual(
        "default value for test1"
      );
    });
    it("deepCopy() test", () => {
      const value: Record<string, unknown> = env.get(
        "level_1.level_2.level_3_1"
      );
      delete value.a;
      value.c = "c";
      expect(env.get("level_1.level_2.level_3_1")).toEqual({
        a: "a",
        b: "b",
      });
    });

    it("disable deepCopy() test", () => {
      const value: Record<string, unknown> = env.get(
        "level_1.level_2.level_3_1",
        undefined,
        false
      );
      delete value.a;
      value.c = "c";
      expect(env.get("level_1.level_2.level_3_1")).toEqual({
        b: "b",
        c: "c",
      });
    });
  });
});

describe("Encryptor", () => {
  /*it("encrypt/decrypt test", () => {
    const encryptor = new Encryptor({
      key: "1234567890123456",
    });
    expect(encryptor.decrypt(encryptor.encrypt(env.get("default")))).toEqual(
      env.get("default")
    );
  });*/
  it("secret", () => {
    expect(env.get("section.secret")).toEqual("secret");
  });
});
