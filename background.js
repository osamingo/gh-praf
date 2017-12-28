'use strict';

(async () => {

  let repos = await new Promise((resolve) => {
    chrome.storage.sync.get((data) => {
      resolve(data);
    });
  });

  chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'sync') {
      let newRepos = {};
      for(const [key, val] of Object.entries(changes)) {
        if (val.newValue) newRepos[key] = val.newValue;
      }
      repos = newRepos;
    }
  });

  chrome.webRequest.onBeforeRequest.addListener(detail => {
    let parser = new URL(detail.url);
    const addition = repos[parser.pathname.match(/\/(.+)\/compare\/*/)[1]];
    if (addition) {
      for(const [key, val] of Object.entries(addition)) {
        if (!parser.searchParams.has(key)) parser.searchParams.set(key, val.join(','));
      }
      return { redirectUrl: parser.toString() }
    }
  }, {
    urls: ['https://github.com/*/compare/*']
  }, [
    'blocking'
  ]);

})();
