import { OpenError } from "@finos/fdc3";

const ExpectedErrorNotThrownError = "Expected error AppNotFound not thrown";

describe("fdc3.open", () => {
  it("Method is callable", async () => {
    try {
      await window.fdc3.open("ThisAppDoesNotExist");
      throw new Error(ExpectedErrorNotThrownError);
    } catch (ex) {
      if ((ex.message ?? ex) !== OpenError.AppNotFound) {
        throw new Error(ExpectedErrorNotThrownError + "\nException thrown: " + (ex.message ?? ex))
      }
    }
  });
});
