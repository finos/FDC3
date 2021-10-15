import React, { useEffect, useState } from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { AppBar, Toolbar, Typography } from "@material-ui/core";
import * as fdc3 from "@finos/fdc3";

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			flexGrow: 1,
		},
		toolbar: {
			backgroundColor: "transparent",
			padding: theme.spacing(2, 4),
			paddingBottom: "0px",
		},
		link: {
			color: theme.palette.common.white,
			textDecoration: "underline",
			"&:hover": {
				color: theme.palette.common.white,
			},
		},
		info: {
			marginLeft: "auto",
			minWidth: "200px",
			fontSize: "12px",
		},
		fdc3: {},
		headerCube: {
			width: "150px",
			height: "50px",
		},
		backgroundHeader: {
			background: "linear-gradient(to bottom, #0086bf, #00bbe1)",
			height: "200px",
			width: "100%",
			left: "0px",
			top: "0px",
			position: "absolute",
			zIndex: -10,
		},
	})
);

export const Header = (props: { fdc3Available: boolean }) => {
	const classes = useStyles();
	const [appInfo, setAppInfo] = useState<fdc3.ImplementationMetadata>();

	useEffect(() => {
		if (props.fdc3Available) {
			//getInfo is not available in FDC3 < v1.2, handle any errors thrown when trying to use it
			try {
				setAppInfo(fdc3.getInfo());
			} catch (e) {
				console.error("Failed to retrieve FDC3 implementation info",e);
			}
		}
	}, [props.fdc3Available]);

	return (
		<div className={classes.root}>
			<div className={classes.backgroundHeader}></div>
			<AppBar position="static" elevation={0} style={{ backgroundColor: "transparent" }}>
				<Toolbar className={classes.toolbar}>
					<div>
						<Typography variant="h3" color="inherit" className={classes.fdc3}>
							<img src="./fdc3-logo.svg" className={classes.headerCube} />
						</Typography>
					</div>

					<div className={classes.info}>
						<table id="providerInfo">
							<tbody>
								<tr>
									<th scope="row">FDC3 Version</th>
									<td>{appInfo?.fdc3Version ? appInfo.fdc3Version : "unknown"}</td>
								</tr>
								<tr>
									<th scope="row">Provider</th>
									<td>{appInfo?.provider ? appInfo.provider : "unknown"}</td>
								</tr>
								<tr>
									<th scope="row">Provider version</th>
									<td>{appInfo?.providerVersion ? appInfo.providerVersion : "-"}</td>
								</tr>
							</tbody>
						</table>
					</div>
				</Toolbar>
			</AppBar>
		</div>
	);
};
