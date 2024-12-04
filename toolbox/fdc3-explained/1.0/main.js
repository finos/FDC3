/**
 * SPDX-License-Identifier: Apache-2.0
 * Copyright FINOS FDC3 contributors - see NOTICE file
 */

// enable application when FDC3 is available
document.addEventListener('DOMContentLoaded', () => {
  fdc3Init(enablePage);
});

// check if FDC3 is available
function fdc3Init(callback) {
  let fdc3Tries = 10;

  const onFDC3Ready = () => {
    if (window.fdc3) {
      callback.call(this);
    } else {
      if (fdc3Tries > 0) {
        fdc3Tries--;
        window.setTimeout(onFDC3Ready, 100);
      }
    }
  };

  onFDC3Ready();
}

const providerDetails = document.getElementById('providerDetails');
const broadcastButton = document.getElementById('broadcastButton');
const broadcastText = document.getElementById('broadcastText');

function enablePage() {
  console.log('FDC3 is available');

  // NOTE: conceptually replaced with fdc3.getInfo
  if (window.FSBL) {
    window.FSBL.getFSBLInfo().then(info => updateProviderDetails('Available - Finsemble ' + info.FSBLVersion));
  } else if (window.fin) {
    updateProviderDetails('Available - OpenFin ' + fin.desktop.getVersion());
  } else {
    updateProviderDetails('Available - Unknown');
  }

  broadcastButton.disabled = false;
  broadcastText.disabled = false;
}

function updateProviderDetails(details) {
  providerDetails.innerText = details;
}

function broadcastFDC3Context() {
  var context = JSON.parse(broadcastText.value);
  fdc3.broadcast(context);
}
