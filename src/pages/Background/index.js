console.log('This is the background page.');


chrome.runtime.onInstalled.addListener(function(details) {
    if (details.reason == "install") {
        // This code will run on extension installation
        const url = `chrome-extension://${chrome.runtime.id}/newtab.html`;
        chrome.tabs.create({url: url});
    } else if (details.reason == "update") {
        // This code will run on extension update
        // You can remove this block if you don't need it
    }
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action == "openNewTab") {
      chrome.tabs.create({ url: 'newtab.html' }, function(tab) {
        if (chrome.runtime.lastError) {
          sendResponse({message: "Failed to open new tab."});
        } else {
          sendResponse({message: "New tab opened."});
        }
      });
      return true;  // Will respond asynchronously.
    }
  });
  
