export interface ISpotifyArtistImage {
  height: number;
  url: string;
  width: number;
}

export interface ISpotifyArtist {
  external_urls: {
    spotify: string;
  };
  followers: {
    href: string | null;
    total: number;
  };
  genres: string[];
  href: string;
  id: string;
  images: ISpotifyArtistImage[];
  name: string;
  popularity: number;
  type: string;
  uri: string;
}

export interface ISpotifyArtistSearchResults {
  artists: {
    href: string;
    items: ISpotifyArtist[];
    limit: number;
    next: number | null;
    offset: number;
    previous: number | null;
    total: number;
  };
}
