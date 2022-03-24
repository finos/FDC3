import { ResolveError } from "@finos/fdc3";

<<<<<<< HEAD
const ExpectedErrorNotThrownError = "Expected error NoAppsFound not thrown";

export default () =>
  describe("fdc3.findIntent", () => {
    it("Method is callable", async () => {
      try {
        await window.fdc3.findIntent("ThisIntentDoesNotExist");
        throw ExpectedErrorNotThrownError;
      } catch (ex) {
        if (ex !== ResolveError.NoAppsFound) {
          throw ex;
        }
=======
describe("fdc3.findIntent", () => {
  it("Method is callable", async () => {
    try {
      await window.fdc3.findIntent("ThisIntentDoesNotExist");
    } catch (ex) {
      if (ex !== ResolveError.NoAppsFound) {
        throw ex;
>>>>>>> master
      }
    });
  });
