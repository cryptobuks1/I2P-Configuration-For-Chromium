function onSet(result) {
  if (result) {
    console.log("->: Value was updated");
  } else {
    console.log("-X: Value was not updated");
  }
}

// This disables queries to centralized databases of bad URLs to screen for
// risky sites in your chrome
function disableHyperlinkAuditing() {
  /*    var setting = chrome.privacy.websites.hyperlinkAuditingEnabled.set({
      value: false
    });
    console.log("Disabling hyperlink auditing/val=", {
      value: false
    })
    setting.then(onSet);*/
}

// This enables first-party isolation
function enableFirstPartyIsolation() {
  /*var setting = chrome.privacy.websites.firstPartyIsolate.set({
      value: true
    });
    console.log("Enabling first party isolation/val=", {
      value: true
    })
    setting.then(onSet);*/
}

// This rejects tracking cookies and third-party cookies but it
// LEAVES "Persistent" Cookies unmodified in favor of an option in the content
// interface for now
function disableEvilCookies() {
  /*var getting = chrome.privacy.websites.cookieConfig.get({});
    getting.then((got) => {
        var setting = chrome.privacy.websites.cookieConfig.set(
            {value: {behavior: "reject_third_party",
            nonPersistentCookies: got.value.nonPersistentCookies}}
        );
        console.log("Setting cookie behavior/val=", {value: {behavior: "reject_third_party",
            nonPersistentCookies: got.value.nonPersistentCookies}})
        setting.then(onSet);
    });*/
}

// Make sure that they're gone
/*function disableBadCookies(){
    var setting = chrome.privacy.websites.thirdPartyCookiesAllowed.set({
      value: false
    });
    console.log("Disabling third party cookies/val=", {
      value: false
    })
    setting.then(onSet);
}*/

// this disables the use of referrer headers
function disableReferrers() {
  /*var setting = chrome.privacy.websites.referrersEnabled.set({
      value: false
    });
    console.log("Disabling referrer headers/val=", {
      value: false
    })
    setting.then(onSet);*/
}

// enable fingerprinting resistent features(letterboxing and stuff)
function enableResistFingerprinting() {
  /*var setting = chrome.privacy.websites.referrersEnabled.set({
      value: true
    });
    console.log("Enabling resist fingerprinting/val=", {
      value: true
    })
    setting.then(onSet);*/
}

// This is essentially a blocklist of clearnet web-sites known to do bad tracking
function enableTrackingProtection() {
  /*var setting = chrome.privacy.websites.trackingProtectionMode.set({
      value: "always"
    });
    console.log("Enabling tracking protection/val=", {
      value: "always"
    })
    setting.then(onSet);*/
}

// This disables protected content, which is a form of digital restrictions
// management dependent on identifying information
function disableDigitalRestrictionsManagement() {
  /*var gettingInfo = chrome.runtime.getPlatformInfo();
    gettingInfo.then((got) => {
        if (got.os == "win") {
            var setting = chrome.privacy.websites.protectedContentEnabled.set({
              value: false
            });
            console.log("Setting Protected Content(Digital Restrictions Management) false/val=", {
              value: false
            })
            setting.then(onSet);
        }
    });*/
}

function setAllPrivacy() {
  disableHyperlinkAuditing();
  enableFirstPartyIsolation();
  disableEvilCookies();
  disableReferrers();
  enableTrackingProtection();
  enableResistFingerprinting();
  disableDigitalRestrictionsManagement();
}

setAllPrivacy();

function ResetPeerConnection() {
  //chrome.privacy.network.peerConnectionEnabled.set({value: false});
  //chrome.privacy.network.networkPredictionEnabled.set({value: false});
  chrome.privacy.network.webRTCIPHandlingPolicy.set({
    value: "disable_non_proxied_udp"
  });
  console.log("Re-disabled WebRTC");
}

function EnablePeerConnection() {
  //chrome.privacy.network.peerConnectionEnabled.set({value: true});
  //chrome.privacy.network.networkPredictionEnabled.set({value: false});
  chrome.privacy.network.webRTCIPHandlingPolicy.set({
    value: "disable_non_proxied_udp"
  });
  console.log("Enabled WebRTC");
}

ResetPeerConnection();

function ResetDisableSavePasswords() {
  //chrome.privacy.services.passwordSavingEnabled.set({value: false});
  //console.log("Re-disabled saved passwords")
}

function EnableSavePasswords() {
  //chrome.privacy.services.passwordSavingEnabled.set({value: true});
  //console.log("Enabled saved passwords")
}

//ResetDisableSavePasswords()

var defaultSettings = {
  since: "forever",
  dataTypes: [
    "history",
    "downloads",
    "cache",
    "cookies",
    "passwords",
    "pluginData",
    "formData",
    "serviceWorkers"
  ]
};

var appSettings = {
  since: "forever",
  dataTypes: [""]
};

function onError(e) {
  console.error(e);
}

function checkStoredSettings(storedSettings) {
  //chrome.storage.local.set(appSettings);
}

//const gettingStoredSettings = chrome.storage.local.get();
//gettingStoredSettings.then(checkStoredSettings, onError);

function forgetBrowsingData(storedSettings) {
  function getSince(selectedSince) {
    if (selectedSince === "forever") {
      return 0;
    }

    const times = {
      hour: () => {
        return 1000 * 60 * 60;
      },
      day: () => {
        return 1000 * 60 * 60 * 24;
      },
      week: () => {
        return 1000 * 60 * 60 * 24 * 7;
      }
    };

    const sinceMilliseconds = times[selectedSince].call();
    return Date.now() - sinceMilliseconds;
  }

  function getTypes(selectedTypes) {
    let dataTypes = {};
    for (let item of selectedTypes) {
      dataTypes[item] = true;
    }
    return dataTypes;
  }

  const since = getSince(defaultSettings.since);
  const dataTypes = getTypes(defaultSettings.dataTypes);

  function notify() {
    let dataTypesString = Object.keys(dataTypes).join(", ");
    let sinceString = new Date(since).toLocaleString();
    chrome.notifications.create({
      type: "basic",
      title: "Removed browsing data",
      message: `Removed ${dataTypesString}\nsince ${sinceString}`
    });
  }

  chrome.browsingData.remove({ since }, dataTypes).then(notify);

  setAllPrivacy();
  ResetPeerConnection();
}
