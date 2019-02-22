import { EventTypes } from '../interfaces/Events';
import { IAuthTokens } from '../interfaces/AuthTokens';

export class TokensLoadedEvent extends CustomEvent<{}> {
  constructor(authTokens: IAuthTokens) {
    super(EventTypes.authTokensLoaded, {
      detail: authTokens
    });
  }

  public get tokens(): IAuthTokens {
    return this.detail as IAuthTokens;
  }
}
