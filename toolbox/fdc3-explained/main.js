
const fdc3OnReady = (cb) => window.fdc3 ? cb() : window.addEventListener('fdc3Ready', cb)

// use this to keep track of context listener - one per system channel
let contextListener = {};
let appChannels = []

fdc3OnReady(main)

function main() {
  console.log("FDC3 is ready")
  populateHTML()
  getPlatform()
  displayFDC3Support()
}

async function populateHTML() {

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
}

function displayFDC3Support() {
  let supportedElement = document.getElementById("fdc3-support")
  if (window.fdc3) { supportedElement.innerHTML = "Yes ✅" } else { supportedElement.innerHTML = "No ❌" }
}


/**
 *Populate the channel dropdown elements
 * @param {HTMLElement} dropdownElement is a dom selector
 */
async function populateChannels(dropdownElement) {
  if (!dropdownElement) return new Error("No dropdown element provided")

  const systemChannels = await fdc3.getSystemChannels();
  systemChannels.forEach(({ displayMetadata, id, type }, key) => { dropdownElement[key] = new Option(displayMetadata.name, key) });
}



async function broadcastFDC3Context() {
  // get the channel
  let dropdownElement = document.getElementById("broadcast-channel")
  let channelName = dropdownElement.options[dropdownElement.selectedIndex].text.toLowerCase();
  let channel = await fdc3.getOrCreateChannel(channelName);

  // send the data
  let contextData = document.getElementById('txtBroadcastData').value;
  channel.broadcast(JSON.parse(contextData));
}


async function getContext(contextType) {

  let dropdownElement = document.getElementById("context-channel")
  let channelName = dropdownElement.options[dropdownElement.selectedIndex].text.toLowerCase();
  let channel = await fdc3.getOrCreateChannel(channelName);

  let contextResultBox = document.getElementById("context-result");

  // check to see if there is already a context listener for this channel, if so unsubscribe
  if (contextListener[channelName]) {
    contextListener[channelName].unsubscribe();
  }

  // if context type is passed in then only listen on that specific context
  if (contextType) {
    contextListener[channelName] = channel.addContextListener(contextType, (context) => contextResultBox.value = JSON.stringify(context))
  } else {
    contextListener[channelName] = channel.addContextListener(context => contextResultBox.value = JSON.stringify(context));
  }
}


async function addAppChannel() {
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
}



function getPlatform() {

  // Special case for Openfin to read App Name
  if (window.FSBL) {
    window.FSBL.getFSBLInfo().then((info) => {
      document.getElementById('providerDetails').innerHTML = info.FSBLVersion;
    });
  } else if (window.fin) {
    fin.desktop.Application.getCurrent().getInfo((info) => {
      document.getElementById('providerDetails').innerHTML = info.manifest.startup_app.name
    });
  } else if (window.fdc3) {
    document.getElementById('providerDetails').innerHTML = "FDC3 Desktop Agent Chrome Extension";
  }
  else {
    return
  }

}


function appLoader() {

  let myUrl = document.getElementById('appUrl').value;

  if (myUrl.length > 0) {

    window.open(myUrl);

  }
}