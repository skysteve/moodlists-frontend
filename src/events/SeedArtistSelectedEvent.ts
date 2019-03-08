import { EventTypes } from '../interfaces/Events';
import { ISpotifyArtist } from '../interfaces/spotify/SpotifyAristSearchResults';

export class SeedArtistSelectedEvent extends CustomEvent<{}> {
  constructor(artist: ISpotifyArtist) {
    super(EventTypes.seedArtistSelected, {
      bubbles: true,
      detail: artist
    });
  }

  public get artist(): ISpotifyArtist {
    return this.detail as ISpotifyArtist;
  }
}
