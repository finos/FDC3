export * from './testSuite';
import { getAgent } from '@finos/fdc3';
import { getPackMembers, getPackNames, executeTestsInBrowser, executeManualTestsInBrowser } from './testSuite';

// eslint-disable-next-line @typescript-eslint/no-require-imports
require('mocha/mocha.css');
// eslint-disable-next-line @typescript-eslint/no-require-imports
require('source-map-support/browser-source-map-support.js');

mocha.setup('bdd');
const version = document.getElementById('version')!;

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
  const selectedVersion = fdc3Versions.options[fdc3Versions.selectedIndex].innerHTML;
  const action = () => executeTestsInBrowser(selectedVersion);
  if (window.fdc3) {
    action();
  } else {
    getAgent().then(() => action());
  }
}

function executeManualTests() {
  toggleVersionSelector();
  toggleBackButton();
  const manualTests = document.getElementById('manualTests') as HTMLSelectElement;
  const selectedManualTest = manualTests.options[manualTests.selectedIndex].innerHTML;
  console.log('******** Selected manual test is', selectedManualTest);
  const action = () => executeManualTestsInBrowser(selectedManualTest);
  if (window.fdc3) {
    action();
  } else {
    getAgent().then(() => action());
  }
}

function returnToTestSelection() {
  location.reload();
}

function toggleVersionSelector() {
  const versionSelector = document.getElementById('version-selector')!;
  const manualSelector = document.getElementById('manualTests-selector')!;
  if (versionSelector.style.display === 'none') {
    versionSelector.style.display = 'block';
    manualSelector.style.display = 'block';
  } else {
    versionSelector.style.display = 'none';
    manualSelector.style.display = 'none';
  }
}

function toggleBackButton() {
  const backButton = document.getElementById('back-button')!;
  if (window.getComputedStyle(backButton).display === 'none') {
    backButton.style.display = 'block';
  } else {
    backButton.style.display = 'none';
  }
}

document.getElementById('runButton')!.addEventListener('click', executeTests);
document.getElementById('back-button')!.addEventListener('click', returnToTestSelection);
document.getElementById('manualTestsRunButton')!.addEventListener('click', executeManualTests);

getAgent(); // ensure the agent is ready before running tests
