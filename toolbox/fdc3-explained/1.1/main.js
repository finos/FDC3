/**
 * SPDX-License-Identifier: Apache-2.0
 * Copyright FINOS FDC3 contributors - see NOTICE file
 */

document.addEventListener('DOMContentLoaded', () => {
  fdc3OnReady(main, displayFDC3Support);
});

function fdc3OnReady(success, error) {
  let fdc3Tries = 10;

  const checkFDC3Ready = () => {
    if (window.fdc3) {
      success.call(this);
    } else {
      if (fdc3Tries > 0) {
        fdc3Tries--;
        window.setTimeout(checkFDC3Ready, 100);
      } else {
        error.call(this);
      }
    }
  };
  checkFDC3Ready();
}

// use this to keep track of context listener - one per system channel
let contextListener = null;
let appChannels = [];

function main() {
  try {
    console.log('FDC3 is ready and DOM has rendered');
    displayFDC3Support();
    getPlatform();
    populateHTML();
    setUpEventListeners();
    getContext();
  } catch (error) {
    console.error(error);
  }
}

function displayFDC3Support() {
  try {
    const supportedElement = document.getElementById('fdc3-support');
    if (window.fdc3) {
      supportedElement.innerHTML = 'Yes ✅';
    } else {
      supportedElement.innerHTML = 'No ❌';
    }
  } catch (error) {
    console.error("Can't find FDC3 support", error);
  }
}

function getPlatform() {
  // TODO: add G42 and FDC3 Desktop Agent to vendors
  // NOTE: conceptually replaced with fdc3.getInfo
  if (window.FSBL) {
    window.FSBL.getFSBLInfo().then(info => updateProviderDetails('Available - Finsemble ' + info.FSBLVersion));
  } else if (window.fin) {
    updateProviderDetails('Available - OpenFin ' + fin.desktop.getVersion());
  } else {
    updateProviderDetails('Available - Unknown');
  }
}

function updateProviderDetails(details) {
  const providerDetails = document.getElementById('providerDetails');
  providerDetails.innerText = details;
}

async function populateHTML() {
  try {
    //populate available channels list with system channels
    const channelList = document.getElementById('system-channel-list');

    const populateChannelsList = id => {
      let node = document.createElement('li');
      let textNode = document.createTextNode(id);
      node.appendChild(textNode);
      channelList.appendChild(node);
    };

    const systemChannels = await fdc3.getSystemChannels();

    // for all of the system channels populate dropdowns & lists
    systemChannels.forEach(({ displayMetadata, id, type }) => {
      populateChannelsList(id);
      populateChannelsDropDown(id);
    });

    // as FDC3 is supported we can enable the buttons again except those that are not yet supported features
    document.querySelectorAll('button').forEach(button => {
      if (!button.className.includes('not-supported')) {
        button.disabled = false;
      }
    });
  } catch (error) {
    console.error('unable to populate the html for the page ', error);
  }
}

function setUpEventListeners() {
  document.getElementById('add-app-channel__btn').addEventListener('click', addAppChannel);

  document.getElementById('join-channel__btn').addEventListener('click', joinChannel);

  document.getElementById('leave-channel__btn').addEventListener('click', () => {
    fdc3.leaveCurrentChannel();
  });

  document.getElementById('broadcast__btn').addEventListener('click', broadcastFDC3Context);

  document.getElementById('raise-intent__btn').addEventListener('click', raiseIntent);

  document.getElementById('get_context__btn').addEventListener('click', event => {
    let contextType = document.getElementById('context-type').value;
    getContext(contextType);
  });
}

/**
 *Populate the channel dropdown elements
 */
function populateChannelsDropDown(newOptionText) {
  try {
    let dropdownElement = document.querySelector('.fdc3-channels');

    if (newOptionText) {
      dropdownElement.add(new Option(newOptionText));
    } else {
      throw new Error('No option provided');
    }
  } catch (error) {
    console.error('could not add a new channel to the channel dropdown list', error);
  }
}

function joinChannel() {
  try {
    let dropdownElement = document.getElementById('join-channel');
    let channelName = dropdownElement.options[dropdownElement.selectedIndex].text;
    fdc3.joinChannel(channelName);
  } catch (error) {
    console.error("Can't join channel", error);
  }
}

async function broadcastFDC3Context() {
  try {
    let contextData = document.getElementById('txtBroadcastData').value;
    fdc3.broadcast(JSON.parse(contextData));
  } catch (error) {
    console.error('could not broadcast', error);
  }
}

async function getContext(contextType) {
  try {
    let contextResultBox = document.getElementById('context-result');
    if (contextListener) contextListener.unsubscribe();

    // if context type is passed in then only listen on that specific context
    if (contextType) {
      contextListener = fdc3.addContextListener(
        contextType,
        context => (contextResultBox.value = JSON.stringify(context, null, 2))
      );
    } else {
      contextListener = fdc3.addContextListener(context => (contextResultBox.value = JSON.stringify(context, null, 2)));
    }
  } catch (error) {
    console.error('Unable to add a context listener', error);
  }
}

async function addAppChannel() {
  try {
    let appChannelName = document.getElementById('app-channel').value;

    if (!appChannelName) throw new Error('no channel name set');

    let appChannelExists = appChannels.find(appChannel => appChannel.id === appChannelName);

    if (!appChannelExists) {
      let newAppChannel = await fdc3.getOrCreateChannel(appChannelName);
      appChannels.push(newAppChannel);

      // add to the list of available app channels
      let node = document.createElement('li');
      let textNode = document.createTextNode(appChannelName);
      node.appendChild(textNode);
      document.getElementById('app-channel-list').appendChild(node);

      //populate the channel list dropdown with new appChannel
      populateChannelsDropDown(newAppChannel.id);
    } else {
      throw new Error('app channel already exists');
    }
  } catch (error) {
    console.error('could not add an app channel', error);
  }
}

async function raiseIntent() {
  try {
    // get the channel
    let intent = document.getElementById('intent').value;
    let context = JSON.parse(document.getElementById('intent-context').value);

    // TODO: add the target param
    await fdc3.raiseIntent(intent, context);
  } catch (err) {
    console.error('intent did not resolve', err);
  }
}
