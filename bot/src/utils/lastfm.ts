import axios from 'axios';

export interface IRecentTracksOptions {
    limit?: number;
    from?: number;
    to?: number;
}

export interface ILastFMTrack {
    name: string;
    mbid: string;
    artist: {
        mbid: string;
        name: string;
        url: string;
    };
    album: {
        mbid: string;
        '#text': string;
    };
    image: {
        size: 'small' | 'medium' | 'large' | 'extralarge';
        '#text': string;
    }[];
    streamable: string;
    url: string;
    '@attr': {
        nowplaying: string;
    };
}

export interface ILastFMError {
    error: string;
    message: string;
}

export interface ILastFMUser {
    name: string;
    realname: string;
    image: {
        size: 'small' | 'medium' | 'large' | 'extralarge';
        '#text': string;
    }[];
    url: string;
    id: string;
    country: string;
    age: string;
    gender: string;
    subscriber: string;
    playcount: string;
    playlists: string;
    bootstrap: string;
    registered: {
        unixtime: string;
        '#text': string;
    };
    type: string;
}

export interface ILastFMArtistInfo {
    name: string;
    mbid: string;
    url: string;
    image: {
        size: 'small' | 'medium' | 'large' | 'extralarge';
        '#text': string;
    }[];
    stats: {
        listeners: string;
        playcount: string;
    };
    

export async function getRecentTracks(
    username: string,
    options?: IRecentTracksOptions,
): Promise<ILastFMTrack[] | ILastFMError> {
    const response = await axios
        .get(
            `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${username}&api_key=${
                process.env.LASTFM_API_KEY
            }&format=json&extended=1&limit=${options?.limit || 5}${
                options?.from ? `&from=${options.from}` : ''
            }${options?.to ? `&to=${options.to}` : ''}`,
        )
        .catch((err) => {
            return {
                data: {
                    error: 'An error occurred while fetching the data.',
                    message: err.message,
                } as ILastFMError,
            };
        })
        .then((response) => {
            if (response.data.error) {
                return response.data;
            }
            return response.data.recenttracks.track;
        });

    return response;
}

export async function getUserInfo(
    username: string,
): Promise<ILastFMUser | ILastFMError> {
    const response = await axios
        .get(
            `https://ws.audioscrobbler.com/2.0/?method=user.getinfo&user=${username}&api_key=${process.env.LASTFM_API_KEY}&format=json`,
        )
        .catch((err) => {
            return {
                data: {
                    error: 'An error occurred while fetching the data.',
                    message: err.message,
                } as ILastFMError,
            };
        })
        .then((response) => {
            if (response.data.error) {
                return response.data;
            }
            return response.data.user;
        });

    return response;
}

export async function getArtistPlaycount(username: string):