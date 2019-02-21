import { IKnobsSate } from '../../stateStore/reducers/knobs';
import { IPlaylistData } from '../../interfaces/WorkerMessage';

const ROOT_URL = 'https://api.spotify.com/v1';
const AUTH_URL = 'http://localhost:3000' // 'https://iskpng28a8.execute-api.eu-west-1.amazonaws.com/Prod'; //'http://localhost:3000';

enum REQUEST_TYPE {
  GET = 'get',
  POST = 'post',
  PUT = 'put'
}

export class ApiHelper {
  private accessToken: string | void = '';
  private refreshToken: string | void = '';
  private expiresAt: number;

  constructor() {
    const params = this.getHashParams();
    this.accessToken = params.access_token;
    this.refreshToken = params.refresh_token;
    this.expiresAt = params.expiresAt || 0;
  }

  public get authUrl() {
    return AUTH_URL;
  }

  public hasAuthToken(): boolean {
    return !!this.accessToken;
  }

  public getUserData(): Promise<any> {
    return this.makeRequest('me', REQUEST_TYPE.GET);
  }

  public async search(query: string, type: string, market = 'us', limit = 10, offset = 0) {
    const queryString = `q=${escape(query)}&type=${type}&market=${market}&limit=${limit}&offset=${offset}`;

    return await this.makeRequest(`search?${queryString}`);
  }

  public async loadRecommendations(artists: any[] = [], knobs?: IKnobsSate, limit: number = 25) {
    const seedArtists = artists.map(artist => artist.id);
    const knobsToQS = !knobs ? null : Object.keys(knobs).map(k => {
      // duration is a bit different - we need to multiply the seconds to ms
      if (k === 'duration') {
        return `min_duration_ms=${(knobs[k].min*1000).toString()}&max_duration_ms=${(knobs[k].max*1000).toString()}`;
      }

      return [
        `min_${encodeURIComponent(k)}=${encodeURIComponent((knobs[k].min/100).toString())}`,
        `max_${encodeURIComponent(k)}=${encodeURIComponent((knobs[k].max/100).toString())}`,
      ].join('&');
    }).join('&');
    const queryString = `seed_artists=${seedArtists.join(',')}&market=US&${knobsToQS}&limit=${limit}`;
    return await this.makeRequest(`recommendations?${queryString}`);
  }

  public async createPlaylist(playlistData: IPlaylistData) {
    const postBody = {
      name: playlistData.title,
      description: playlistData.description
    };

    const createdPlaylist = await this.makeRequest(`me/playlists`, REQUEST_TYPE.POST, postBody);

    await this.makeRequest(`playlists/${createdPlaylist.id}/tracks`, REQUEST_TYPE.POST, {
      uris: playlistData.tracks
    });

    if (!playlistData.playNow) {
      return;
    }

    return this.makeRequest('me/player/play', REQUEST_TYPE.PUT, {
      context_uri: createdPlaylist.uri
    });
  }

  private async makeRequest(path: string, type: REQUEST_TYPE = REQUEST_TYPE.GET, postBody? : any) {
    await this.refreshUserToken();

    const res = await fetch(`${ROOT_URL}/${path}`, {
      headers: {
        Accept: '*/*',
        Authorization: `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json'
      },
      method: type,
      body: postBody ? JSON.stringify(postBody) : undefined
    });

    if (res.status < 200 || res.status > 299) {
      throw new Error(`Failed to load data ${res.statusText}`);
    }

    const json = await res.json();
    return json;
  }

  private getHashParams(): {access_token?: string, refresh_token?: string, error? :string, expiresAt?: number} {
    const hashParams = {} as any;
    let e: any;
    const r = /([^&;=]+)=?([^&;]*)/g;
    const q = self.location.hash.substring(1);
    // tslint:disable-next-line:no-conditional-assignment
    while ( e = r.exec(q)) {
       hashParams[e[1]] = decodeURIComponent(e[2]);
    }
    return hashParams;
  }

  private async refreshUserToken() {
    if (new Date().getTime() < this.expiresAt) {
      return; // nothing to do
    }

    const res = await fetch(`${AUTH_URL}/refresh-token?refresh_token=${this.refreshToken}`);

    if (res.ok) {
      const body = await res.json();
      this.accessToken = body.access_token;
      return this.accessToken;
    }

    throw new Error('Failed to refresh token');
  }
}
