import {ISpotifyArtistSearchResults, ISpotifyArtist} from '../../../../interfaces/spotify/SpotifyAristSearchResults';
import {SearchResultsListItem} from './SearchResultsListItem';
import {SeedArtistSelectedEvent} from '../../../../events/SeedArtistSelectedEvent';
import { EventTypes } from '../../../../interfaces/Events';

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

    this.addEventListener(EventTypes.seedArtistSelected, this.onArtistSelected.bind(this));
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

    const elPanelBody = this.elResultList;
    elPanelBody.innerHTML = ''; // clear out existing results

    this._searchResults.artists.items.forEach((artist) => {
      const elResult = new SearchResultsListItem(artist);
      elPanelBody.appendChild(elResult);
    });

    this.classList.remove('is-hidden');
  }

  private onArtistSelected(event: SeedArtistSelectedEvent) {
    // on artist selected, hide self
    this.classList.add('is-hidden');
  }

  private get elResultList(): HTMLUListElement {
    return this.querySelector('.panel-block ul') as HTMLUListElement;
  }
}

customElements.define('search-results-panel', SearchResultsPanel);
