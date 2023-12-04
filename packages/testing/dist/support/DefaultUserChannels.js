import { DefaultChannel } from "da";
export function createDefaultChannels(messaging) {
    return [
        new DefaultChannel(messaging, "one", "user", { color: "red" }),
        new DefaultChannel(messaging, "two", "user", { color: "green" }),
        new DefaultChannel(messaging, "three", "user", { color: "blue" })
    ];
}
//# sourceMappingURL=DefaultUserChannels.js.map