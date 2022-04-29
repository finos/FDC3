import { ResolveError } from "@finos/fdc3";

const ExpectedErrorNotThrownError = "Expected error NoAppsFound not thrown";

describe("fdc3.raiseIntent", async () => {
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
      await window.fdc3.raiseIntent("ThisIntentDoesNotExist", context);
      throw new Error(ExpectedErrorNotThrownError);
    } catch (ex) {
      if ((ex.message ?? ex) !== ResolveError.NoAppsFound) {
        throw new Error(ExpectedErrorNotThrownError + "\nException thrown: " + (ex.message ?? ex));
      }
    }
  });
});
