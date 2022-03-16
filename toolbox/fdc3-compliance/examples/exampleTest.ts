import runSilentTests from "../build/silentRun";

const fdc3 = {
  getInfo: () => {},
};

runSilentTests(fdc3, (results) => {
  // stats contains the summary results
  // For more details, see the passed and failed arrays
  console.log(results.stats);
});
