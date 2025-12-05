import type { SearchStore, SearchItem } from './types';

(function() {
  function displaySearchResults(results: any[], store: SearchStore): void {
    const searchResults = document.getElementById('search-results');
    
    if (!searchResults) {
      return;
    }

    if (results.length) {
      let appendString = '';

      for (let i = 0; i < results.length; i++) {
        const item: SearchItem = store[results[i].ref];

        appendString += `<li class="search-item"><a href="${item.url}"><h3>${item.title}</h3></a>`;
        appendString += `<p class="search-content">${item.content.substring(0, 150)}...</p>`;
        appendString += `<p class="search-content-type">${item.type}</p></li>`;
        if (i !== results.length - 1) {
          appendString += '<hr class="search-result-separator border-[#d3d3d366]" />';
        }
      }

      searchResults.innerHTML = appendString;
    } else {
      searchResults.innerHTML = '<li>No results found</li>';
    }
  }

  function getQueryVariable(variable: string): string | undefined {
    const query = window.location.search.substring(1);
    const vars = query.split('&');

    for (let i = 0; i < vars.length; i++) {
      const pair = vars[i].split('=');

      if (pair[0] === variable) {
        return decodeURIComponent(pair[1].replace(/\+/g, '%20'));
      }
    }
    
    return undefined;
  }

  const searchTerm = getQueryVariable('query');

  if (searchTerm) {
    const searchBox = document.getElementById('search-box');
    if (searchBox) {
      searchBox.setAttribute('value', searchTerm);
    }

    // Initialize lunr with the fields it will be searching on. I've given title
    // a boost of 10 to indicate matches on this field are more important.
    const idx = window.lunr(function(this: any) {
      this.field('id');
      this.field('title', { boost: 10 });
      this.field('author');
      this.field('category');
      this.field('content');

      for (const key in window.store) {
        if (Object.prototype.hasOwnProperty.call(window.store, key)) {
          this.add({
            'id': key,
            'title': window.store[key].title,
            'author': window.store[key].author,
            'category': window.store[key].category,
            'content': window.store[key].content
          });
        }
      }
    });

    const results = idx.search(searchTerm);
    displaySearchResults(results, window.store);
  }
})();
