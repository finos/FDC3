describe("fdc3.broadcast", () => {
  it("Method is callable", async () => {
    await window.fdc3.broadcast({
      type: "fdc3.instrument",
      id: { ticker: "AAPL" },
    });
  });
});
