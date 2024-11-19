import { AgentError, DesktopAgent, GetAgentParams } from "@kite9/fdc3-standard";
import { DesktopAgentSelection, Loader } from "./Loader";



/**
 * This loader handles timing out.
 */
export class TimeoutLoader implements Loader {

    done = false;

    //TODO: replace polling with an actual timeout

    poll(endTime: number, resolve: (value: DesktopAgentSelection | void) => void, reject: (reason?: any) => void) {
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

    get(params: GetAgentParams): Promise<DesktopAgentSelection | void> {
        return new Promise<DesktopAgentSelection | void>((resolve, reject) => {
            const endPollTime = Date.now() + params.timeoutMs!!;
            this.poll(endPollTime, resolve, reject);
        });
    }
}
