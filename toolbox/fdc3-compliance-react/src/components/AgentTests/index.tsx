import { observer } from "mobx-react";
import { Typography } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { TestResult } from "../TestResult";
import { Box, Stack } from "@mui/material";
import LoadingButton from '@mui/lab/LoadingButton';
import { TestSummary } from "../TestSummary";
import { PlayArrowRounded } from "@mui/icons-material";
import { initAllTests, runTests } from "fdc3-compliance";

const statuses = {
	idle: 'Run Tests',
	running: 'Running Tests',
}

type TestsStatus = 'idle' | 'running'

export const AgentTests = observer(() => {
	const [status, setStatus] = useState<TestsStatus>('idle');
	const [tests, setTests] = useState<any[]>([]);
	const [testStats, setTestStats] = useState<any>({});
	const [testsInitialised, setTestInitialised] = useState<boolean>(false);

	useEffect(() => {
		if (!testsInitialised) {
			initAllTests();
			setTestInitialised(true);
		}
	}, []);

	const reportStart = (): void => {
		setStatus('running');
	};

	const reportFailure = (test: any): void => {
		console.log("Oh no it failed.");
		setTests((prev) => [ ...prev, test ]);
	};

	const reportSuccess = (test: any) => {
		console.log("This test passed!!!");
		setTests((prev) => [ ...prev, test ]);
	};

	const reportEnd = (stats: any): void => {
		setStatus('idle');
		setTestStats(stats);
	};

	const handRunTests = () => {
		runTests({
			onStart: reportStart,
			onFail: reportFailure,
			onPass: reportSuccess,
			onEnd: reportEnd,
		});
	};

	return (
		<Box
			sx={{
				flexGrow: 1,
			}}
		>
			<Stack gap={2}>
				<Box>
					<Typography variant="h5">FDC3 Agent Conformance Test</Typography>
					<Typography>Tests which parts of the FDC3 specification the current desktop agent has implemented.</Typography>
				</Box>
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

					<TestSummary stats={testStats}/>
				</Box>

				<Stack gap={2}>
					{tests.map((test, index) => (
						<TestResult key={index} test={test}/>
					))}
				</Stack>

				<div id="mocha"></div>
			</Stack>
		</Box>
	);
});
