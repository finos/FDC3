export default () =>
  describe("fdc3.leaveCurrentChannel", () => {
    it("Method is callable", async () => {
      await window.fdc3.leaveCurrentChannel();
    });
  });
