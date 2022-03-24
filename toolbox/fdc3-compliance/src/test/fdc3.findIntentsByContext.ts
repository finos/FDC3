import { ResolveError } from "@finos/fdc3";

<<<<<<< HEAD
const ExpectedErrorNotThrownError = "Expected error NoAppsFound not thrown";
=======
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
>>>>>>> master

export default () =>
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
        throw ExpectedErrorNotThrownError;
      } catch (ex) {
        if (ex !== ResolveError.NoAppsFound) {
          throw ex;
        }
      }
    });
  });
