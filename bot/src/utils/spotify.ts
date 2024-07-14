import axios from 'axios';

const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

export async function getSpotifyToken() {
    const response = await axios.post(
        'https://accounts.spotify.com/api/token',
        new URLSearchParams({
            grant_type: 'client_credentials',
        }),
        {
            headers: {
                Authorization: `Basic ${Buffer.from(
                    `${clientId}:${clientSecret}`,
                ).toString('base64')}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        },
    );

    return response.data.access_token;
}

export interface ISpotifyTrack {
    album: {
        total_tracks: number;
        external_urls: {
            spotify: string;
        };
        id: string;
        images: {
            height: number;
            url: string;
            width: number;
        }[];
        name: string;
        release_date: string;
        release_date_precision: string;
        uri: string;
        artists: {
            external_urls: {
                spotify: string;
            };
            id: string;
            name: string;
            uri: string;
        }[];
    };
    artists: {
        external_urls: {
            spotify: string;
        };
        id: string;
        name: string;
        uri: string;
    }[];
    duration_ms: number;
    explicit: boolean;
    external_urls: {
        spotify: string;
    };
    id: string;
    name: string;
    popularity: number;
    preview_url: string;
    uri: string;
}

export interface ISpotifyError {
    error: string;
    message: string;
}

export async function searchSpotifyTrack(
    query: string,
): Promise<ISpotifyTrack | ISpotifyError> {
    const spotifyToken = await getSpotifyToken();
    const response = await axios
        .get(
            `https://api.spotify.com/v1/search?q=${query}&type=track&limit=1`,
            {
                headers: {
                    Authorization: `Bearer ${spotifyToken}`,
                },
            },
        )
        .catch((err) => {
            return {
                data: {
                    error: 'An error occurred while fetching the data.',
                    message: err.message,
                } as ISpotifyError,
            };
        })
        .then((response) => {
            if (response.data.tracks.total === 0) {
                return {
                    error: 'No tracks found.',
                    message: 'No tracks found.',
                };
            }
            return response.data.tracks.items[0];
        });

    return response;
}
