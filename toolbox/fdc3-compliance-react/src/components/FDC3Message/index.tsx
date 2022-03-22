import React from "react";
import { Box, Link, Paper, Typography } from "@mui/material";
import { styled } from "@mui/system";

const openSpecAccessDocs = (event: React.MouseEvent<HTMLElement>) => {
	event.preventDefault();
	window.open("https://fdc3.finos.org/docs/api/spec#api-access", "FDC3ApiDocs");
	return false;
};

const openSupportedPlatformsDocs = (event: React.MouseEvent<HTMLElement>) => {
	event.preventDefault();
	window.open("https://fdc3.finos.org/docs/supported-platforms", "FDC3ApiDocs");
	return false;
};

const Code = styled('span')({
  fontFamily: 'courier, courier new, monospace'
});

const StyledLink = styled(Link)({
  color: "#5b606f",
  fontWeight: "bold",
  "&:hover": {
    color: "#5b606f",
  },
})

export const FDC3Message = () => {
  return (
    <Box sx={{ p: 1 }}>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h4">FDC3 API not detected!</Typography>
        <Typography variant="body1">
          An FDC3 desktop agent implementation was not found at{" "}
          <Code>window.fdc3</Code>.
        </Typography>
        <Typography variant="body1">
          For web applications to be FDC3-enabled, they need to run in the context of an 
          agent that makes the FDC3 API available to the application. This desktop agent is 
          also responsible for lauching and co-ordinating applications. It could be a browser 
          extension, web app, or full-fledged desktop container framework.
        </Typography>
        <Typography variant="body1">
          See the FDC3 standard documentation for details on{" "}
          <StyledLink
            href="https://fdc3.finos.org/docs/supported-platforms"
            onClick={openSupportedPlatformsDocs}
          >
          supported platforms
          </StyledLink>
          {" "}and{" "}
          <StyledLink
            href="https://fdc3.finos.org/docs/api/spec#api-access"
            onClick={openSpecAccessDocs}
          >
            accessing the FDC3 API
          </StyledLink>.
        </Typography>
      </Paper>
    </Box>
  )
}