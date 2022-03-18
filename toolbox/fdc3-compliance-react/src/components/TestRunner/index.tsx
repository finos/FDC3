import { observer } from "mobx-react";
import React, { useEffect, useState } from "react";
import { Box, Stack } from "@mui/material";
import LoadingButton from '@mui/lab/LoadingButton';
import { TestSummary } from "../TestSummary";
import { PlayArrowRounded } from "@mui/icons-material";
import { initAllTests, runTests } from "fdc3-compliance";
import { Stats, Test } from "mocha";
import { TestResults } from "../TestResults";

const statuses = {
	idle: 'Run Tests',
	running: 'Running Tests',
}

export type TestsStatus = 'idle' | 'running'

export const TestRunner = observer(() => {
	const [status, setStatus] = useState<TestsStatus>('idle');
	const [tests, setTests] = useState<Test[]>([]);
	const [successfulTests, setSuccessfulTests] = useState<number>(0);
	const [failedTests, setFailedTests] = useState<number>(0);
	const [total, setTotal] = useState<number>(1);
	const [testStats, setTestStats] = useState<Stats | null>(null);
	const [testsInitialised, setTestInitialised] = useState<boolean>(false);

	const reset = () => {
		setTests([]);
		setSuccessfulTests(0);
		setFailedTests(0);
		setTestStats(null);
	};

	useEffect(() => {
		if (!testsInitialised) {
			initAllTests();
			setTestInitialised(true);
		}
	}, []);

	const reportStart = (stuff: any): void => {
		console.log(stuff)
		reset();
		setStatus('running');
		setTotal(stuff.total)
	};

	const reportFailure = (test: any): void => {
		console.log("Oh no it failed.");
		setTests((prev) => [ ...prev, test ]);
		setFailedTests((prev) => prev + 1);
	};

	const reportSuccess = (test: any) => {
		console.log("This test passed!!!");
		setTests((prev) => [ ...prev, test ]);
		setSuccessfulTests((prev) => prev + 1);
	};

	const reportComplete = (stats: any): void => {
		setStatus('idle');
		setTestStats(stats.stats);
	};

	const handRunTests = () => {
		runTests({
			onStart: reportStart,
			onFail: reportFailure,
			onPass: reportSuccess,
			onComplete: reportComplete,
		});
	};

	return (
    <Stack gap={2}>
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <LoadingButton
          color="primary"
          onClick={handRunTests}
          endIcon={<PlayArrowRounded/>}
          loading={status === 'running'}
          loadingPosition="end"
          variant="contained"
        >
          {statuses[status]}
        </LoadingButton>

        <TestSummary status={status} passes={successfulTests} failures={failedTests} total={total} stats={testStats}/>
      </Box>
      
      <TestResults tests={tests}/>
    </Stack>
	);
});
