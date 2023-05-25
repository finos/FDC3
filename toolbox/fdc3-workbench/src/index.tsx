import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

//make sure URL ends with trailing / for resolution of image paths
if (!window.location.href.endsWith("/")){
	window.location.href = `${window.location.href}/`;
}

ReactDOM.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
	document.getElementById("root")
);
