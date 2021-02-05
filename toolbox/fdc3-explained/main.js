
const fdc3OnReady = (cb) => window.fdc3 ? cb() : window.addEventListener('fdc3Ready', cb)

// use this to keep track of context listener
// TODO: this will have to be linked to the channel?

let contextListener;

fdc3OnReady(main)

function main() {
  console.log("FDC3 is ready")
  populateHTML()
}

function populateHTML() {

  // populate all the dropdowns for system channels
  let channelDropdownList = document.querySelectorAll(".fdc3-channels")
  channelDropdownList.forEach(channelDropdown => populateChannels(channelDropdown))

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
  console.log(channel)

  // send the data
  let contextData = document.getElementById('txtBroadcastData').value;
  channel.broadcast(JSON.parse(contextData));
}


function getContext() {
  let contextResultBox = document.getElementById("context-result");
  if (contextListener) {
    contextListener.unsubscribe();
  }
  contextListener = fdc3.addContextListener(context => contextResultBox.value = context);
}

function getPlatform() {

  // Special case for Openfin to read App Name
  if (window.FSBL) {
    window.FSBL.getFSBLInfo().then((info) => {
      document.getElementById('providerDetails').innerHTML = 'Available - Finsemble ' + info.FSBLVersion;
    });
  } else if (window.fin) {
    fin.desktop.Application.getCurrent().getInfo((info) => {
      document.getElementById('providerDetails').innerHTML = 'Available - ' + info.manifest.startup_app.name
    });
  } else {
    document.getElementById('providerDetails').innerHTML = 'Available - Not specified';
  }

}


function appLoader() {

  let myUrl = document.getElementById('appUrl').value;

  if (myUrl.length > 0) {

    window.open(myUrl);

  }
}