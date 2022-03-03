import { OpenError } from "@finos/fdc3";

describe("fdc3.open", async () => {
  it("Method is callable", async () => {
    try {
      window.fdc3.open("fdc3-workbench");
    } catch (ex) {
      if (ex !== OpenError.AppNotFound) {
        throw ex;
      }
    }
  });
});
