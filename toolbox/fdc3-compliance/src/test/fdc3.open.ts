import { OpenError } from "@finos/fdc3";

<<<<<<< HEAD
const ExpectedErrorNotThrownError = "Expected error AppNotFound not thrown";

export default () =>
  describe("fdc3.open", () => {
    it("Method is callable", async () => {
      try {
        await window.fdc3.open("ThisAppDoesNotExist");
        throw ExpectedErrorNotThrownError;
      } catch (ex) {
        if (ex !== OpenError.AppNotFound) {
          throw ex;
        }
=======
describe("fdc3.open", () => {
  it("Method is callable", async () => {
    try {
      await window.fdc3.open("ThisAppDoesNotExist");
    } catch (ex) {
      if (ex !== OpenError.AppNotFound) {
        throw ex;
>>>>>>> master
      }
    });
  });
