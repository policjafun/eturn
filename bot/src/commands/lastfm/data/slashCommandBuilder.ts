import { SlashCommandBuilder } from 'discord.js';

export const slashCommandBuilder = new SlashCommandBuilder();

slashCommandBuilder
    .setName('lastfm')
    .setDescription('...')
    .addSubcommand((subcommand) =>
        subcommand
            .setName('set')
            .setDescription('Set your Last.fm username')
            .addStringOption((option) =>
                option
                    .setName('username')
                    .setDescription('Your Last.fm username')
                    .setRequired(true),
            ),
    )
    .addSubcommand((subcommand) =>
        subcommand
            .setName('nowplaying')
            .setDescription('Get the currently playing song of a user')
            .addUserOption((option) =>
                option
                    .setName('user')
                    .setDescription(
                        'The user to get the currently playing song of',
                    ),
            ),
    )
    .addSubcommand((subcommand) =>
        subcommand
            .setName('playcount')
            .setDescription('Get the playcount of a user')
            .addUserOption((option) =>
                option
                    .setName('user')
                    .setDescription('The user to get the playcount of'),
            )
            .addStringOption((option) =>
                option
                    .setName('timeframe')
                    .setDescription('The timeframe to get the playcount of')
                    .addChoices(
                        { name: 'Overall', value: 'overall' },
                        { name: '24 hours', value: '24hour' },
                        { name: '7 days', value: '7day' },
                        { name: '1 month', value: '1month' },
                        { name: '3 months', value: '3month' },
                    ),
            )
            .addStringOption((option) =>
                option
                    .setName('author')
                    .setDescription('The author of the playcount'),
            )
            .addStringOption((option) =>
                option
                    .setName('track')
                    .setDescription('The track to get the playcount of'),
            ),
    )
    .addSubcommand((subcommand) =>
        subcommand
            .setName('cover')
            .setDescription('Get the cover of a track')
            .addStringOption((option) =>
                option
                    .setName('track')
                    .setDescription('The track to get the cover of'),
            ),
    )
    .addSubcommand((subcommand) =>
        subcommand
            .setName('privacy')
            .setDescription('Change your privacy settings')
            .addStringOption((option) =>
                option
                    .setName('setting')
                    .setDescription('The setting to change')
                    .addChoices(
                        {
                            name: 'Profile: Private',
                            value: 'hide_username',
                        },
                        {
                            name: 'Profile: Public',
                            value: 'show_username',
                        },
                    ),
            ),
    )
    .addSubcommandGroup((subcommandGroup) =>
        subcommandGroup
            .setName('top')
            .setDescription('Get the top tracks, albums, or artists of a user')
            .addSubcommand((subcommand) =>
                subcommand
                    .setName('tracks')
                    .setDescription('Get the top tracks of a user')
                    .addUserOption((option) =>
                        option
                            .setName('user')
                            .setDescription(
                                'The user to get the top tracks of',
                            ),
                    )
                    .addStringOption((option) =>
                        option
                            .setName('timeframe')
                            .setDescription(
                                'The timeframe to get the top tracks of',
                            )
                            .addChoices(
                                { name: 'Overall', value: 'overall' },
                                { name: '7 days', value: '7day' },
                                { name: '1 month', value: '1month' },
                                { name: '3 months', value: '3month' },
                                { name: '6 months', value: '6month' },
                                { name: '12 months', value: '12month' },
                            ),
                    ),
            )
            .addSubcommand((subcommand) =>
                subcommand
                    .setName('albums')
                    .setDescription('Get the top albums of a user')
                    .addUserOption((option) =>
                        option
                            .setName('user')
                            .setDescription(
                                'The user to get the top albums of',
                            ),
                    )
                    .addStringOption((option) =>
                        option
                            .setName('timeframe')
                            .setDescription(
                                'The timeframe to get the top albums of',
                            )
                            .addChoices(
                                { name: 'Overall', value: 'overall' },
                                { name: '7 days', value: '7day' },
                                { name: '1 month', value: '1month' },
                                { name: '3 months', value: '3month' },
                                { name: '6 months', value: '6month' },
                                { name: '12 months', value: '12month' },
                            ),
                    ),
            )
            .addSubcommand((subcommand) =>
                subcommand
                    .setName('artists')
                    .setDescription('Get the top artists of a user')
                    .addUserOption((option) =>
                        option
                            .setName('user')
                            .setDescription(
                                'The user to get the top artists of',
                            ),
                    )
                    .addStringOption((option) =>
                        option
                            .setName('timeframe')
                            .setDescription(
                                'The timeframe to get the top artists of',
                            )
                            .addChoices(
                                { name: 'Overall', value: 'overall' },
                                { name: '7 days', value: '7day' },
                                { name: '1 month', value: '1month' },
                                { name: '3 months', value: '3month' },
                                { name: '6 months', value: '6month' },
                                { name: '12 months', value: '12month' },
                            ),
                    ),
            ),
    );
