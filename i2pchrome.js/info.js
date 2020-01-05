document.addEventListener("click", e => {
  function getCurrentWindow() {
    return chrome.windows.getCurrent();
  }

  if (e.target.id === "window-create-help-panel") {
    let createData = {
      type: "panel",
      incognito: true
    };
    let creating = chrome.windows.create(createData);
    creating.then(() => {
      console.log("The help panel has been created");
    });
  } else if (e.target.id === "window-create-news-panel") {
    let createData = {
      type: "panel",
      incognito: true
    };
    let creating = chrome.windows.create(createData);
    creating.then(() => {
      console.log("The news panel has been created");
    });
  } else if (e.target.id === "generate-fresh-tunnel") {
    function RefreshIdentity() {
      console.log("Generating new identity");
      const Http = new XMLHttpRequest();
      const url = "http://" + controlHost + ":" + controlPort;
      Http.open("GET", url);
      Http.send();
      Http.onreadystatechange = e => {
        console.log(Http.responseText);
      };
    }
    RefreshIdentity();
  } else if (e.target.id === "window-preface-title") {
    getCurrentWindow().then(currentWindow => {
      let updateInfo = {
        titlePreface: "I2P Help | "
      };
      chrome.windows.update(currentWindow.id, updateInfo);
    });
  } else if (e.target.id === "clear-chrome-data") {
    forgetBrowsingData();
  }

  e.preventDefault();
});
