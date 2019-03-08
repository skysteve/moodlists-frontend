import { ISpotifyArtist } from '../../../../interfaces/spotify/SpotifyAristSearchResults';
import {SelectedArtistRemovedEvent} from '../../../../events/SelectedArtistRemovedEvent';

export class SelectedArtist extends HTMLLIElement {
  private artist: ISpotifyArtist;

  constructor(artist: ISpotifyArtist) {
    super();
    this.classList.add('selected-artist-list-item');
    this.artist = artist;
  }

  public connectedCallback() {
    const imgObj = this.artist.images[this.artist.images.length - 1] || {};

    this.innerHTML = `<artist-image src="${imgObj.url}"></artist-image><span>${this.artist.name}</span><a class="delete"></a>`;

    const elDelete = this.querySelector('.delete') as HTMLAnchorElement;

    elDelete.addEventListener('click', this.onDeleteClick.bind(this));
  }

  private onDeleteClick() {
    const removedEvent = new SelectedArtistRemovedEvent(this.artist);
    this.dispatchEvent(removedEvent);
  }
}

customElements.define('selected-artist', SelectedArtist, {extends: 'li'});
