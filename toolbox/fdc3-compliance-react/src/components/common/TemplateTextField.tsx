import { withStyles } from "@material-ui/core/styles";
import { TextField } from "@material-ui/core";

export const TemplateTextField = withStyles({
	root: {
		"& label.Mui-focused": {
			color: "#0086bf",
		},
		"& .MuiInput-underline:after": {
			borderBottomColor: "#0086bf",
		},
		"& .MuiOutlinedInput-root": {
			"& fieldset": {
				borderColor: "#0086bf",
			},
			"&:hover fieldset": {
				borderColor: "#0086bf",
			},
			"&.Mui-focused fieldset": {
				borderColor: "#0086bf",
			},
		},
	},
})(TextField);
