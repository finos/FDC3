import { Messaging } from "da"
import { DefaultChannel } from "da"
import { StatefulChannel } from "da"

export function createDefaultChannels(messaging: Messaging) : StatefulChannel[] {
    return [
        new DefaultChannel(messaging, "one", "user", {color: "green"}),
        new DefaultChannel(messaging, "two", "user", {color: "green"}),
        new DefaultChannel(messaging, "three", "user", {color: "green"})
    ]
}