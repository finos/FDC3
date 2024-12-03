import { AgentError, DesktopAgent, GetAgentParams } from "@kite9/fdc3-standard";
import { Loader } from "./Loader";



/**
 * This loader handles timing out.
 */
export class TimeoutLoader implements Loader {

    done = false

    poll(endTime: number, resolve: (value: DesktopAgent | void) => void, reject: (reason?: any) => void) {
        const timeRemaining = endTime - Date.now()

        if ((timeRemaining > 0) && (this.done == false)) {
            setTimeout(() => this.poll(endTime, resolve, reject), 100);
        } else if (this.done == false) {
            reject(new Error(AgentError.AgentNotFound));
        } else {
            resolve();
        }
    }

    cancel(): void {
        this.done = true;
    }

    get({timeoutMs = 0}: GetAgentParams): Promise<DesktopAgent | void> {
        return new Promise<DesktopAgent | void>((resolve, reject) => {
            const endPollTime = Date.now() + timeoutMs
            this.poll(endPollTime, resolve, reject)
        });
    }
}
