import mocha from "mocha";
import fdc3 from "@finos/fdc3";

let fdc3Available = false;
const initialise = () => {
  // Initialise test run
  fdc3Available = true;
  mocha.run();
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
