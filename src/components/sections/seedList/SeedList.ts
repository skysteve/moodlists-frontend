import { EventTypes } from '../../../interfaces/Events';
import { SearchResultsChangedEvent } from '../../../events/SearchResultsChangedEvent';
import { SearchResultsPanel } from './searchPanel/SearchResultsPanel';
import { SeedArtistSelectedEvent } from '../../../events/SeedArtistSelectedEvent';
import { ISpotifyArtist } from '../../../interfaces/spotify/SpotifyAristSearchResults';
import {SelectedArtist} from './selectedArtists/SelectedArtist';
import { SelectedArtistRemovedEvent } from '../../../events/SelectedArtistRemovedEvent';
import { SearchBar } from './searchPanel/SearchBar';
import { SelectedArtistsPanel } from './selectedArtists/SelectedArtistsPanel';


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

  private get elSelectedSeedsPanel(): SelectedArtistsPanel {
    return this.querySelector('.seed-selected') as SelectedArtistsPanel;
  }

  private get elSearchBar(): SearchBar {
    return this.querySelector('search-bar') as SearchBar;
  }
}



customElements.define('seed-list', SeedList);
