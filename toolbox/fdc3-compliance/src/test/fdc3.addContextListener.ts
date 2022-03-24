import { Listener } from "@finos/fdc3";

describe("fdc3.addContextListener", () => {
  let listener: Listener;

  afterEach(() => {
    if (listener !== undefined) {
      listener.unsubscribe();
      listener = undefined;
    }
  });

  it("Method is callable", async () => {
    const contextType = "fdc3.contact";
    listener = await window.fdc3.addContextListener(
      contextType,
      (info: any) => {
        console.log(
          `Context listener of type ${contextType} triggered with result ${info}`
        );
      }
    );
  });
});
