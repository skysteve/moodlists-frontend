import { EventTypes } from '../interfaces/Events';
import { ISpotifyRecommendations } from '../interfaces/spotify/SpotifyRecommendations';

export class RecommendationsLoadedEvent extends CustomEvent<{}> {
  constructor(userData: ISpotifyRecommendations) {
    super(EventTypes.recommendationsLoaded, {
      bubbles: true,
      detail: userData
    });
  }

  public get recommendations(): ISpotifyRecommendations {
    return this.detail as ISpotifyRecommendations;
  }
}
