console.log('This is the background page.');


chrome.runtime.onInstalled.addListener(function (details) {
  if (details.reason == "install") {
    // This code will run on extension installation
    const url = `chrome-extension://${chrome.runtime.id}/newtab.html`;
    chrome.tabs.create({ url: url });
  } else if (details.reason == "update") {
    // This code will run on extension update
    // You can remove this block if you don't need it
  }
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action == "openNewTab") {
    chrome.tabs.create({ url: 'newtab.html' }, function (tab) {
      if (chrome.runtime.lastError) {
        sendResponse({ message: "Failed to open new tab." });
      } else {
        sendResponse({ message: "New tab opened." });
      }
    });
    return true;  // Will respond asynchronously.
  }
});

let storedApiKey = null;   // To store the API Key
let storedToken = null;    // To store the Token

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.type === 'SET_API_KEY') {
    console.log('Received API key in background script:', request.apiKey);
    storedApiKey = request.apiKey;  // Store the API key
    console.log('Stored API Key:', storedApiKey);  // Log the stored key for verification
    sendResponse({ message: 'API key received successfully!' });
  } else if (request.type === 'SET_TOKEN') {
    console.log('Received token in background script:', request.token);
    storedToken = request.token;    // Store the token
    sendResponse({ message: 'Token received successfully!' });
  }
  // You can add more conditions here as needed
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.type === 'GET_DATA') {
    sendResponse({ token: storedToken, apiKey: storedApiKey });
  }
  // Handle other message types...
});




