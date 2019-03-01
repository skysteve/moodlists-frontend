import { EventTypes } from '../../interfaces/Events';
import { SearchResultsChangedEvent } from '../../events/SearchResultsChangedEvent';
import { SearchResultsPanel } from '../ui-elements/SearchResultsPanel';

export class SeedList extends HTMLElement {

  constructor() {
    super();

    this.classList.add('section');

    const template = document.getElementById('section-seed-list') as HTMLTemplateElement;
    const clone = document.importNode(template.content, true);

    this.appendChild(clone);

    this.addEventListener(EventTypes.searchResultsLoaded, this.onSearchResultsLoaded.bind(this));
  }

  private onSearchResultsLoaded(event: SearchResultsChangedEvent) {
    event.stopPropagation();
    console.log('%cLoaded search results', 'color: green;');
    const elSearchResults = this.querySelector('search-results-panel') as SearchResultsPanel;

    elSearchResults.searchResults = event.searchResults;
  }

}

customElements.define('seed-list', SeedList);
