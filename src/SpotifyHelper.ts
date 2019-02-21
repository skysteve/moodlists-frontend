import { EventTypes } from './interfaces/Events';
import { IWorkerMessage, IWorkerResponseMessage, MessageType } from './interfaces/WorkerMessage';

export class SpotifyHelper {
  private spotifyWorker: Worker;
  private inFlightRequests: any;
  private messageId:  number = 0;

  constructor() {
    this.spotifyWorker = new Worker(`/workers/spotifyApiHelper.js#${this.constructAuthHash()}`);
    window.location.hash = '';
    this.spotifyWorker.onmessage = this.onWorkerMessage.bind(this);
    this.inFlightRequests = {};
  }

  public makeRequest(message: IWorkerMessage) {
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
        return console.log('Login required'); // TODO - something better here
      }


      if (type === MessageType.userData) {
        const userEvent = new CustomEvent(EventTypes.userData, {detail: event.data.data.user});
        window.dispatchEvent(userEvent);
        return console.log('USER DATA', event.data.data.user);
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
      access_token: localStorage.getItem('access_token'),
      refresh_token: localStorage.getItem('refresh_token'),
      expiresAt: localStorage.getItem('expires_at'),
    };

    return `access_token=${tokens.access_token}&refresh_token=${tokens.refresh_token}&expiresAt=${tokens.expiresAt}`;
  }
}
