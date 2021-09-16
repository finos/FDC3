import React from "react";
import { observer } from "mobx-react";
import { AccordionList } from "../common/AccordionList";
import channelStore from "../../store/ChannelStore";

export const SystemChannels = observer(() => {
	const systemChannelsList = channelStore.systemChannels.map(({ id }) => {
		return { id, textPrimary: id };
	});

	return <AccordionList title="System Channel" noItemsText="No channels received" listItems={systemChannelsList} />;
});
