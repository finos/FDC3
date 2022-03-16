export default () =>
  describe("fdc3.broadcast", async () => {
    it("Method is callable", async () => {
      window.fdc3.broadcast({
        type: "fdc3.instrument",
        id: { ticker: "AAPL" },
      });
    });
  });
