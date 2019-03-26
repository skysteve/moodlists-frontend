import {SectionElement} from '../../ui-elements/SectionElement';
import { EventTypes } from '../../../interfaces/Events';
import { RecommendationsLoadedEvent } from '../../../events/RecommendationsLoadedEvent';
import { CreatePlaylistModal } from '../../modals/CreatePlaylistModal';
import { ITrack } from '../../../interfaces/spotify/SpotifyRecommendations';

export class RecommendationsListElement extends SectionElement {
  private tracks: ITrack[] = [];

  constructor() {
    super();

    // this.classList.add('section-recommendations-list');

    const elBtnCreate = this.querySelector('#btn-create-playlist') as HTMLInputElement;
    elBtnCreate.addEventListener('click', this.createPlaylist.bind(this));

    window.addEventListener(EventTypes.recommendationsLoaded, this.onRecommendationsLoaded.bind(this));
  }

  protected get cardTitle(): string {
    return 'Your recommendations';
  }

  protected get content(): DocumentFragment {
    const template = document.getElementById('section-recommendations') as HTMLTemplateElement;
    return document.importNode(template.content, true);
  }

  protected get canExpand(): boolean {
    // expandable if there are selected artists
    return !!document.querySelector('.selected-artist-list-item');
  }

  private createPlaylist() {
    const modal = new CreatePlaylistModal(this.tracks);
    document.body.appendChild(modal);
  }

  private onRecommendationsLoaded(event: RecommendationsLoadedEvent) {
    const recommendations = event.recommendations;

    this.tracks = recommendations.tracks;
    this.toggleCollapse();

    // todo - better error
    if (!Array.isArray(this.tracks) || this.tracks.length < 1) {
      alert('No recommendations found');
    }

    const elList = this.querySelector('ul') as HTMLUListElement;

    // clear out existing elements
    elList.innerHTML = '';

    this.tracks.forEach((track) => {
      const elLi = document.createElement('li');
      elLi.textContent = track.artists[0].name + ' - ' + track.name;
      elList.appendChild(elLi);
    });
  }
}

customElements.define('section-recommendations-list', RecommendationsListElement);
