import { getClientAPI } from '@kite9/client'

/**
 * This demonstrates using the API via a promise
 */
getClientAPI().then(async fdc3 => {
    console.log("in promise")
    const log = document.getElementById("log");
    const reso = await fdc3.raiseIntent("ViewQuote", {
        type: "fdc3.instrument",
        id: {
            isin: "Abc123"
        }
    })

    log!!.textContent = `Got resolution: ${JSON.stringify(reso)}`
    const result = await reso.getResult()
    log!!.textContent += `Got result: ${JSON.stringify(result)}`
});
