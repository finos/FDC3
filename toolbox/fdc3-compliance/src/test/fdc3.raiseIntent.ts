describe("fdc3.raiseIntent", async () => {
  it("Conformance", async () => {
    await window.fdc3.raiseIntent("StartChat", {
      type: "fdc3.contact",
      name: "Nick Kolba",
      id: {
        email: "nick@openfin.co",
      },
    });
  });
});
