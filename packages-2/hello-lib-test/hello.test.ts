import { hello } from "hello-lib";

describe("hello", () => {
  it("hello jkl", () => {
    expect(hello("jkl")).toEqual("Hello, jkl");
  });

  it("hello uiop", () => {
    expect(hello("uiop")).toEqual("Hello, uiop");
  });
});
