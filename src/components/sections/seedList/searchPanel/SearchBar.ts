import {ISpotifyArtistSearchResults} from '../../../../interfaces/spotify/SpotifyAristSearchResults';
import { MessageType } from '../../../../interfaces/WorkerMessage';

import { SpotifyHelper, spotifyHelperInstance} from '../../../../SpotifyHelper';
import { debounce } from '../../../../helpers';

import { SearchResultsChangedEvent } from '../../../../events/SearchResultsChangedEvent';
import { FieldGroup } from '../../../ui-elements/FieldGroup';

const addonTemplate = document.createElement('template');
addonTemplate.innerHTML = `<div class="control">
  <button class="button is-primary">Search</button>
</div>
`;

export class SearchBar extends FieldGroup {
  // tslint:disable-next-line:variable-name
  private _searchResults: ISpotifyArtistSearchResults | undefined;
  private spotifyHelper: SpotifyHelper;
  private searchInFlight: boolean = false;

  constructor() {
    super();
    // if (!this.shadowRoot) {
    //   throw new Error('expects shadow root');
    // }

    console.log('%cHello search', 'color: orange;');

    this.classList.add('has-addons');
    this.spotifyHelper = spotifyHelperInstance;

    this.appendChild(addonTemplate.content.cloneNode(true));

    // this works because the events bubble - yay bubbles! (we could query select the input if we wanted though)
    this.addEventListener('keypress', debounce(this.onSearchKeypress.bind(this), 250));

    (this.querySelector('button') as HTMLButtonElement).addEventListener('click', this.onSearchClick.bind(this));
  }

  public get searchResults(): ISpotifyArtistSearchResults | undefined {
    return this._searchResults;
  }

  public reset(): void {
    const elInput = this.querySelector('input') as HTMLInputElement;
    elInput.value = '';
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
    } catch (ex) {
      alert(`Failed to load search results ${ex.message || ex}`);
    }

    this.searchInFlight = false;
  }
}


customElements.define('search-bar', SearchBar);
