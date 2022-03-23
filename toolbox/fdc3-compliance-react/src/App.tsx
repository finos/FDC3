import React, { useEffect, useState } from "react";
import { Box, Paper, Tabs, Tab, Typography, Link } from "@mui/material";
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import { observer } from "mobx-react";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";
import "normalize.css";
import "@fontsource/roboto";
import "@fontsource/source-code-pro";
import { TabPanel } from "./components/common/TabPanel";
import { Header } from "./components/Header";
import snackbarStore from "./store/SnackbarStore";
import "./App.css";
import { fdc3Ready } from "@finos/fdc3";
import { AgentTests } from "./components/AgentTests/index";
import { FDC3Message } from "./components/FDC3Message";

const mainTheme = createTheme({
	palette: {
		primary: {
			light: '#005d85',
			main: '#0086bf',
			dark: '#339ecb',
			contrastText: '#fff',
		},
	},
	typography: {
		h4: {
			fontFamily: 'Source Code Pro',
			fontSize: '20px',
			color: '#0086bf',
			paddingLeft: '4px',
			paddingBottom: '11px',
		},
		h5: {
			fontSize: '16px',
		},
		body1: {
			fontSize: '1rem',
			fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
			fontWeight: 400,
			lineHeight: 1.5,
			letterSpacing: '0.00938em',
			marginBlockStart: '10px',
			marginBlockEnd: '10px',
		},
	},
	components: {
		MuiLink: {
			defaultProps: {
				underline: 'hover',
			}
		}
	}
});

const StyledTabs = styled(Tabs)({
	borderBottomColor: '#acb2c0',
	borderBottomStyle: 'solid',
	borderBottomWidth: '1px',
	minHeight: '28px',
	'& [aria-selected="true"]': {
		backgroundColor: 'rgba(0, 134, 191, 0.21)',
	},
	'& .MuiTabs-indicatorSpan': {
    backgroundColor: 'rgba(0, 134, 191, 0.21)',
  },
  '& .MuiTabs-indicator': {
    backgroundColor: '#00bbe1',
  },
});

const StyledLink = styled(Link)({
	color: '#5b606f',
	fontWeight: 'bold',
});

const openAPIDocs = (event: React.MouseEvent<HTMLElement>) => {
	event.preventDefault();
	window.open("https://fdc3.finos.org/docs/api/overview", "FDC3ApiDocs");
	return false;
};

export const App = observer(() => {
	const [fdc3Available, setFdc3Available] = useState(false);
	const [openSnackbar, setOpenSnackbar] = useState(false);
	const [tabIndex, setTabIndex] = useState(0);

	const handleTabChange = (event: React.ChangeEvent<{}>, newIndex: number) => {
		setTabIndex(newIndex);
	};

	const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
		if (reason === "clickaway") {
			return;
		}

		setOpenSnackbar(false);
		// Need to show close animation
		setTimeout(() => snackbarStore.clearSnackbarData(), 500);
	};

	//check if the FDC3 API is available so we know whether to render
	useEffect(() => {
		(async () => {
			try {
				await fdc3Ready(5000);
				setFdc3Available(true);
			} catch (e) {}
		})();
	}, []);

	useEffect(() => {
		setOpenSnackbar(!!snackbarStore.snackbarData);
	}, [snackbarStore.snackbarData]);

	return (
		<ThemeProvider theme={mainTheme}>
			<Box sx={{
				flexGrow: 1,
				display: 'flex',
				flexDirection: 'column',
				gap: 2,
			}}>
				<Header fdc3Available={fdc3Available} />
				{fdc3Available ? (
					<Box
						sx={{
							px: 2,
						}}
					>
						<Paper
							sx={{
								px: 2,
								py: 2,
								display: 'flex',
								flexDirection: 'column',
								gap: 1,
							}}
						>
							<Typography
								variant="h4"
							>{`{compliance}`}</Typography>
							<StyledTabs
								value={tabIndex}
								indicatorColor="primary"
								onChange={handleTabChange}
								variant="scrollable"
								scrollButtons="auto"
							>
								<Tab label="Agent Compliance" />
							</StyledTabs>
							<TabPanel value={tabIndex} index={0}>
								<AgentTests />
							</TabPanel>
						</Paper>
					</Box>
				) : (
					<FDC3Message/>
				)}
				<Box
					sx={{
						px: 2,
					}}
				>
					<Typography variant="body1" color="#5b606f" fontSize="small" fontStyle="italic">
						Learn more about the{" "}
						<StyledLink href="https://fdc3.finos.org/docs/api/overview" onClick={openAPIDocs}>
							FDC3 Standard and APIs
						</StyledLink>{" "}
						| Proud member of the{" "}
						<StyledLink href="https://www.finos.org/">
							Fintech Open Source Foundation
						</StyledLink>{" "}
						| Copyright © 2021 Cosaic, inc. &amp; Contributors to the FDC3 standards project
					</Typography>
				</Box>
			</Box>

			<Snackbar key={snackbarStore.snackbarData?.id} open={openSnackbar} autoHideDuration={4000} onClose={handleClose}>
				<Alert elevation={6} variant="filled" onClose={handleClose} severity={snackbarStore.snackbarData?.type}>
					{snackbarStore.snackbarData?.message}
				</Alert>
			</Snackbar>
		</ThemeProvider>
	);
});

export default App;
