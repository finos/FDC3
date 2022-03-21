import { ResolveError } from "@finos/fdc3";

describe("fdc3.findIntent", () => {
  it("Method is callable", async () => {
    try {
      await window.fdc3.findIntent("ThisIntentDoesNotExist");
    } catch (ex) {
      if (ex !== ResolveError.NoAppsFound) {
        throw ex;
      }
    }
  });
});
