import { fdc3Ready } from '@kite9/fdc3-get-agent';
import { getPackMembers, getPackNames, executeTestsInBrowser } from './testSuite';

require('mocha/mocha.css');
require('source-map-support/browser-source-map-support.js');

mocha.setup('bdd');
const version = document.getElementById('version');

// populate drop-down
getPackNames().forEach(pn => {
  const optGroup = document.createElement('optgroup');
  optGroup.setAttribute('label', pn);
  getPackMembers(pn).forEach(pm => {
    const opt = document.createElement('option');
    const text = document.createTextNode(pm);
    opt.setAttribute('value', pm);
    opt.appendChild(text);
    optGroup.appendChild(opt);
  });
  version.appendChild(optGroup);
});

function executeTests() {
  toggleVersionSelector();
  toggleBackButton();
  const fdc3Versions = document.getElementById('version') as HTMLSelectElement;
  var selectedVersion = fdc3Versions.options[fdc3Versions.selectedIndex].innerHTML;
  const action = () => executeTestsInBrowser(selectedVersion);
  if (window.fdc3) {
    action();
  } else {
    fdc3Ready().then(() => action());
  }
}

function returnToTestSelection() {
  location.reload();
}

function toggleVersionSelector() {
  const versionSelector = document.getElementById('version-selector');
  if (versionSelector.style.display === 'none') {
    versionSelector.style.display = 'block';
  } else {
    versionSelector.style.display = 'none';
  }
}

function toggleBackButton() {
  const backButton = document.getElementById('back-button');
  if (window.getComputedStyle(backButton).display === 'none') {
    backButton.style.display = 'block';
  } else {
    backButton.style.display = 'none';
  }
}

document.getElementById('runButton').addEventListener('click', executeTests);
document.getElementById('back-button').addEventListener('click', returnToTestSelection);
