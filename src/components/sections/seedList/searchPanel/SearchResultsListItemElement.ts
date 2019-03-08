import {ISpotifyArtist} from '../../../../interfaces/spotify/SpotifyAristSearchResults';
import { SeedArtistSelectedEvent } from '../../../../events/SeedArtistSelectedEvent';

export class SearchResultsListItemElement extends HTMLLIElement {
  private artist: ISpotifyArtist;

  constructor(artist: ISpotifyArtist) {
    super();
    this.classList.add('search-result-list-item');
    this.artist = artist;
    this.addEventListener('click', this.onClicked.bind(this));
  }

  public connectedCallback() {
    const imgObj = this.artist.images[this.artist.images.length - 1] || {};

    this.innerHTML = `<artist-image src="${imgObj.url}"></artist-image>${this.artist.name}`;
  }

  private onClicked() {
    const selectedEvent = new SeedArtistSelectedEvent(this.artist);
    this.dispatchEvent(selectedEvent);
  }
}

customElements.define('search-results-list-item', SearchResultsListItemElement, {extends: 'li'});
