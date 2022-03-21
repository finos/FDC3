import mocha from "mocha";
import constants from "./constants";

let fdc3Available = false;
const initialise = () => {
  // Initialise test run
  fdc3Available = true;

  const detectingMessage = document.getElementById("detecting-fdc3");
  detectingMessage.setAttribute("hidden", "");
  window.removeEventListener("fdc3Ready", initialise);

  mocha.run();
};

if ((window as any).fdc3) {
  initialise();
} else {
  window.addEventListener("fdc3Ready", initialise);

  setTimeout(() => {
    if (!fdc3Available) {
      const detectingMessage = document.getElementById("detecting-fdc3");
      detectingMessage.setAttribute("hidden", "");
      window.removeEventListener("fdc3Ready", initialise);
      const hiddenMessage = document.getElementById("no-fdc3");
      hiddenMessage?.removeAttribute("hidden");
    }
  }, constants.Fdc3Timeout);
}
