let headersMap = {};

// Load saved headers from storage
chrome.storage.local.get('headersMap', (data) => {
  if (data.headersMap) {
    headersMap = data.headersMap;
  }
});

// Intercept requests and add headers
chrome.webRequest.onBeforeSendHeaders.addListener(
  (details) => {
    const host = new URL(details.url).host;
    if (headersMap[host]) {
      details.requestHeaders = details.requestHeaders.concat(
        Object.entries(headersMap[host]).map(([name, value]) => ({
          name,
          value
        }))
      );
    }
    return { requestHeaders: details.requestHeaders };
  },
  { urls: ["<all_urls>"] },
  ["blocking", "requestHeaders"]
);

// Save headers to storage
function saveHeaders() {
  chrome.storage.local.set({ headersMap });
}

// Handle messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getHeaders') {
    sendResponse({ 
      headers: headersMap[request.host] || {} 
    });
  }
  else if (request.action === 'addHeader') {
    if (!headersMap[request.host]) headersMap[request.host] = {};
    headersMap[request.host][request.name] = request.value;
    saveHeaders();
    sendResponse({ success: true });
  }
  else if (request.action === 'removeHeader') {
    if (headersMap[request.host]) {
      delete headersMap[request.host][request.name];
      if (Object.keys(headersMap[request.host]).length === 0) {
        delete headersMap[request.host];
      }
      saveHeaders();
      sendResponse({ success: true });
    }
  }
});