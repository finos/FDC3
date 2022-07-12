const validTypes = ["platform-provider", "application-provider", "examples-and-training", "solution-provider", "adopter", "all"];
const setType = (theType) => { 
	let typeToSet = theType;
	if (validTypes.indexOf(theType) === -1) {
		console.log("Invalid filter type: " + theType);
		typeToSet = "platform-provider";
	}
	console.log("Setting filter type: " + typeToSet);
	document.querySelectorAll(".button.filter").forEach((elem) => {elem.classList.remove("selected")});
	document.getElementById(typeToSet).classList.add("selected");

	if (typeToSet === "all") {
		document.querySelectorAll(".implementation").forEach((impl) => {
			impl.classList.remove("hide");
		});
	} else {
		document.querySelectorAll(".implementation").forEach((impl) => {
			if (impl.classList.contains(typeToSet)) {
				impl.classList.remove("hide");
			} else {
				impl.classList.add("hide");
			}
		});
	}
	const state = { 'type': typeToSet }
	history.pushState(state, '', "#type-" + typeToSet);
}

document.addEventListener('DOMContentLoaded', function() {
    let hash = window.location.hash;
	let type = hash ? hash.substring(6) : null;

	setType(type);

	document.querySelectorAll(".button.filter").forEach((elem) => {
		elem.addEventListener('click', (event) => {
			setType(event.target.id);
		});
	});
}, false);

