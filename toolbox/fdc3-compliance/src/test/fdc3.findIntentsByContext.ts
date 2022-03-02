describe("fdc3.findIntentsByContext", async () => {
  it("Conformance", async () => {
    await window.fdc3.findIntentsByContext({
      type: "fdc3.ViewChart",
      id: { ticker: "AAPL" },
    });
  });
});
