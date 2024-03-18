import { getClientAPI } from 'client'

/**
 * This demonstrates using the API via a promise
 */
getClientAPI().then(async fdc3 => {
    console.log("in promise")

    fdc3.addIntentListener("ViewNews", context => {
        const msg = document.createElement("p");
        msg.textContent = "Received News!: " + JSON.stringify(context);
    })

    fdc3.addIntentListener("ViewQuote", context => {
        const msg = document.createElement("p");
        msg.textContent = "Received Quote!: " + JSON.stringify(context);
    })
});
