import React from "react";
import { observer } from "mobx-react";
import { Typography } from "@material-ui/core";
import { Box, Stack } from "@mui/material";
import { TestRunner } from "../TestRunner";

const statuses = {
	idle: 'Run Tests',
	running: 'Running Tests',
}

export type TestsStatus = 'idle' | 'running'

export const AgentTests = observer(() => {
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
				
				<TestRunner/>
			</Stack>
		</Box>
	);
});
