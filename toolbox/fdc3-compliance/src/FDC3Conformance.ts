import mocha from "mocha";
import fdc3 from "@finos/fdc3";
import { initAllTests, runTests } from "./test/testSuite";

const report = (test: any, status: string): void => {
  const mochaDiv = document.getElementById("mocha");
  const reportNode = document.createElement("div");
  reportNode.textContent = `${test.parent.title}: ${test.title} ${status}`;
  if (test.err) {
    const errorNode = document.createElement("div");
    errorNode.textContent = test.err;
    reportNode.appendChild(errorNode);
  }
  mochaDiv.appendChild(reportNode);
};

const reportFailure = (test): void => {
  report(test, "failed");
};

const reportSuccess = (test) => {
  report(test, "passed");
};

let fdc3Available = false;
const initialise = () => {
  // Initialise test run
  fdc3Available = true;
  initAllTests();
  runTests({
    onFail: reportFailure,
    onPass: reportSuccess,
  });
};

if ((window as any).fdc3) {
  initialise();
} else {
  window.addEventListener("fdc3Ready", initialise);

  setTimeout(() => {
    if (!fdc3Available) {
      const hiddenMessage = document.getElementById("no-fdc3");
      hiddenMessage?.removeAttribute("hidden");
    }
  }, 5000);
}
