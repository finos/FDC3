describe("fdc3.broadcast", async () => {
  it("Conformance", async () => {
    window.fdc3.broadcast({
      type: "fdc3.instrument",
      id: { ticker: "AAPL" },
    });
  });
});
