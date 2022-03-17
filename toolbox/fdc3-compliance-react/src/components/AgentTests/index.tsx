import { observer } from "mobx-react";
import { Typography } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import mocha from "mocha";
import { initTests } from "../../test/initTests";
import { TestResult } from "../TestResult";
import { Box, Stack } from "@mui/material";
import LoadingButton from '@mui/lab/LoadingButton';
import { TestSummary } from "../TestSummary";
import { PlayArrowRounded } from "@mui/icons-material";

const statuses = {
	idle: 'Run Tests',
	running: 'Running Tests',
}

type TestsStatus = 'idle' | 'running'

export const AgentTests = observer(() => {
	const [status, setStatus] = useState<TestsStatus>('idle');
	const [tests, setTests] = useState<any[]>([])
	const [stats, setStats] = useState<any>({})
	const [testsInitialised, setTestInitialised] = useState<boolean>(false)

	useEffect(() => {
		// We're not really using the JSON output but it prevents
		// it from trying to add to the mocha div
		// This version of the setup isn't in the typescript defs
		if (!testsInitialised) {
			(mocha as any).setup({ ui: "bdd", reporter: "json", cleanReferencesAfterRun: false });
			initTests();
			setTestInitialised(true)
		}
	}, []);

	const handRunTests = () => {
		setTests([])
		const runner: any = mocha.run();

		// runner.suite.addTest('test', addContextListener)

		// runner contains all the test info and event handlers
		// The typescript defs say it is void but they lie
		// runner.stats contains all the totals
		// runner.suite contains test details
		// But we can also add event handlers to it:

		runner.on("start", async () => {
			setStatus('running')
		});

		runner.on("test", async (test: any) => {
			console.log(test);
			console.log(runner.suite)
			console.count('test')
			setTests((prev) => [ ...prev, test ])
		});

		runner.on("pass", async (test: any) => {
			console.log("This test passed!!!");
			console.log(test.title);
		});

		runner.on("fail", async (test: any) => {
			console.log("Oh no it failed.");
			console.log(test.title);
		});

		runner.on("end", async () => {
			setStatus('idle')
			setStats(runner.stats)
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

					<TestSummary stats={stats}/>
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
