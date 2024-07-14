import { z } from 'zod';

const Env = z.object({
    DISCORD_TOKEN: z.string(),
    DATABASE_URL: z.string(),
    BUN_ENV: z.string(),
    LASTFM_API_KEY: z.string(),
    SPOTIFY_CLIENT_ID: z.string(),
    SPOTIFY_CLIENT_SECRET: z.string(),
});

export const parseEnv = (data: object) => {
    const result = Env.safeParse(data);
    if (result.success) return result.data;

    const errorMessages = result.error.issues.reduce(
        (container, issue, index) =>
            (container +=
                issue.path.join(', ') +
                (index + 1 === result.error.issues.length ? '' : ', ')),
        '',
    );
    throw 'Missing configuration in ENV file: ' + errorMessages;
};
export type IEnv = z.infer<typeof Env>;
