const setup = (data, callback) => {
  document.body.setAttribute("data-visible", "true");
  document.getElementById("displayContext").textContent = data.context ?? "*";
  console.log("setup: ", data);
  const intentSelect = document.getElementById("displayIntent");
  data.intents.forEach(({intent, displayName}) => {
    const option = document.createElement("option");
    option.textContent = displayName;
    option.value = intent;
    intentSelect.appendChild(option);
  });
  intentSelect.addEventListener("change", (e) => fillList(data.options[e.target.value], e.target.value, callback));
  fillList(data.options[intentSelect.value], intentSelect.value, callback);

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
      const listRef = tab.getAttribute("data-list-ref");
      document.getElementById(listRef).setAttribute("data-visible", "true");
    });
  });

  document.getElementById("cancel").addEventListener("click", () => {
    callback({
      type: "Fdc3UserInterfaceResolveAction",
      action: "cancel"
    });
  })
}

const fillList = ({apps, openApps}, intent, callback) => {
  const newList = document.getElementById('new-list');
  newList.innerHTML = '';
  apps.forEach(({ appId, title, icon }) => {
    const node = document.createElement('div');
    node.setAttribute('tabIndex', '0');
    node.setAttribute("data-appId", appId);

    const span = document.createElement("span");
    span.textContent = title;

    const img = document.createElement("img");
    if(icon?.src){
        img.src = icon.src;
    }else{
        img.style.opacity = 0;
    }

    node.appendChild(img);
    node.appendChild(span);

    node.addEventListener('mouseenter', () => callback({
      type: "Fdc3UserInterfaceResolveAction",
      appId,
      intent,
      action: "hover",
      newOrOpen: "new"
    }));
    node.addEventListener('click', () => {
      callback({
        type: "Fdc3UserInterfaceResolveAction",
        appId,
        intent,
        action: "click",
        newOrOpen: "new"
      });
      callback({
        type: "Fdc3UserInterfaceResolve",
        appId,
        intent,
        newOrOpen: "new"
      });
    });

    newList.appendChild(node);
  });
  document.getElementById("count-new-apps").textContent = `(${apps.length})`;

  const openList = document.getElementById('open-list');
  openList.innerHTML = '';
  openApps.forEach(({ appId, title, windowId }) => {
    const appd = apps.find((app) => app.appId === appId);
    const node = document.createElement('div');
    node.setAttribute('tabIndex', '0');
    node.setAttribute("data-appId", appId);

    const span = document.createElement("span");
    span.textContent = title;

    const img = document.createElement("img");
    if(appd.icon?.src){
        img.src = appd.icon.src;
    }else{
        img.style.opacity = 0;
    }

    node.appendChild(img);
    node.appendChild(span);

    node.addEventListener('mouseenter', () => callback({
      type: "Fdc3UserInterfaceResolveAction",
      appId,
      windowId,
      intent,
      action: "hover",
      newOrOpen: "open"
    }));
    node.addEventListener('click', () => {
      callback({
        type: "Fdc3UserInterfaceResolveAction",
        appId,
        windowId,
        intent,
        action: "click",
        newOrOpen: "open"
      });
      callback({
        type: "Fdc3UserInterfaceResolve",
        appId,
        intent,
        windowId,
        newOrOpen: "open"
      })
    });

    openList.appendChild(node);
  });
  document.getElementById("count-open-apps").textContent = `(${openApps.length})`;
};

// STEP 1B: Receive port from parent
window.addEventListener('message', ({ ports }) => {
  // STEP 3B: Receive channel data from parent
  ports[0].onmessage = ({ data }) => {
    setup(data, msg => {
      // STEP 4A: Send user selection information to parent
      ports[0].postMessage(msg);
    });
  };
  // STEP 2A: Send confirmation over port to parent
  ports[0].postMessage({type: 'Fdc3UserInterfaceHandshake'});
});
