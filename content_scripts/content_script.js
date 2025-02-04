const urlSelector = '.source_url';

//sort the results
const sortResults = importantUrls => {
  var parent = document.querySelector('tbody.examples');
  var sortedListOfNodes = [...document.querySelectorAll('[id*="row"]')].sort(
    el => {
      const elementUrl = el.querySelector(urlSelector).innerText;

      if (
        importantUrls.some(importantUrl => elementUrl.includes(importantUrl))
      ) {
        return -1;
      }
      return 1;
    }
  );

  //insert the sorted html
  parent.innerHTML = sortedListOfNodes
    .map(el => el.outerHTML)
    .reduce((a, b) => a + ' ' + b);

  //add the class to highlight the important urls
  [...document.querySelectorAll(urlSelector)].map(
    element =>
      importantUrls.some(importantUrl =>
        element.innerText.includes(importantUrl)
      )
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
chrome.storage.onChanged.addListener(changes =>
  sortResults(changes.importantUrls.newValue)
);

//focus on keyup Esc
function focusInput(e) {
  if (e.keyCode === 27) {
    var searchInput = document.querySelector('#queryinput');
    searchInput.focus();
    searchInput.setSelectionRange(0, searchInput.value.length);
  }
}
document.addEventListener('keyup', focusInput);
