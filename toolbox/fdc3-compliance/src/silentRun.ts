import { Summary } from "./complianceTypes";
import { initNonInteractiveTests, runTests } from "./test/testSuite";

const runSilentTests = (
  fdc3: any,
  onComplete: (summary: Summary) => void
): void => {
  initNonInteractiveTests(fdc3);

  const stats = runTests({
    onComplete,
  });
};

export default runSilentTests;
