import {ISpotifyArtist} from '../../interfaces/spotify/SpotifyAristSearchResults';

export class SearchResultsListItem extends HTMLLIElement {
  private artist: ISpotifyArtist;

  constructor(artist: ISpotifyArtist) {
    super();
    this.classList.add('search-result-list-item');
    this.artist = artist;
  }

  public connectedCallback() {
    const imgObj = this.artist.images[this.artist.images.length - 1] || {};

    this.innerHTML = `<artist-image src="${imgObj.url}"></artist-image>${this.artist.name}`;
  }
}

customElements.define('search-results-list-item', SearchResultsListItem, {extends: 'li'});
