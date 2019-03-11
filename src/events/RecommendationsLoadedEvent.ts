import { EventTypes } from '../interfaces/Events';
import { IISpotifyRecommendations } from '../interfaces/spotify/SpotifyRecommendations';

export class RecommendationsLoadedEvent extends CustomEvent<{}> {
  constructor(userData: IISpotifyRecommendations) {
    super(EventTypes.recommendationsLoaded, {
      bubbles: true,
      detail: userData
    });
  }

  public get recommendations(): IISpotifyRecommendations {
    return this.detail as IISpotifyRecommendations;
  }
}
