<<<<<<< HEAD
export default () =>
  describe("fdc3.joinChannel", () => {
    afterEach(async () => {
      await window.fdc3.leaveCurrentChannel();
    });

    it("Method is callable", async () => {
      const channels = await window.fdc3.getSystemChannels();

      if (channels.length > 0) {
        await window.fdc3.joinChannel(channels[0].id);
      } else {
        throw Error("No system channels are available");
      }
    });
=======
describe("fdc3.joinChannel", () => {
  afterEach(async () => {
    window.fdc3.leaveCurrentChannel();
  });

  it("Method is callable", async () => {
    const channels = await window.fdc3.getSystemChannels();

    if (channels.length > 0) {
      await window.fdc3.joinChannel(channels[0].id);
    } else {
      throw Error("No system channels are available");
    }
>>>>>>> master
  });
