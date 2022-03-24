export default () =>
  describe("fdc3.getOrCreateChannel", () => {
    it("Method is callable", async () => {
      await window.fdc3.getOrCreateChannel("FDC3Conformance");
    });
  });
