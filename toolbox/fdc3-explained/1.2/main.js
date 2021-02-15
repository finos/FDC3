// check for FDC3 support
function fdc3OnReady(cb) {
  if (window.fdc3) { cb() }
  else { window.addEventListener('fdc3Ready', cb) }
}
// Wait for the document to load
function documentLoaded(cb) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', cb)
  } else { cb() }
}

//  document and FDC3 have loaded start the main function
documentLoaded(() => fdc3OnReady(main))

// use this to keep track of context listener - one per system channel
let contextListener = null;
let appChannels = []

function main() {
  try {
    console.log("FDC3 is ready and DOM has rendered")
    populateHTML()
    getPlatform()
    displayFDC3Support()
    getContext()
  } catch (error) {
    console.error(error)
  }
}


async function populateHTML() {
  try {
    // populate all the dropdowns for system channels
    let channelDropdownList = document.querySelectorAll(".fdc3-channels")
    channelDropdownList.forEach(channelDropdown => populateChannels(channelDropdown))

    //populate available channels list with system channels
    let channelList = document.getElementById("system-channel-list");

    const systemChannels = await fdc3.getSystemChannels();

    systemChannels.forEach(({ displayMetadata, id, type }, key) => {
      let node = document.createElement("li");
      let textNode = document.createTextNode(displayMetadata.name);
      node.appendChild(textNode);
      channelList.appendChild(node);
    });

    // add an event listener for the contextType input box
    let contextTypeInput = document.getElementById("context-type");

    // Only get context type when the user hits enter
    contextTypeInput.addEventListener("keyup", function (event) {
      if (event.key === "Enter") {
        event.preventDefault();

        let contextType = event.target.value;
        getContext(contextType)
      }
    });
  } catch (error) {
    console.error("unable to populate the html for the page ", error);
  }

}

function displayFDC3Support() {
  try {
    let supportedElement = document.getElementById("fdc3-support")
    if (window.fdc3) { supportedElement.innerHTML = "Yes ✅" } else { supportedElement.innerHTML = "No ❌" }
  } catch (error) {
    console.error("can't find FDC3 support", error)
  }

}


function getPlatform() {

  // TODO: add G42 to vendors
  if (window.FSBL) {
    window.FSBL.getFSBLInfo().then((info) => {
      document.getElementById('providerDetails').innerHTML = "Finsemble Version:" + info.FSBLVersion;
    });
  } else if (window.fin) {
    fin.desktop.Application.getCurrent().getInfo((info) => {
      document.getElementById('providerDetails').innerHTML = info.manifest.startup_app.name
    });
  } else if (window.fdc3) {
    document.getElementById('providerDetails').innerHTML = "FDC3 Desktop Agent Chrome Extension";
  }
  else {
    // no need to update the DOM there is already a default message just return
    return
  }

}


/**
 *Populate the channel dropdown elements
 * @param {HTMLElement} dropdownElement is a dom selector
 */
async function populateChannels(dropdownElement) {
  try {

    if (!dropdownElement) return new Error("No dropdown element provided")

    const systemChannels = await fdc3.getSystemChannels();
    systemChannels.forEach(({ displayMetadata, id, type }, key) => { dropdownElement[key] = new Option(displayMetadata.name, key) });

  } catch (error) {
    console.error("could not find system channels when populating the dropdown", error);
  }

}

function joinChannel() {
  try {
    let dropdownElement = document.getElementById("join-channel")
    let channelName = dropdownElement.options[dropdownElement.selectedIndex].text.toLowerCase();
    fdc3.joinChannel(channelName);
  } catch (error) {
    console.error("Can't join channel", error)
  }

}

async function broadcastFDC3Context() {
  try {
    let contextData = document.getElementById('txtBroadcastData').value;
    fdc3.broadcast(JSON.parse(contextData));
  } catch (error) {
    console.error("could not broadcast", error)
  }

}


async function getContext(contextType) {
  try {
    let contextResultBox = document.getElementById("context-result");
    if (contextListener) contextListener.unsubscribe();

    // if context type is passed in then only listen on that specific context
    if (contextType) {
      contextListener = fdc3.addContextListener(contextType, (context) => contextResultBox.innerText = JSON.stringify(context, null, 2))
    } else {
      contextListener = fdc3.addContextListener(context => contextResultBox.innerText = JSON.stringify(context, null, 2));
    }
  } catch (error) {
    console.error("Unable to add a context listener", error)
  }
}


async function addAppChannel() {
  try {
    let appChannelName = document.getElementById("app-channel").value;

    if (appChannelName) {
      let newAppChannel = await fdc3.getOrCreateChannel(appChannelName)
      appChannels.push(newAppChannel);

      // add to the list of available app channels
      let node = document.createElement("li");
      let textNode = document.createTextNode(appChannelName);
      node.appendChild(textNode);
      document.getElementById("app-channel-list").appendChild(node);

    } else {
      throw new Error("no channel name set")
    }
  } catch (error) {
    console.error("could not add an app channel", error);
  }
}


async function raiseIntent() {
  try {
    // get the channel
    let intent = document.getElementById("intent").value;
    let context = JSON.parse(document.getElementById("intent-context").value);

    // TODO: add the target param
    await fdc3.raiseIntent(intent, context)
  } catch (err) {
    console.error("intent did not resolve", err)
  }
}