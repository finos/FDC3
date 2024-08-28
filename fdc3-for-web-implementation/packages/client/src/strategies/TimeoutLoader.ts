import { DesktopAgent } from "@finos/fdc3";
import { GetAgentParams } from "@kite9/fdc3-common";
import { Loader } from "./Loader";



/**
 * This loader handles timing out.
 */
class TimeoutLoader implements Loader {

    done = false

    poll(endTime: number, resolve: (value: DesktopAgent | Error) => void, reject: (reason?: any) => void) {
        const timeRemaining = endTime - Date.now()

        if ((timeRemaining > 0) && (this.done == false)) {
            setTimeout(() => this.poll(endTime, resolve, reject), 100);
        } else {
            reject(new Error('timeout'));
        }
    }

    cancel(): void {
        this.done = true;
    }

    get(params: GetAgentParams): Promise<DesktopAgent | Error> {
        return new Promise<DesktopAgent | Error>((resolve, reject) => {
            const endPollTime = Date.now() + params.timeout
            this.poll(endPollTime, resolve, reject)
        });
    }
}



export default new TimeoutLoader();
