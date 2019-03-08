import { ISpotifyArtist } from '../../../../interfaces/spotify/SpotifyAristSearchResults';
import {SelectedArtistRemovedEvent} from '../../../../events/SelectedArtistRemovedEvent';

export class SelectedArtistElement extends HTMLLIElement {
  private spotifyArtist: ISpotifyArtist;

  constructor(artist: ISpotifyArtist) {
    super();
    this.classList.add('selected-artist-list-item');
    this.spotifyArtist = artist;
  }

  public connectedCallback() {
    const imgObj = this.spotifyArtist.images[this.spotifyArtist.images.length - 1] || {};

    this.innerHTML = `<artist-image src="${imgObj.url}"></artist-image><span>${this.spotifyArtist.name}</span><a class="delete"></a>`;

    const elDelete = this.querySelector('.delete') as HTMLAnchorElement;

    elDelete.addEventListener('click', this.onDeleteClick.bind(this));
  }

  public get artist(): ISpotifyArtist {
    return this.spotifyArtist;
  }

  private onDeleteClick() {
    const removedEvent = new SelectedArtistRemovedEvent(this.spotifyArtist);
    this.dispatchEvent(removedEvent);
  }
}

customElements.define('selected-artist', SelectedArtistElement, {extends: 'li'});
