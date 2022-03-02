describe("fdc3.joinChannel", async () => {
  it("Conformance", async () => {
    await window.fdc3.joinChannel("FDC3Conformance"); // This will hang under the Chrome Extension Desktop Agent
  });
});
