export default (theType) => { 
	let typeToSet = theType;
	
	console.log("Setting filter type: " + typeToSet);
	document.querySelectorAll(".button.filter").forEach((elem) => {elem.classList.remove("selected")});
	const selectedButton = document.getElementById(typeToSet);
	if (selectedButton){
		selectedButton.classList.add("selected");
	}

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
