import { Summary } from "./complianceTypes";
import { initNonInteractiveTests, runTests } from "./test/testSuite";

let summary: Summary;

export const runSilentTests = (): Summary => {
  initNonInteractiveTests();
  summary.stats = runTests({
    onPass: (test) => {
      console.log(`Test passed: ${test.parent.title}: ${test.title}`);

      summary.passed.push(test);
    },
    onFail: (test) => {
      console.error(`Test failed: ${test.parent.title}: ${test.title}`);

      summary.failed.push(test);
    },
  });

  console.log(summary);
  return summary;
};
