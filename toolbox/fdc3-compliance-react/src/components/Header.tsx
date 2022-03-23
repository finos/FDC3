import React, { useEffect, useState } from "react";
import * as fdc3 from "@finos/fdc3";
import { AppBar, Box, Toolbar, Typography } from "@mui/material";

export const Header = (props: { fdc3Available: boolean }) => {
	const [appInfo, setAppInfo] = useState<fdc3.ImplementationMetadata>();

	useEffect(() => {
		if (props.fdc3Available) {
			//getInfo is not available in FDC3 < v1.2, handle any errors thrown when trying to use it
			try {
				let implInfo = fdc3.getInfo();
				let displayInfo = {
					fdc3Version: "not specified", 
					provider: "not specified", 
					providerVersion: "not specified"
				};
				if (implInfo.fdc3Version) {displayInfo.fdc3Version = implInfo.fdc3Version; } 
				if (implInfo.provider) {displayInfo.provider = implInfo.provider; } 
				if (implInfo.providerVersion) {displayInfo.providerVersion = implInfo.providerVersion; } 
				setAppInfo(displayInfo);
			} catch (e) {
				console.error("Failed to retrieve FDC3 implementation info",e);
			}
		}
	}, [props.fdc3Available]);

	return (
		<Box sx={{
			flexGrow: 1,
		}}>
			<Box
				sx={{
					backgroundImage: 'linear-gradient(to bottom, #0086bf, #00bbe1)',
					height: '200px',
					width: '100%',
					left: '0px',
					top: '0px',
					position: 'absolute',
					zIndex: -10,
				}}
			/>
			<AppBar
				elevation={0}
				sx={{
					position: 'static',
					bgcolor: 'transparent'
				}}
			>
				<Toolbar sx={{
					bg: 'transparent',
					pt: 2,
					px: 4,
					display: 'flex',
					justifyContent: 'space-between',
				}}>
					<div>
						<Typography
							variant="h3"
							sx={{
								color: 'inherit',
							}}
						>
							<img src="./fdc3-logo.svg" width={150} height={50}/>
						</Typography>
					</div>

					<Box
						sx={{
							minWidth: '200px',
							fontSize: '12px',
						}}
					>
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
									<td>{appInfo?.providerVersion ? appInfo.providerVersion : "unknown"}</td>
								</tr>
							</tbody>
						</table>
					</Box>
				</Toolbar>
			</AppBar>
		</Box>
	);
};
