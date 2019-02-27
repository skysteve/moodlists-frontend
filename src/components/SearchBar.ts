import { SpotifyHelper, spotifyHelperInstance} from '../SpotifyHelper';
import { debounce } from '../helpers';
import { MessageType } from '../interfaces/WorkerMessage';

export class SearchBar extends HTMLInputElement {
  private spotifyHelper: SpotifyHelper;
  private searchInFlight: boolean = false;

  constructor() {
    super();
    console.log('%cHello search', 'color: orange;');

    this.spotifyHelper = spotifyHelperInstance;
    this.addEventListener('keypress', debounce(this.onSearchKeypress.bind(this), 250));
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
      const searchResults:any = await this.spotifyHelper.makeRequest({
        type: MessageType.search,
        searchQuery: {
          query,
          type: 'artist' // hard coded for now, we might change this later to also allow songs
        }
      });

      // TODO - this is just a hack for now to test
      searchResults.artists.items.forEach((artist) => {
        const elLi = document.createElement('li');
        elLi.textContent = artist.name;
        this.appendChild(elLi);
      });

    } catch (ex) {
      alert(`Failed to load search results ${ex.message || ex}`);
    }

    this.searchInFlight = false;
  }
}


customElements.define('search-bar', SearchBar, {extends: 'input'});
