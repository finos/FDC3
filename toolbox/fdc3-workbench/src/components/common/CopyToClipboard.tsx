import { runInAction } from "mobx";
import systemLogStore from "../../store/SystemLogStore";

export const copyToClipboard = (text: string, name: string) => () => {
	navigator.clipboard.writeText(text);
	runInAction(() => {
		systemLogStore.addLog({
			name: "copyToClipboard",
			type: "info",
			value: name,
			variant: "text",
		});
	});
};
