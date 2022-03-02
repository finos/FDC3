describe("fdc3.raiseIntentForContext", async () => {
  it("Conformance", async () => {
    const context = {
      type: "fdc3.instrument",
      name: "Apple",
      id: {
        ticker: "aapl",
        ISIN: "US0378331005",
        CUSIP: "037833100",
        FIGI: "BBG000B9XRY4",
      },
    };

    await window.fdc3.raiseIntentForContext(context);
  });
});
