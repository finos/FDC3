import { OpenError } from "@finos/fdc3";

describe("fdc3.open", () => {
  it("Method is callable", async () => {
    try {
      await window.fdc3.open("ThisAppDoesNotExist");
    } catch (ex) {
      if (ex !== OpenError.AppNotFound) {
        throw ex;
      }
    }
  });
});
