import { getClientAPI } from "@kite9/client";

const init = async () => {
    const fdc3 = await getClientAPI();
    console.log("get fdc3", fdc3);

    
    const cc = await fdc3.getCurrentChannel()

    if (cc == null) {
        const channels = await fdc3.getUserChannels()
        await fdc3.joinUserChannel(channels[0].id)
    }

    const stx: any = window.stxx;

	try {
		stx.callbacks.symbolChange = () => {
            const ticker = stx.chart.symbol;
            fdc3.broadcast({
                type: "fdc3.instrument",
                name: ticker,
                id: {ticker}
            });
        };
	} catch (err) {
		console.error("Component initialization failed: ", err);
	}
};


window.addEventListener("load", init);