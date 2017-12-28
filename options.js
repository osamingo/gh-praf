const save = () => {
  const repositories = document.getElementById('repositories').value;
  if (repositories) {
    chrome.storage.sync.set(JSON.parse(repositories), complate); 
  } else {
    chrome.storage.sync.clear(complate);
  }
}

const restore = () => {
  chrome.storage.sync.get(data => {
    if (Object.keys(data).length) document.getElementById('repositories').value = JSON.stringify(data, null, 2);
  });
}

const complate = () => {
  let status = document.getElementById('status');
  status.textContent = 'saved.';
  setTimeout(() => {
    status.textContent = '';
  }, 900);
}

document.addEventListener('DOMContentLoaded', restore);
document.getElementById('save').addEventListener('click',save);
