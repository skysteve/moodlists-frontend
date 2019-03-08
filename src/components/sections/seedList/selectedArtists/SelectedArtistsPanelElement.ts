import { ISpotifyArtist } from '../../../../interfaces/spotify/SpotifyAristSearchResults';
import { SelectedArtistElement } from './SelectedArtistElement';

const template = document.createElement('template');
template.innerHTML = `<p class="panel-heading">Selected Artists:</p>
<div class="panel-block">
  <ul></ul>
</div>
<div class="panel-block">
  <button class="button is-link is-outlined is-fullwidth" id="btn-selected-next">Next</button>
</div>`;

export class SelectedArtistsPanelElement extends HTMLElement {

  constructor() {
    super();
    this.classList.add('seed-selected', 'is-hidden', 'panel');

    const elTemplate = template.content.cloneNode(true);
    this.appendChild(elTemplate);
  }

  public addArtist(artist: ISpotifyArtist) {
    const elResultList = this.querySelector('ul') as HTMLUListElement;

    this.classList.remove('is-hidden');

    const listItem = new SelectedArtistElement(artist);
    elResultList.appendChild(listItem);
  }
}

customElements.define('selected-artist-panel', SelectedArtistsPanelElement);
