import { EventTypes } from '../../../interfaces/Events';
import { SearchResultsChangedEvent } from '../../../events/SearchResultsChangedEvent';
import { SearchResultsPanelElement } from './searchPanel/SearchResultsPanelElement';
import { SeedArtistSelectedEvent } from '../../../events/SeedArtistSelectedEvent';
import { ISpotifyArtist } from '../../../interfaces/spotify/SpotifyAristSearchResults';
import { SelectedArtistRemovedEvent } from '../../../events/SelectedArtistRemovedEvent';
import { SearchBarElement } from './searchPanel/SearchBarElement';
import { SelectedArtistsPanelElement } from './selectedArtists/SelectedArtistsPanelElement';
import { SectionElement } from '../../ui-elements/SectionElement';

export class SeedListElement extends SectionElement {
  private selectedArtists: ISpotifyArtist[] = [];

  constructor() {
    super();

    (this.querySelector('.card-content .content') as HTMLDivElement).classList.add('section-seed-list');

    this.addEventListener(EventTypes.searchResultsLoaded, this.onSearchResultsLoaded.bind(this));
    this.addEventListener(EventTypes.seedArtistSelected, this.onArtistSelected.bind(this));
    this.addEventListener(EventTypes.selectedArtistRemoved, this.onArtistRemoved.bind(this));
  }

  protected get canExpand(): boolean {
    // expandable if there are selected artists
    return true;
  }

  protected get cardTitle(): string {
    return 'Choose some artists';
  }

  protected get content(): DocumentFragment {
    const template = document.getElementById('section-seed-list') as HTMLTemplateElement;
    return document.importNode(template.content, true);
  }

  private onSearchResultsLoaded(event: SearchResultsChangedEvent) {
    event.stopPropagation();
    console.log('%cLoaded search results', 'color: green;');
    const elSearchResults = this.querySelector('search-results-panel') as SearchResultsPanelElement;

    elSearchResults.searchResults = event.searchResults;
  }

  private onArtistSelected(event: SeedArtistSelectedEvent) {
    const artist = event.artist;

    // don't allow the same artist twice
    if (this.selectedArtists.some((a) => a.id === artist.id)) {
      alert('You have already selected this artist');
      return;
    }

    this.elSearchBar.reset();
    this.selectedArtists.push(artist);

    this.elSelectedSeedsPanel.addArtist(artist);

    if (this.selectedArtists.length >= 5) {
      const elSearchPanel = this.querySelector('.seed-search-panel') as HTMLDivElement;
      elSearchPanel.classList.add('is-hidden');
    }
  }

  private onArtistRemoved(event: SelectedArtistRemovedEvent) {
    const removedArtist = event.artist;

    // remove the element from the list, and the dom
    this.selectedArtists = this.selectedArtists.filter((artist) => artist.id !== removedArtist.id);
    (event.target as HTMLElement).remove();

    if (this.selectedArtists.length < 1) {
      this.elSelectedSeedsPanel.classList.add('is-hidden');
    }
  }

  private get elSelectedSeedsPanel(): SelectedArtistsPanelElement {
    return this.querySelector('.seed-selected') as SelectedArtistsPanelElement;
  }

  private get elSearchBar(): SearchBarElement {
    return this.querySelector('search-bar') as SearchBarElement;
  }
}



customElements.define('section-seed-list', SeedListElement);
