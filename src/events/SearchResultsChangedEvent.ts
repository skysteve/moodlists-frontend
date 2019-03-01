import { EventTypes } from '../interfaces/Events';
import { ISpotifyArtistSearchResults } from '../interfaces/spotify/SpotifyAristSearchResults';

export class SearchResultsChangedEvent extends CustomEvent<{}> {
  constructor(searchResults: ISpotifyArtistSearchResults) {
    super(EventTypes.searchResultsLoaded, {
      bubbles: true,
      detail: searchResults
    });
  }

  public get searchResults(): ISpotifyArtistSearchResults {
    return this.detail as ISpotifyArtistSearchResults;
  }
}
