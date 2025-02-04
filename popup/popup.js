//promise to get stored urls

//render the stored urls
const renderUrls = urls => {
  console.log('urls array ', urls);
  const urlsHTML =
    urls === undefined || urls.length === 0
      ? ''
      : urls
          .map((url, index) => {
            console.log('url ', url);
            return `
        <label 
          id ="url-${index}" 
          class="important-url" 
          data-url="${url}">
           <span class="url-text"> ${url}</span>
            <button id="btn-${index}"class="badge badge-danger delete-url">
              ×
            </button>            
        </label>`;
          })
          .reduce((a, b) => a + b);

  // append HTML
  var urlsSection = document.querySelector('#urlsSection');
  urlsSection.innerHTML = urlsHTML;

  //remove buttons
  const deleteButtons = [...document.querySelectorAll('.delete-url')];
  deleteButtons.map(deleteButton => {
    deleteButton.addEventListener('click', removeUrl);
  });
};

//remove url function
const removeUrl = event => {
  const urlId = 'url-' + event.target.id.split('-')[1];
  const urlToRemove = document.querySelector(`#${urlId}`).dataset.url;
  console.log('url to remove ', urlToRemove);
  chrome.storage.local.get('importantUrls', result => {
    var urls = result['importantUrls'].filter(url => url !== urlToRemove);
    chrome.storage.local.set({ importantUrls: urls });
    renderUrls(urls);
  });
};

// add url function
const addUrl = () => {
  const urlInput = document.querySelector('#urlInput');
  let url = urlInput.value;
  url = url.replace(/[<>]/g, '');
  url = url.trim();
  urlInput.value = '';
  if (url === '') return;
  chrome.storage.local.get('importantUrls', result => {
    var urls = result['importantUrls'];
    var newUrls = urls === undefined ? [url] : [...urls, url];
    chrome.storage.local.set({
      importantUrls: newUrls
    });
    renderUrls(newUrls);
  });
};
//add url button
var addUrlButton = document.querySelector('#addUrlButton');
addUrlButton.addEventListener('click', addUrl);

//execute the promise
chrome.storage.local.get('importantUrls', result => {
  var urls = result['importantUrls'];
  renderUrls(urls);
});
