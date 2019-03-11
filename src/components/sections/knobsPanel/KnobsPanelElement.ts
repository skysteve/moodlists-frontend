import { SectionElement } from '../../ui-elements/SectionElement';
import { spotifyHelperInstance } from '../../../SpotifyHelper';
import { IWorkerMessage, MessageType } from '../../../interfaces/WorkerMessage';
import { SelectedArtistElement } from '../seedList/selectedArtists/SelectedArtistElement';
import { ISpotifyArtist } from '../../../interfaces/spotify/SpotifyAristSearchResults';
import { IKnobSettings } from '../../../interfaces/KnobValues';
import { RangeSliderElement } from '../../ui-elements/RangeSliderElement';
import { RecommendationsLoadedEvent } from '../../../events/RecommendationsLoadedEvent';

export class KnobsPanelElement extends SectionElement {

  constructor() {
    super();

    this.classList.add('section-knobs-panel');

    const template = document.getElementById('section-knobs') as HTMLTemplateElement;
    const clone = document.importNode(template.content, true);

    this.appendChild(clone);

    const elBtnCreate = this.querySelector('#btn-load-recommendations') as HTMLInputElement;
    elBtnCreate.addEventListener('click', this.loadRecommendations.bind(this));
  }

  private async loadRecommendations() {
    const elSelectedArtists = document.querySelectorAll('.selected-artist-list-item') as NodeListOf<SelectedArtistElement>;
    const artists = [] as ISpotifyArtist[];

    if (!elSelectedArtists) {
      return;
    }

    elSelectedArtists.forEach((elArtist) => {
      artists.push(elArtist.artist);
    });

    const message: IWorkerMessage = { type: MessageType.loadRecommendations, artists, knobs: this.knobValues};

    const recommendations = await spotifyHelperInstance.makeRequest(message);
    const event = new RecommendationsLoadedEvent(recommendations);
    this.dispatchEvent(event);
  }

  private get knobValues(): IKnobSettings | void {
    const elSliders = this.querySelectorAll('range-slider') as NodeListOf<RangeSliderElement>;
    const result: any = {};

    if (!elSliders) {
      return;
    }

    elSliders.forEach((element) => {
      const name = element.name;
      if (!name) {
        return;
      }

      result[name] = element.range;
    });

    return result;
  }
}



customElements.define('section-knobs-panel', KnobsPanelElement);
