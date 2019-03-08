import { ISpotifyArtist } from '../../../../interfaces/spotify/SpotifyAristSearchResults';
import { SelectedArtistElement } from './SelectedArtistElement';
import {AllSeedsSelectedEvent} from '../../../../events/AllSeedsSelectedEvent';

const template = document.createElement('template');
template.innerHTML = `<p class="panel-heading">Selected Artists:</p>
<div class="panel-block">
  <ul></ul>
</div>
<div class="panel-block">
  <button class="button is-link is-outlined is-fullwidth">Next</button>
</div>`;

export class SelectedArtistsPanelElement extends HTMLElement {

  constructor() {
    super();
    this.classList.add('seed-selected', 'is-hidden', 'panel');

    const elTemplate = template.content.cloneNode(true);
    this.appendChild(elTemplate);

    (this.querySelector('button') as HTMLButtonElement).addEventListener('click', this.onNextClick.bind(this));
  }

  public addArtist(artist: ISpotifyArtist) {
    const elResultList = this.querySelector('ul') as HTMLUListElement;

    this.classList.remove('is-hidden');

    const listItem = new SelectedArtistElement(artist);
    elResultList.appendChild(listItem);
  }

  private onNextClick() {
    this.dispatchEvent(new AllSeedsSelectedEvent());
  }
}

customElements.define('selected-artist-panel', SelectedArtistsPanelElement);
