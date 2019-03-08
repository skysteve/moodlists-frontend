import { EventTypes } from '../../../interfaces/Events';
import { SearchResultsChangedEvent } from '../../../events/SearchResultsChangedEvent';
import { SearchResultsPanel } from '../../ui-elements/SearchResultsPanel';
import { SeedArtistSelectedEvent } from '../../../events/SeedArtistSelectedEvent';
import { ISpotifyArtist } from '../../../interfaces/spotify/SpotifyAristSearchResults';
import {SelectedArtist} from './selectedArtists/SelectedArtist';


export class SeedList extends HTMLElement {
  private selectedArtists: ISpotifyArtist[] = [];

  constructor() {
    super();

    this.classList.add('section', 'section-seed-list');

    const template = document.getElementById('section-seed-list') as HTMLTemplateElement;
    const clone = document.importNode(template.content, true);

    this.appendChild(clone);

    this.addEventListener(EventTypes.searchResultsLoaded, this.onSearchResultsLoaded.bind(this));
    this.addEventListener(EventTypes.seedArtistSelected, this.onArtistSelected.bind(this));
    this.addEventListener(EventTypes.selectedArtistRemoved, this.onArtistRemoved.bind(this));
  }

  private onSearchResultsLoaded(event: SearchResultsChangedEvent) {
    event.stopPropagation();
    console.log('%cLoaded search results', 'color: green;');
    const elSearchResults = this.querySelector('search-results-panel') as SearchResultsPanel;

    elSearchResults.searchResults = event.searchResults;
  }

  private onArtistSelected(event: SeedArtistSelectedEvent) {
    const artist = event.artist;

    // don't allow the same artist twice
    if (this.selectedArtists.some((a) => a.id === artist.id)) {
      alert('You have already selected this artist');
      return;
    }

    this.selectedArtists.push(artist);

    const elSelectedSeeds = this.elSelectedSeeds;
    const elResultList = elSelectedSeeds.querySelector('ul') as HTMLUListElement;

    elSelectedSeeds.classList.remove('is-hidden');

    const listItem = new SelectedArtist(artist);
    elResultList.appendChild(listItem);

    if (this.selectedArtists.length >= 5) {
      const elSearchPanel = this.querySelector('.seed-search-panel') as HTMLDivElement;
      elSearchPanel.classList.add('is-hidden');
    }
  }

  private onArtistRemoved(event: SelectedArtistRemovedEvent) {
    const removedArtist = event.artist;

    // remove the element from the list, and the dom
    this.selectedArtists = this.selectedArtists.filter((artist) => artist.id !== removedArtist.id);
    event.target.remove();

    if (this.selectedArtists.length < 1) {
      this.elSelectedSeeds.classList.add('is-hidden');
    }
  }

  private get elSelectedSeeds(): HTMLDivElement {
    return this.querySelector('.seed-selected') as HTMLDivElement;
  }
}



customElements.define('seed-list', SeedList);
