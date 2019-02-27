import {ISpotifyArtistSearchResults} from '../../interfaces/spotify/SpotifyAristSearchResults';
import { MessageType } from '../../interfaces/WorkerMessage';

import { SpotifyHelper, spotifyHelperInstance} from '../../SpotifyHelper';
import { debounce } from '../../helpers';

import { SearchResultsChangedEvent } from '../../events/SearchResultsChangedEvent';

// TODO - I think this should extend field, just the input is messy
export class SearchBar extends HTMLInputElement {
  // tslint:disable-next-line:variable-name
  private _searchResults: ISpotifyArtistSearchResults | undefined;
  private spotifyHelper: SpotifyHelper;
  private searchInFlight: boolean = false;

  constructor() {
    super();
    console.log('%cHello search', 'color: orange;');

    this.spotifyHelper = spotifyHelperInstance;
    this.addEventListener('keypress', debounce(this.onSearchKeypress.bind(this), 250));
  }

  public get searchResults(): ISpotifyArtistSearchResults | undefined {
    return this._searchResults;
  }

  private async onSearchKeypress(event: KeyboardEvent) {
    // don't do anything if a search is already in flight
    if (this.searchInFlight) {
      return;
    }

    const elTarget = event.target as HTMLInputElement;
    const query = elTarget.value;

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


customElements.define('search-bar', SearchBar, {extends: 'input'});
