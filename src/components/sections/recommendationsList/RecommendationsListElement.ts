import {SectionElement} from '../../ui-elements/SectionElement';
import { EventTypes } from '../../../interfaces/Events';
import { RecommendationsLoadedEvent } from '../../../events/RecommendationsLoadedEvent';

export class RecommendationsListElement extends SectionElement {
  constructor() {
    super();

    this.classList.add('section-recommendations-list');

    const template = document.getElementById('section-recommendations') as HTMLTemplateElement;
    const clone = document.importNode(template.content, true);

    this.appendChild(clone);

    const elBtnCreate = this.querySelector('#btn-create-playlist') as HTMLInputElement;
    elBtnCreate.addEventListener('click', this.createPlaylist.bind(this));

    window.addEventListener(EventTypes.recommendationsLoaded, this.onRecommendationsLoaded.bind(this));
  }

  private createPlaylist() {
    alert('TODO');
  }

  private onRecommendationsLoaded(event: RecommendationsLoadedEvent) {
    const recommendations = event.recommendations;

    const tracks = recommendations.tracks;

    // todo - better error
    if (!Array.isArray(tracks) || tracks.length < 1) {
      alert('No recommendations found');
    }

    const elList = this.querySelector('ul') as HTMLUListElement;

    // clear out existing elements
    elList.innerHTML = '';

    tracks.forEach((track) => {
      const elLi = document.createElement('li');
      elLi.textContent = track.artists[0].name + ' ' + track.name;
      elList.appendChild(elLi);
    });
  }
}

customElements.define('section-recommendations-list', RecommendationsListElement);
