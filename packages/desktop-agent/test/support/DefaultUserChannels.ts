import { Messaging } from "../../src/Messaging";
import { DefaultChannel } from "../../src/channels/DefaultChannel";
import { StatefulChannel } from "../../src/channels/StatefulChannel";

export function createDefaultChannels(messaging: Messaging) : StatefulChannel[] {
    return [
        new DefaultChannel(messaging, "one", "user", {color: "green"}),
        new DefaultChannel(messaging, "two", "user", {color: "green"}),
        new DefaultChannel(messaging, "three", "user", {color: "green"})
    ]
}