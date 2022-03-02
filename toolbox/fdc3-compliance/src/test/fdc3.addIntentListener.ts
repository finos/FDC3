describe("fdc3.addIntentListener", async () => {
  it("Conformance", async () => {
    await window.fdc3.addIntentListener(
      "fdc3.conformanceListener",
      (info: any) => {
        console.log(`Context listener triggered for ${info}`);
      }
    );
  });
});
