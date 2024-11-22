import { FDC3_USER_INTERFACE_RESTYLE_TYPE } from "@kite9/fdc3-schema/generated/api/BrowserTypes";
import { DEFAULT_COLLAPSED_CSS, Position } from "./channel-selector";

export function dragElement(elmnt: HTMLElement, myPort: MessagePort, position: Position) {
    var posXDrag = 0, posYDrag = 0, posXStart = 0, posYStart = 0;
    var top = 0, left = 0, screenX = 0, screenY = 0

    elmnt.onmousedown = dragMouseDown;

    globalThis.window.onresize = () => {
        screenX = window.innerWidth
        screenY = window.innerHeight
    }

    function fireGrow() {
        myPort.postMessage({
            type: FDC3_USER_INTERFACE_RESTYLE_TYPE,
            payload: {
                updatedCSS: {
                    left: `0px`,
                    top: `0px`,
                    right: `0px`,
                    bottom: '0px',
                    position: "fixed",
                    width: "100%",
                    height: "100%"
                }
            }
        });

        elmnt.style.left = `${left}px`
        elmnt.style.top = `${top}px`
        elmnt.style.right = ''
        elmnt.style.bottom = ''
        elmnt.style.width = DEFAULT_COLLAPSED_CSS.width
        elmnt.style.height = DEFAULT_COLLAPSED_CSS.height
        console.log("fireGrow")
    }

    function createNewPosition(): Position {
        return {
            left: (left < screenX / 2) ? `${left}px` : "",
            top: (top < screenY / 2) ? `${top}px` : "",
            right: (left > screenX / 2) ? `${screenX - left - elmnt.offsetWidth}px` : "",
            bottom: (top > screenY / 2) ? `${screenY - top - elmnt.offsetHeight}px` : ""
        }
    }

    function setTopAndLeft() {
        if (position.left) {
            left = parseInt(position.left)
        } else {
            left = screenX - parseInt(position.right) - elmnt.offsetWidth
        }

        if (position.top) {
            top = parseInt(position.top)
        } else {
            top = screenY - parseInt(position.bottom) - elmnt.offsetHeight
        }
    }

    function fireShrink() {
        myPort.postMessage({
            type: FDC3_USER_INTERFACE_RESTYLE_TYPE,
            payload: {
                updatedCSS: {
                    ...DEFAULT_COLLAPSED_CSS,
                    ...createNewPosition()
                }
            }
        });

        setTimeout(() => {
            elmnt.style.right = '0px'
            elmnt.style.bottom = '0px'
            elmnt.style.top = '0px'
            elmnt.style.left = '0px'
            elmnt.style.width = '100%'
            elmnt.style.height = '100%'
        }, 5)
    }

    function dragMouseDown(e: MouseEvent) {
        e.preventDefault();
        // get the mouse cursor position at startup:
        left =
            posXStart = left + e.clientX;
        posYStart = top + e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
        fireGrow()
    }

    function elementDrag(e: MouseEvent) {
        e.preventDefault();
        // calculate the new cursor position:
        posXDrag = posXStart - e.clientX;
        posYDrag = posYStart - e.clientY;
        posXStart = e.clientX;
        posYStart = e.clientY;
        // set the element's new position:
        top = Math.max((elmnt.offsetTop - posYDrag), 0)
        left = Math.max((elmnt.offsetLeft - posXDrag), 0)
        elmnt.style.top = top + "px";
        elmnt.style.left = left + "px";
    }

    function closeDragElement() {
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
        fireShrink()
        console.log('closeDragElement');
    }

    fireShrink()
}