//#region >> CONSTANTS <<
const STORAGE_KEYS = {
  badgeText: "badgeText",
};
const MESSAGE_KEYS = {
  badgeText: "badge-text",
  pageMeta: "page-meta",
};

//#endregion

//#region >> Register Event / Message Listeners <<

//Event Handlers

chrome.tabs.onActivated.addListener(monitorTabActivated);
chrome.tabs.onUpdated.addListener(monitorPageLoad);

// Message Listeners

chrome.runtime.onMessage.addListener(badgeTextMessageHandler);
chrome.runtime.onMessage.addListener(pageMetaMessageHandler);

// chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => { 
//     getPageMeta()
//         .then(meta => {
//             console.log("DEBUG: back from getPageMeta", meta);
//             sendResponse(meta);
//         })
//         .catch(err => {
//             console.log("DEBUG: Error in getPageMeta", err);
//         });
//     return true;
// });

//#endregion

//#region >> BOOTSTRAP <<

chrome.storage.local.get(["badgeText"], ({ badgeText }) => {
  chrome.action.setBadgeText({ text: `${badgeText || "hi"}` });
});

//#endregion


//#region >>> define the message handlers <<<

function pageMetaMessageHandler(msg, sender, sendResponse) {
  if (msg?.id === MESSAGE_KEYS.pageMeta) {
    getPageMeta()
        .then(meta => {
            console.log("DEBUG: back from getPageMeta", meta);
            sendResponse(meta);
        })
        .catch(err => {
            console.log("DEBUG: Error in getPageMeta", err);
        });
    return true;
  }
}

function badgeTextMessageHandler(msg, sender, sendResponse) {
  const { id, text } = msg;
  if (id === MESSAGE_KEYS.badgeText && typeof text === "string") {
    console.log("DEBUG: badgeTextMessageHandler", { msg, id, text, sender });
    const data = {};
    data[STORAGE_KEYS.badgeText] = text;
    chrome.storage.local.set(data);

    chrome.action.setBadgeText({ text });
    sendResponse(data);
    return true;
  }
}


//#endregion


//#region >>> define the handlers <<<

function monitorTabActivated(activeInfo) {
  //todo: what to do when a tab is changed?
}
function monitorPageLoad(tabId, info, tab) {
  if (info?.status === "complete") {
    const data = {
      tabId,
      windowId: tab?.windowId,
      title: tab?.title,
      url: tab?.url,
      domain: extractDomain(tab?.url),
    };
    console.log("DEBUG: Page Load", { data, tabId, info, tab });
  }
}

function handleActionClick(e) {
  console.log("DEBUG: handleActionClick", e);
}




//#endregion

//#region >>> HELPERS <<<

async function getPageMeta() {
    const [tab] = await chrome.tabs.query({ currentWindow: true, active: true });
    console.log("DEBUG: pageMetaMessageHandler", { tab });
    if (tab) {
        return {
            id: tab?.id,
            title: tab?.title,
            url: tab?.url,
            domain: extractDomain(tab?.url),
            };
    }
    return {error: 'could not get the tab'};
  }
  
  

function extractDomain(url) {
  if (url) {
    //trick from stack overflow (https://stackoverflow.com/questions/8498592/extract-hostname-name-from-string)
    //DON'T HAVE ACCESS TO document in SERVICE WORKER
    // const el = document.createElement('a');
    // el.href = url;
    // return el.hostname;

    const parts = url.split("//");
    if (parts.length > 1) {
      return parts[1].split("/")[0];
    }
  }
  //else
  return null;
}

//#endregion
