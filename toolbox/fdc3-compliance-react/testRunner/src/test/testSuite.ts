import fdc3AddContextListener from "./fdc3.addContextListener";
import fdc3AddIntentListener from "./fdc3.addIntentListener";
import fdc3Broadcast from "./fdc3.broadcast";
import fdc3FindIntent from "./fdc3.findIntent";
import fdc3FindIntentsByContext from "./fdc3.findIntentsByContext";
import fdc3GetCurrentChannel from "./fdc3.getCurrentChannel";
import fdc3GetInfo from "./fdc3.getInfo";
import fdc3GetOrCreateChannel from "./fdc3.getOrCreateChannel";
import fdc3GetSystemChannels from "./fdc3.getSystemChannels";
import fdc3JoinChannel from "./fdc3.joinChannel";
import fdc3LeaveCurrentChannel from "./fdc3.leaveCurrentChannel";
import fdc3Open from "./fdc3.open";
import fdc3RaiseIntent from "./fdc3.raiseIntent";
import fdc3RaiseIntentForContext from "./fdc3.raiseIntentForContext";
import mocha, { Stats } from "mocha";
import { TestResultHandlers } from "../complianceTypes";
import constants from "../constants";

const nonInteractiveTestSuites = [
  fdc3AddContextListener,
  fdc3AddIntentListener,
  fdc3Broadcast,
  fdc3GetCurrentChannel,
  fdc3GetInfo,
  fdc3GetOrCreateChannel,
  fdc3GetSystemChannels,
  fdc3JoinChannel,
  fdc3LeaveCurrentChannel,
];

const potentiallyInteractiveTestSuites = [
  fdc3FindIntent,
  fdc3Open,
  fdc3RaiseIntent,
  fdc3RaiseIntentForContext,
  fdc3FindIntentsByContext,
];

const commonInitialisation = () => {
  // Mocha setup creates the describe and it functions,
  // so must happens before test definition
  (mocha as any).setup({
    ui: "bdd",
    reporter: "json",
    cleanReferencesAfterRun: false,
  });

  // The Typescript mappings are missing the global timeout function
  (mocha as any).timeout(constants.TestTimeout);
};

const initNonInteractive = () => {
  nonInteractiveTestSuites.forEach((suite) => suite());
};

const initPotentiallyInteractive = () => {
  potentiallyInteractiveTestSuites.forEach((suite) => suite());
};

export const initAllTests = () => {
  commonInitialisation();
  initNonInteractive();
  initPotentiallyInteractive();
};

export const initNonInteractiveTests = (fdc3?: any) => {
  if (fdc3) {
    if (typeof window === "undefined") {
      (global.window as any) = { fdc3 };
      if (typeof location === "undefined") {
        (global.location as any) = {};
      }
    } else {
      window.fdc3 = fdc3;
    }
  }

  commonInitialisation();
  initNonInteractive();
};

export const runTests = (resultHandlers?: TestResultHandlers): void => {
  const runner = mocha.run();

  const passed = [];
  const failed = [];

  if (resultHandlers) {
    if (resultHandlers.onStart) {
      (runner as any).on("start", () => {
        resultHandlers.onStart(runner);
      });
    }

    if (resultHandlers.onPass) {
      (runner as any).on("pass", (test) => {
        passed.push(test);
        resultHandlers.onPass(test);
      });
    }

    if (resultHandlers.onFail) {
      (runner as any).on("fail", (test) => {
        failed.push(test);
        resultHandlers.onFail(test);
      });
    }

    if (resultHandlers.onComplete) {
      (runner as any).on("end", () => {
        resultHandlers.onComplete({
          passed,
          failed,
          stats: (runner as any).stats,
        });
      });
    }
  }
};
