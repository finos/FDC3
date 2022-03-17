import { observer } from "mobx-react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { Typography, Grid, Button } from "@material-ui/core";
import React, { useEffect } from "react";
import { initAllTests, runTests } from "fdc3-compliance";

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			flexGrow: 1,
		},
		form: {
			display: "flex",
			flexWrap: "wrap",
			marginTop: theme.spacing(1),
			"& > *": {
				margin: theme.spacing(1),
				marginRight: 0,
			},
		},
		controls: {
			"& .MuiIconButton-sizeSmall": {
				padding: "6px",
				marginLeft: theme.spacing(1),
			},
		},
		spread: {
			flexDirection: "row",
			justifyContent: "flex-end",
		},
		contextListenerName: {
			flexGrow: 1,
			marginRight: theme.spacing(1),
			minWidth: "190px",
		},
		rightAlign: {
			flexDirection: "row",
			justifyContent: "flex-end",
		},
	})
);

export const AgentTests = observer(() => {
	const classes = useStyles();

	useEffect(() => {
		// We're not really using the JSON output but it prevents
		// it from trying to add to the mocha div
		// This version of the setup isn't in the typescript defs
		initAllTests();
	}, []);

	const reportFailure = (test: any): void => {
		console.log("Oh no it failed.");
		console.log(test);
	};

	const reportSuccess = (test: any) => {
		console.log("This test passed!!!");
		console.log(test);
	};

	const handRunTests = () => {
		runTests({
			onFail: reportFailure,
			onPass: reportSuccess,
		});
	};

	return (
		<div className={classes.root}>
			<Grid item xs={12}>
				<Typography variant="h5">FDC3 Agent Conformance Test</Typography>
				<Typography>Tests which parts of the FDC3 specification the current desktop agent has implemented.</Typography>

				<Button variant="contained" color="primary" onClick={handRunTests}>
					Run Tests
				</Button>

				<div id="mocha"></div>
			</Grid>
		</div>
	);
});
