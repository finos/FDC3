export * from './testSuite';
import { getAgent } from '@finos/fdc3';
import { getPackMembers, getPackNames, executeTestsInBrowser, executeManualTestsInBrowser } from './testSuite';
import { ProgressReporter } from './progressReporter';
import 'mocha/mocha.css';
import 'source-map-support/browser-source-map-support.js';

mocha.setup('bdd');
mocha.reporter(ProgressReporter);

// The FDC3 version this conformance snapshot targets. The value is the sentinel
// token "__FDC3_VERSION__", which is replaced with the fixed two-digit version
// number when a versioned snapshot is created by the website's
// "version:conformance" script. It falls back to "next" for the live,
// unversioned snapshot.
function resolveVersion(): string {
  // The array wrapper keeps the sentinel as a plain string literal in the
  // bundle so the minifier cannot fold it away, allowing the "version-run"
  // replacement to substitute the fixed version number.
  const token = ['__FDC3_VERSION__'].join('');
  return token.indexOf('_') === 0 ? 'next' : token;
}

function displayVersion() {
  const versionSelector = document.getElementById('version-selector');
  if (!versionSelector) {
    return;
  }
  const versionLabel = document.createElement('p');
  versionLabel.id = 'fdc3-version';
  versionLabel.className = 'center';
  versionLabel.textContent = `FDC3 version: ${resolveVersion()}`;
  versionSelector.parentElement?.insertBefore(versionLabel, versionSelector);
}

displayVersion();

const testSuite = document.getElementById('testSuite')!;

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
  testSuite.appendChild(optGroup);
});

function executeTests() {
  toggleVersionSelector();
  toggleBackButton();
  const testSuiteMenu = document.getElementById('testSuite') as HTMLSelectElement;
  const selectedSuite = testSuiteMenu.options[testSuiteMenu.selectedIndex].innerHTML;
  const action = () => executeTestsInBrowser(selectedSuite);
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
  const versionLabel = document.getElementById('fdc3-version');
  if (versionSelector.style.display === 'none') {
    versionSelector.style.display = 'block';
    manualSelector.style.display = 'block';
    if (versionLabel) {
      versionLabel.style.display = 'block';
    }
  } else {
    versionSelector.style.display = 'none';
    manualSelector.style.display = 'none';
    if (versionLabel) {
      versionLabel.style.display = 'none';
    }
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
