import { EventTypes } from '../interfaces/Events';
import { ISpotifyUser } from '../interfaces/spotify/SpotifyUser';

export class UserDataLoadedEvent extends CustomEvent<{}> {
  constructor(userData: ISpotifyUser) {
    super(EventTypes.userData, {
      detail: userData
    });
  }

  public get user(): ISpotifyUser {
    return this.detail as ISpotifyUser;
  }
}
