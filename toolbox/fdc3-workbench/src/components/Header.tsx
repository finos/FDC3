import React, { useEffect, useState } from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { AppBar, Toolbar, Tooltip, Typography } from "@material-ui/core";
import WarningIcon from "@material-ui/icons/Warning";
import fdc3, { ImplementationMetadata } from "../utility/Fdc3Api";

declare global {
	interface Window {
		fdc3Version: string;
	}
}

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
			width: "325px",
			height: "40px",
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
		warning: {
			color: "yellow",
			fontSize: "10px",
			transform: "scale(1.5)",
			marginLeft: "5px",
		},
		warningText: {
			color: "red",
		},
		appid: {
			whiteSpace: "nowrap",
			overflow: "hidden",
			textoOverflow: "ellipsis",
			overflowWrap: "anywhere",
			maxWidth: "150px",
		},
	})
);

export const Header = (props: { fdc3Available: boolean }) => {
	const classes = useStyles();
	const [appInfo, setAppInfo] = useState<any>();
	const params = new URLSearchParams(window.location.search);
	const paramVersion = params.get("fdc3Version") || '';
	const [chosenVersion, setChosenVersion] = useState<string>();
	let warningText = `Your FDC3 version (${appInfo?.fdc3Version}) doesn't match the version of the FDC3 Workbench you are using (${chosenVersion})`;
	const supportedVersion = ["2.0", "1.2"];

	useEffect(() => {
		if (props.fdc3Available) {
			//getInfo is not available in FDC3 < v1.2, handle any errors thrown when trying to use it
			const updateInfo = async () => {
				let implInfo: ImplementationMetadata | null = null;
				try {
					implInfo = await fdc3.getInfo();
					let displayInfo = {
						fdc3Version: "not specified",
						provider: "not specified",
						providerVersion: "not specified",
						appMetadata: {
							appId: "not specified",
							version: "not specified",
						},
					};

					if (implInfo.provider) {
						displayInfo.provider = implInfo.provider;
					}
					if (implInfo.providerVersion) {
						displayInfo.providerVersion = implInfo.providerVersion;
					}
					if (implInfo.fdc3Version) {
						displayInfo.fdc3Version = implInfo.fdc3Version;
						window.fdc3Version = chosenVersion || implInfo.fdc3Version;
					}
					if (implInfo.appMetadata) {
						displayInfo.appMetadata = {
							appId: implInfo.appMetadata.appId ? implInfo.appMetadata.appId : "not specified",
							version: implInfo.appMetadata.version ? implInfo.appMetadata.version : "not specified",
						};
					}
		
					setAppInfo(displayInfo);		
				} catch (e) {
					console.error("Failed to retrieve FDC3 implementation info", e);
				}

				if(paramVersion) {
					setChosenVersion(paramVersion);
				} else if(implInfo?.fdc3Version) {
					setChosenVersion(implInfo?.fdc3Version);
				} else {
					setChosenVersion("1.2");
				}
			};

			updateInfo();
		}
	}, [props.fdc3Available, chosenVersion]);

	return (
		<div className={classes.root}>
			<div className={classes.backgroundHeader}></div>
			<AppBar position="static" elevation={0} style={{ backgroundColor: "transparent" }}>
				<Toolbar className={classes.toolbar}>
					<div>
						<Typography variant="h3" color="inherit" className={classes.fdc3}>
							<img src="./fdc3-logo.png" className={classes.headerCube} />
						</Typography>
						<Typography color="inherit">
							{supportedVersion.map((ver, index) => (
								<span key={index}>
									{ver === chosenVersion ? (
										<span>{ver}</span>
									) : (
										<a className={`${classes.link}`} href={`?fdc3Version=${ver}`}>
											{ver}
										</a>
									)}
									{supportedVersion.length - 1 !== index && <span> | </span>}
								</span>
							))}
						</Typography>
					</div>

					<div className={classes.info}>
						<table id="providerInfo">
							<tbody>
								<tr>
									<th scope="row">FDC3 Version</th>
									{appInfo?.fdc3Version ? (
										chosenVersion === appInfo.fdc3Version ? (
											<td>{appInfo.fdc3Version}</td>
										) : (
											<td className={classes.warningText}>
												{appInfo.fdc3Version}
												<Tooltip title={warningText} aria-label={warningText}>
													<WarningIcon className={classes.warning} />
												</Tooltip>
											</td>
										)
									) : (
										<td>unknown</td>
									)}
								</tr>
								<tr>
									<th scope="row">Provider</th>
									<td>{appInfo?.provider ? appInfo.provider : "unknown"}</td>
								</tr>
								<tr>
									<th scope="row">Provider version</th>
									<td>{appInfo?.providerVersion ? appInfo.providerVersion : "unknown"}</td>
								</tr>
								<tr>
									<th scope="row">My AppId</th>
									<td className={classes.appid}>
										{appInfo?.appMetadata?.appId ? appInfo.appMetadata.appId : "unknown"}
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				</Toolbar>
			</AppBar>
		</div>
	);
};
