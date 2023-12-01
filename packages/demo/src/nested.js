/**
 * This instantiates a page where a nested iframe strategy is used.
 */
var parentWindow = window.parent; // opener of iframe.
var child = document.getElementById("iframe");
var childWindow = child === null || child === void 0 ? void 0 : child.contentWindow;
// implementation of broadcast, desktop-agent side (post-message-protocol version)
window.addEventListener("message", function (event) {
    var data = event.data;
    if (event.source == parentWindow) {
        // from the parent
        childWindow.postMessage(event.data, "*");
    }
    else if (event.source == childWindow) {
        parentWindow.postMessage(event.data, "*");
    }
});
// next, set up the child
var url = window.location.href;
var childLocation = url.substring(url.lastIndexOf("url=") + 4);
child === null || child === void 0 ? void 0 : child.setAttribute("src", childLocation);
