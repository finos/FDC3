import { ResolveError } from "@finos/fdc3";

export default () =>
  describe("fdc3.raiseIntent", async () => {
    it("Method is callable", async () => {
      const context = {
        type: "fdc3.instrument",
        name: "Apple",
        id: {
          ticker: "aapl",
          ISIN: "US0378331005",
          CUSIP: "037833100",
          FIGI: "BBG000B9XRY4",
        },
      };

      try {
        await window.fdc3.raiseIntent("ViewChart", context);
      } catch (ex) {
        if (ex !== ResolveError.NoAppsFound) {
          throw ex;
        }
      }
    });
  });
