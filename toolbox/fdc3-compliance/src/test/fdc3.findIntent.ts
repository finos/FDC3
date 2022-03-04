import { ResolveError } from "@finos/fdc3";

describe("fdc3.findIntent", async () => {
  it("Method is callable", async () => {
    try {
      await window.fdc3.findIntent("ViewChart");
    } catch (ex) {
      if (ex !== ResolveError.NoAppsFound) {
        throw ex;
      }
    }
  });
});
