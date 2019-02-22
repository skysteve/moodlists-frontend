export enum MessageType {
  authRequired = 'authRequired',
  authTokensLoaded = 'authTokensLoaded',
  connected = 'connected',
  createPlaylist = 'createPlaylist',
  error = 'error',
  loadRecommendations = 'loadRecommendations',
  search = 'search',
  userData = 'userData'
}

export interface IPlaylistData {
  title: string;
  description: string;
  tracks: string[];
  playNow: boolean;
}

export interface IWorkerMessage {
  artists?: any[];
  knobs?: any; // TODO
  searchQuery?: {
    query: string;
    type: string;
  };
  type: MessageType;
  messageId?: number;
  playlistData?: IPlaylistData;
}

export interface IWorkerResponseMessage {
  data: any;
  error: Error;
  messageId: number;
  type: MessageType;
}
