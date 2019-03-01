import { UserDataLoadedEvent } from './events/UserDataLoadedEvent';
import { UserSigninRequiredEvent as UserSignInRequiredEvent } from './events/UserSigninRequiredEvent';
import { IWorkerMessage, IWorkerResponseMessage, MessageType } from './interfaces/WorkerMessage';
import { EventTypes } from './interfaces/Events';
import { TokensLoadedEvent } from './events/TokensLoadedEvent';

export class SpotifyHelper {
  private spotifyWorker: Worker;
  private inFlightRequests: any;
  private messageId:  number = 0;

  constructor() {
    this.spotifyWorker = new Worker(`/workers/spotifyApiHelper.js#${this.constructAuthHash()}`);
    window.location.hash = '';
    this.spotifyWorker.onmessage = this.onWorkerMessage.bind(this);
    this.inFlightRequests = {};
    window.addEventListener(EventTypes.authTokensLoaded, this.onAuthTokensLoaded.bind(this));
  }

  public makeRequest(message: IWorkerMessage): Promise<any> {
    this.messageId++;
    return new Promise((resolve, reject) => {
      this.inFlightRequests[this.messageId] = { resolve, reject };
      this.spotifyWorker.postMessage({
        ...message,
        messageId: this.messageId
      });
    });
  }

  private onWorkerMessage(event: MessageEvent) {
    try {
      const eventBody = event.data as IWorkerResponseMessage;
      const { data, error, messageId, type } = eventBody;

      switch(type) {
        case MessageType.authRequired:
          const sigInEvent = new UserSignInRequiredEvent();
          return window.dispatchEvent(sigInEvent);
        case MessageType.userData:
          const userEvent = new UserDataLoadedEvent(event.data.data.user);
          return window.dispatchEvent(userEvent);
        case MessageType.storeAuthTokens:
          return this.storeTokens(data);
        default:
          // handled below
      }

      if (messageId) {
        const { resolve, reject } = this.inFlightRequests[messageId];
        delete this.inFlightRequests[messageId];
        if (error) {
          return reject(error);
        }
        return resolve(data);
      }
    } catch (ex) {
      // this should never happen, but just incase
      console.error('worker helper error', ex);
    }
  }

  private constructAuthHash(): string {
    const tokens = {
      access_token: localStorage.getItem('access_token') || '',
      refresh_token: localStorage.getItem('refresh_token') || '',
      expiresAt: localStorage.getItem('expires_at') || '',
    };

    return `access_token=${tokens.access_token}&refresh_token=${tokens.refresh_token}&expiresAt=${tokens.expiresAt}`;
  }

  private onAuthTokensLoaded(event: TokensLoadedEvent): void {
    this.storeTokens(event.tokens);
    this.spotifyWorker.postMessage({
      type: MessageType.authTokensLoaded,
      tokens: event.tokens
    });
  }

  private storeTokens(tokens: {access_token: string, refresh_token?: string; expiresAt: number}): void {
    console.log('%cSTORING TOKENS', 'color: blue; font-size: 5rem;', tokens);
    localStorage.setItem('access_token', tokens.access_token);
    localStorage.setItem('expires_at', tokens.expiresAt.toString());

    // we don't get this if we refresh the tokens - obviously
    if (tokens.refresh_token) {
      localStorage.setItem('refresh_token', tokens.refresh_token);
    }
  }
}

export const spotifyHelperInstance = new SpotifyHelper();
