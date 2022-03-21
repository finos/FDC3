describe("fdc3.joinChannel", () => {
  it("Method is callable", async () => {
    const channels = window.fdc3.getSystemChannels();
    await window.fdc3.joinChannel(channels[0]);
  });
});
