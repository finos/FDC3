import { Position } from "./channel-selector";

export function dragElement(drag: HTMLElement, selector: HTMLElement, position: Position) {
    var posXDrag = 0, posYDrag = 0, posXStart = 0, posYStart = 0;
    var top = 0, left = 0, screenX = 0, screenY = 0

    drag.onmousedown = dragMouseDown;

    globalThis.window.onresize = () => {
        screenX = window.innerWidth
        screenY = window.innerHeight
    }

    function updatePosition() {
        position.left = (left < screenX / 2) ? `${Math.max(left, 0)}px` : ""
        position.top = (top < screenY / 2) ? `${Math.max(top, 0)}px` : ""
        position.right = (left > screenX / 2) ? `${Math.max(screenX - left - selector.offsetWidth, 0)}px` : ""
        position.bottom = (top > screenY / 2) ? `${Math.max(screenY - top - selector.offsetHeight, 0)}px` : ""

    }

    function dragMouseDown(e: MouseEvent) {
        console.log("astarting")
        e.preventDefault();
        // get the mouse cursor position at startup:
        posXStart = e.clientX;
        posYStart = e.clientY;
        document.onmousemove = elementDrag;
        document.onmouseup = closeDragElement;
    }

    function elementDrag(e: MouseEvent) {
        e.preventDefault();
        // calculate the new cursor position:
        posXDrag = posXStart - e.clientX;
        posYDrag = posYStart - e.clientY;
        posXStart = e.clientX;
        posYStart = e.clientY;
        // set the element's new position:
        top = Math.max((selector.offsetTop - posYDrag), 0)
        left = Math.max((selector.offsetLeft - posXDrag), 0)
        selector.style.top = top + "px";
        selector.style.left = left + "px";
        updatePosition()
    }

    function closeDragElement() {

        document.onmouseup = null;
        document.onmousemove = null;
    }
}