import { observer } from "mobx-react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { Typography, Grid, Button } from "@material-ui/core";
import React, { useEffect } from "react";
import mocha from "mocha";
import { initTests } from "../../test/initTests";

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
		(mocha as any).setup({ ui: "bdd", reporter: "json" });
		initTests();
	}, []);

	const handRunTests = () => {
		const runner = mocha.run();

		// runner contains all the test info and event handlers
		// The typescript defs say it is void but they lie
		// runner.stats contains all the totals
		// runner.suite contains test details
		// But we can also add event handlers to it:

		(runner as any).on("pass", (test: any) => {
			console.log("This test passed!!!");
			console.log(test);
		});

		(runner as any).on("fail", (test: any) => {
			console.log("Oh no it failed.");
			console.log(test);
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
