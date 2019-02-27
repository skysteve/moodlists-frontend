import {ISpotifyArtistSearchResults} from '../../interfaces/spotify/SpotifyAristSearchResults';
import { MessageType } from '../../interfaces/WorkerMessage';

import { SpotifyHelper, spotifyHelperInstance} from '../../SpotifyHelper';
import { debounce } from '../../helpers';

import { SearchResultsChangedEvent } from '../../events/SearchResultsChangedEvent';
import { FieldGroup } from './FieldGroup';

const addonTemplate = document.createElement('template');
addonTemplate.innerHTML = `<div class="control">
  <button type="submit" class="button is-primary">Search</button>
</div>
`;

const resultListTemplate = document.createElement('template');
resultListTemplate.innerHTML = `
<link rel="stylesheet" href="/css/components/search-bar.css">
<div class="result-list">
  <ul></ul>
</div>
`;

// TODO - I think this should extend field, just the input is messy
export class SearchBar extends FieldGroup {
  // tslint:disable-next-line:variable-name
  private _searchResults: ISpotifyArtistSearchResults | undefined;
  private spotifyHelper: SpotifyHelper;
  private searchInFlight: boolean = false;

  constructor() {
    super();
    if (!this.shadowRoot) {
      throw new Error('expects shadow root');
    }

    console.log('%cHello search', 'color: orange;');

    this.classList.add('has-addons');
    this.spotifyHelper = spotifyHelperInstance;

    this.shadowRoot.appendChild(addonTemplate.content.cloneNode(true));

    // this works because the events bubble - yay bubbles! (we could query select the input if we wanted though)
    this.addEventListener('keypress', debounce(this.onSearchKeypress.bind(this), 250));

    (this.shadowRoot.querySelector('button') as HTMLButtonElement).addEventListener('click', this.onSearchClick.bind(this));
  }

  public get searchResults(): ISpotifyArtistSearchResults | undefined {
    return this._searchResults;
  }

  private onSearchKeypress(event: KeyboardEvent): void {
    const elTarget = event.target as HTMLInputElement;
    const query = elTarget.value;

    this.doSearch(query);
  }

  private onSearchClick(event: MouseEvent): void {
    const elInput = this.querySelector('input') as HTMLInputElement;
    this.doSearch(elInput.value);
  }

  private async doSearch(query: string): Promise<void> {
    // don't do anything if a search is already in flight
    if (this.searchInFlight) {
      return;
    }

    // min length of 3 chars to search
    if (!query || query.length < 3) {
      return;
    }

    this.searchInFlight = true;
    try {
      const searchResults: ISpotifyArtistSearchResults = await this.spotifyHelper.makeRequest({
        type: MessageType.search,
        searchQuery: {
          query,
          type: 'artist' // hard coded for now, we might change this later to also allow songs
        }
      });

      // store search results and dispatch update with new results
      this._searchResults = searchResults;
      const resultsChangeEvent = new SearchResultsChangedEvent(searchResults);
      this.dispatchEvent(resultsChangeEvent);

      const resultTemplateInstance = resultListTemplate.content.cloneNode(true) as HTMLElement;
      const elResultList = resultTemplateInstance.querySelector('ul') as HTMLUListElement;

      searchResults.artists.items.forEach((artist) => {
        const elLi = document.createElement('li');
        elLi.textContent = artist.name;
        elLi.addEventListener('click', () => console.log('%cList item clicked - TODO', 'color: red; font-weight: bold;'));
        elResultList.appendChild(elLi);
      });

      if (this.shadowRoot) {
        this.shadowRoot.appendChild(resultTemplateInstance);
      }
    } catch (ex) {
      alert(`Failed to load search results ${ex.message || ex}`);
    }

    this.searchInFlight = false;
  }
}


customElements.define('search-bar', SearchBar);
