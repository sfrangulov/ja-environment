import Path from "path";

import JAEnvironment from "../src";
import JsonFileProvider from "../src/providers/json-file";

const provider = new JsonFileProvider({
  path: Path.join(process.cwd(), "__test_data__", "__environment__"),
});

const env = new JAEnvironment({
  provider,
});

env.init();

describe("JAEnvironment", () => {
  describe("common functions", () => {
    it("NODE_ENV equals to 'test'", () => {
      expect(env.getNodeEnv()).toEqual("test");
    });
    it("stat() returns that default and test environment is loaded", () => {
      expect(env.stat()).toEqual([
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
  });
});
