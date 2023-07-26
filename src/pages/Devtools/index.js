chrome.devtools.panels.create(
  'Dev Tools from chrome-extension-boilerplate-react',
  'icon-34.png',
  'panel.html'
);


chrome.storage.sync.get(['apiKey'], function (result) {
  console.log(result.apiKey);
});
