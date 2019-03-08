import {ISpotifyArtistSearchResults, ISpotifyArtist} from '../../interfaces/spotify/SpotifyAristSearchResults';
import {SearchResultsListItem} from './SearchResultsListItem';
import {SeedArtistSelectedEvent} from '../../events/SeedArtistSelectedEvent';

const template = document.createElement('template');
template.innerHTML = `
<p class="panel-heading">
  Artists:
</p>
<div class="panel-block">
<ul></ul>
</div>
`;

export class SearchResultsPanel extends HTMLElement {
  // tslint:disable-next-line:variable-name
  private _searchResults: ISpotifyArtistSearchResults | undefined;

  constructor(searchResults?: ISpotifyArtistSearchResults) {
    super();

    this._searchResults = searchResults;
    this.classList.add('panel', 'search-results-panel');
    this.classList.add('is-hidden');

    const elTemplate = template.content.cloneNode(true) as HTMLElement;
    this.appendChild(elTemplate);
  }

  public connectedCallback() {
    this.render();
  }

  public set searchResults(searchResults: ISpotifyArtistSearchResults) {
    this._searchResults = searchResults;
    this.render();
  }

  private render() {
    // only render if we have search results
    if (!this._searchResults) {
      return;
    }

    const elPanelBody = this.querySelector('.panel-block ul') as HTMLDivElement;
    elPanelBody.innerHTML = ''; // clear out existing results

    this._searchResults.artists.items.forEach((artist) => {
      const elResult = new SearchResultsListItem(artist);
      elResult.addEventListener('click', this.onResultClicked.bind(this, artist));
      elPanelBody.appendChild(elResult);
    });

    this.classList.remove('is-hidden');
  }

  private onResultClicked(artist: ISpotifyArtist) {
    const selectedEvent = new SeedArtistSelectedEvent(artist);
    this.dispatchEvent(selectedEvent);
  }
}

customElements.define('search-results-panel', SearchResultsPanel);
