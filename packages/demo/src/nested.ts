/**
 * This instantiates a page where a nested iframe strategy is used.
 */

const parentWindow = window.parent;   // opener of iframe.
const child = (document.getElementById("iframe") as HTMLIFrameElement) 
const childWindow = child?.contentWindow!!;

// implementation of broadcast, desktop-agent side (post-message-protocol version)
window.addEventListener(
    "message",
    (event) => {
        if (event.source == parentWindow) {
            // from the parent
            childWindow.postMessage(event.data, "*");
        } else if (event.source == childWindow) {
            parentWindow.postMessage(event.data, "*");
        }
    });

// next, set up the child
const url = window.location.href;
const childLocation = url.substring(url.lastIndexOf("url=")+4);
child?.setAttribute("src", childLocation);