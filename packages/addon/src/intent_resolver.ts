import { Icon } from "@kite9/fdc3";
import { AppIntent } from "@kite9/fdc3";
import { IframeResolveActionPayload, IframeResolvePayload } from "@kite9/fdc3-common";

const setup = (data: IframeResolvePayload, callback: (s: IframeResolveActionPayload) => void) => {
  document.body.setAttribute("data-visible", "true");

  const intentSelect = document.getElementById("displayIntent") as HTMLSelectElement

  const justIntents = data.appIntents.map(({intent}) => intent)
  const doneIntents = new Set()

  justIntents.forEach(({ name, displayName }) => {
    if (doneIntents.has(name)) {
      return;
    }
    doneIntents.add(name);
    const option = document.createElement("option");
    option.textContent = displayName as string;
    option.value = name;
    intentSelect.appendChild(option);
  });

  intentSelect.addEventListener("change", (e: any) => fillList(data.appIntents.filter(ai => ai.intent.name == e?.target?.value), e?.target?.value, callback));

  fillList(data.appIntents.filter(ai => ai.intent.name == intentSelect.value), intentSelect.value, callback);

  const tabs = Array.from(document.querySelectorAll("[role='tab']"))
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      // Remove selected state from every tab
      tabs.forEach((t) => {
        t.setAttribute("aria-selected", "false");
      });
      // Hide lists
      Array.from(document.querySelectorAll(".list")).forEach((elem) => {
        elem.setAttribute("data-visible", "false");
      });

      tab.setAttribute("aria-selected", "true");
      const listRef = tab.getAttribute("data-list-ref")!!;
      document.getElementById(listRef)!!.setAttribute("data-visible", "true");
    });
  });

  document.getElementById("cancel")?.addEventListener("click", () => {
    callback({
      action: "cancel"
    });
  });

  console.log(document.body);
}

function createIcon(icons: Icon[] | undefined): HTMLElement {
  const img = document.createElement("img");
  if (icons && icons.length > 0) {
    img.src = icons[0].src;
  } else {
    img.style.opacity = "0";
  }

  return img
}

const fillList = (ai: AppIntent[], intent: string, callback: (s: IframeResolveActionPayload) => void) => {
  const allApps = ai.flatMap(a => a.apps)
  const openApps = allApps.filter(a => a.instanceId)
  const newApps = allApps.filter(a => !a.instanceId)

  // first, populate the "New Apps" tab
  const newList = document.getElementById('new-list') as HTMLDivElement;

  newList.innerHTML = '';
  newApps.forEach(({ appId, title, icons }) => {
    const node = document.createElement('div');
    node.setAttribute('tabIndex', '0');
    node.setAttribute("data-appId", appId);

    const span = document.createElement("span");
    span.textContent = title ?? appId;

    const img = createIcon(icons)

    node.appendChild(img);
    node.appendChild(span);

    node.addEventListener('click', () => {
      callback({
        action: "click",
        intent,
        appIdentifier: {
          appId
        }
      })
    });

    node.addEventListener('hover', () => {
      callback({
        action: "hover",
        intent,
        appIdentifier: {
          appId
        }
      })
    });

    newList.appendChild(node);

  });

  // then, populate the "Open Apps" tab
  const openList = document.getElementById('open-list')!!
  openList.innerHTML = '';

  openApps.forEach(({ appId, title, icons, instanceId }) => {
    const node = document.createElement('div');
    node.setAttribute('tabIndex', '0');
    node.setAttribute("data-appId", appId);

    const span = document.createElement("span");
    span.textContent = title ?? appId;

    const img = createIcon(icons)

    node.appendChild(img);
    node.appendChild(span);

    node.addEventListener('click', () => {
      callback({
        action: "click",
        intent,
        appIdentifier: {
          appId
        }
      })
    });

    node.addEventListener('hover', () => {
      callback({
        action: "hover",
        intent,
        appIdentifier: {
          appId
        }
      })
    });

    openList.appendChild(node);
  });

};

window.addEventListener("load", () => {
  const parent = window.parent;

  const mc = new MessageChannel();
  const myPort = mc.port1;
  myPort.start();
  myPort.onmessage = ({data}) => {
    console.debug("Received message: ", data);
    switch(data.type){
      case "iframeHandshake": {
        break;
      }
      case "iframeResolve": {
        setup(data.payload, (s) => {
          myPort.postMessage({
            type: "iframeResolveAction",
            payload: s
          })
        })
      }
    }
  };

  parent.postMessage({
    type: "iframeHello",
    payload: {
      initialCSS: {
        width: "200px",
        height: "400px",
        zIndex: "100",
        top: "0"
      }
    }
  }, "*", [mc.port2]);

});