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

    const elBtnCreate = this.querySelector('#btn-load-recommendations') as HTMLInputElement;
    elBtnCreate.addEventListener('click', this.loadRecommendations.bind(this));
  }

  protected get cardTitle(): string {
    return 'Tweak Your playlist';
  }

  protected get content(): DocumentFragment {
    const template = document.getElementById('section-knobs') as HTMLTemplateElement;
    return document.importNode(template.content, true);
  }

  protected get canExpand(): boolean {
    // expandable if there are selected artists
    return !!document.querySelector('.selected-artist-list-item');
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
    this.toggleCollapse();
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
