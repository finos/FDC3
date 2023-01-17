import React from "react";

export const openApiDocsLink = (event: React.MouseEvent<HTMLElement>) => {
	event.preventDefault();
	const href = event?.currentTarget?.getAttribute("href");
	if (href) {
		window.open(href, "FDC3ApiDocs");
	}
	return false;
};
