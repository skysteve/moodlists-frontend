import { UserDataLoadedEvent } from './events/UserDataLoadedEvent';
import { UserSigninRequiredEvent } from './events/UserSigninRequiredEvent';
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

      if (type === MessageType.authRequired) {
        const siginEvent = new UserSigninRequiredEvent();
        window.dispatchEvent(siginEvent);
        return;
      }


      if (type === MessageType.userData) {
        const userEvent = new UserDataLoadedEvent(event.data.data.user);
        window.dispatchEvent(userEvent);
        return;
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
    this.spotifyWorker.postMessage({
      type: MessageType.authTokensLoaded,
      tokens: event.tokens
    });
  }
}

export const spotifyHelperInstance = new SpotifyHelper();
