import JAEnvironment from "../src";

const env = new JAEnvironment();

describe("JAEnvironment", () => {
  it("NODE_ENV equals to 'test'", () => {
    expect(env.nodeEnv()).toEqual("test");
  });
});
