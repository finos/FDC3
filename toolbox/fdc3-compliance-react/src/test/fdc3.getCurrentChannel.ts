export default () =>
  describe("fdc3.getCurrentChannel", async () => {
    it("Method is callable", async () => {
      await window.fdc3.getCurrentChannel();
    });
  });
