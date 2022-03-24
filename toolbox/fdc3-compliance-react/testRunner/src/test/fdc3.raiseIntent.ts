import { ResolveError } from "@finos/fdc3";

const ExpectedErrorNotThrownError = "Expected error NoAppsFound not thrown";

export default () =>
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
        throw ExpectedErrorNotThrownError;
      } catch (ex) {
        if (ex !== ResolveError.NoAppsFound) {
          throw ex;
        }
      }
    });
  });
