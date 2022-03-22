import { ResolveError } from "@finos/fdc3";

describe("fdc3.findIntentsByContext", () => {
  it("Method is callable", async () => {
    const context = {
      type: "ThisContextDoesNotExist",
      name: "Name",
      id: {
        ticker: "ticker",
        ISIN: "US0378331005",
        CUSIP: "037833100",
        FIGI: "BBG000B9XRY4",
      },
    };

    try {
      await window.fdc3.findIntentsByContext(context);
    } catch (ex) {
      if (ex !== ResolveError.NoAppsFound) {
        throw ex;
      }
    }
  });
});
