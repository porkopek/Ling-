const urlSelector = '.source_url';

//sort the results
const sortResults = importantUrls => {
  var parent = document.querySelector('tbody.examples');
  var sortedListOfNodes = [...document.querySelectorAll('[id*="row"]')].sort((a, b) => {
    const aText = a.querySelector(urlSelector).innerText;
    const bText = b.querySelector(urlSelector).innerText;
    let aIndex = importantUrls.findIndex(url => aText.includes(url));
    let bIndex = importantUrls.findIndex(url => bText.includes(url));
    if (aIndex === -1) aIndex = importantUrls.length;
    if (bIndex === -1) bIndex = importantUrls.length;
    return aIndex - bIndex;
  });

  //insert the sorted html
  parent.innerHTML = sortedListOfNodes.map(el => el.outerHTML).reduce((a, b) => a + ' ' + b);

  //add the class to highlight the important urls
  [...document.querySelectorAll(urlSelector)].map(element =>
    importantUrls.some(importantUrl => element.innerText.includes(importantUrl))
      ? element.parentElement.classList.add('important-result')
      : element.parentElement.classList.remove('important-result')
  );
};

//initial get urls
chrome.storage.local.get('importantUrls', result => {
  var urls = result['importantUrls'];
  sortResults(urls);
});

//listen for changes in popup
chrome.storage.onChanged.addListener(changes => sortResults(changes.importantUrls.newValue));
