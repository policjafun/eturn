import {
    ActionRowBuilder,
    AttachmentBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChatInputCommandInteraction,
    EmbedBuilder,
} from 'discord.js';
import BaseCommand from '../../structures/baseCommand';
import baseEmbed from '../../utils/baseEmbed';
import { slashCommandBuilder } from './data/slashCommandBuilder';
import {
    getRecentTracks,
    getUserInfo,
    type ILastFMError,
    type ILastFMTrack,
} from '../../utils/lastfm';
import { searchSpotifyTrack, type ISpotifyTrack } from '../../utils/spotify';
import axios from 'axios';

export default class LastfmCommand extends BaseCommand {
    constructor() {
        super(slashCommandBuilder);
    }

    async getLastfmByUsername(username: string) {
        const existingUsername =
            await this.client.database.lastfmUser.findFirst({
                where: {
                    username,
                },
            });

        return existingUsername;
    }

    async getLastfmByUserId(userId: string) {
        const existingUsername =
            await this.client.database.lastfmUser.findFirst({
                where: {
                    userId,
                },
            });

        return existingUsername;
    }

    async run(interaction: ChatInputCommandInteraction) {
        const subcommand = interaction.options.getSubcommand();
        const subcomamndGroup = interaction.options.getSubcommandGroup();

        switch (subcomamndGroup) {
            case 'top': {
                break;
            }

            default: {
                switch (subcommand) {
                    case 'set': {
                        const existingUsername = await this.getLastfmByUsername(
                            interaction.options.getString('username')!,
                        );

                        if (existingUsername) {
                            return interaction.reply({
                                embeds: [
                                    baseEmbed(
                                        'This Last.fm username is already set for another user.\n- If you believe this is a mistake, please contact us.',
                                        {
                                            author: interaction.user,
                                        },
                                    ),
                                ],
                            });
                        }

                        await this.client.database.lastfmUser.create({
                            data: {
                                userId: interaction.user.id,
                                username:
                                    interaction.options.getString('username')!,
                            },
                        });

                        interaction.reply({
                            embeds: [
                                baseEmbed(
                                    'Last.fm username has been set successfully.',
                                    {
                                        author: interaction.user,
                                    },
                                ),
                            ],
                        });

                        break;
                    }

                    case 'nowplaying': {
                        const user =
                            interaction.options.getUser('user') ||
                            interaction.user;

                        const lastfmUser = await this.getLastfmByUserId(
                            user.id,
                        );

                        if (!lastfmUser) {
                            return interaction.reply({
                                embeds: [
                                    baseEmbed(
                                        'This user does not have a Last.fm username set.',
                                        {
                                            author: interaction.user,
                                        },
                                    ),
                                ],
                            });
                        }

                        const recentTracks = await getRecentTracks(
                            lastfmUser.username,
                            {
                                limit: 1,
                            },
                        );

                        if ('error' in recentTracks) {
                            const error = recentTracks as ILastFMError;

                            return interaction.reply({
                                embeds: [
                                    baseEmbed(
                                        `An error occurred while fetching the recent tracks\n- This might be caused by incorrect username\n- Last.fm API issues`,
                                        {
                                            author: interaction.user,
                                        },
                                    ),
                                ],
                            });
                        }

                        const track = recentTracks[0] as ILastFMTrack;

                        const lastfmAccount = await getUserInfo(
                            lastfmUser.username,
                        );

                        if ('error' in lastfmAccount) {
                            return interaction.reply({
                                embeds: [
                                    baseEmbed(
                                        `An error occurred while fetching the user info\n- This might be caused by incorrect username\n- Last.fm API issues`,
                                        {
                                            author: interaction.user,
                                        },
                                    ),
                                ],
                            });
                        }

                        const embed = new EmbedBuilder()
                            .setColor(this.client.config.colors.primary)
                            .setAuthor({
                                name: lastfmAccount.name,
                                iconURL: lastfmAccount.image.find(
                                    (image) => image.size === 'large',
                                )?.['#text'],
                                url: lastfmAccount.url,
                            })
                            .setDescription(`## [${track.name}](${track.url})`)
                            .addFields([
                                {
                                    name: 'Artist',
                                    value: `${track.artist.name}`,
                                    inline: true,
                                },
                                {
                                    name: 'Album',
                                    value: `${track.album['#text']}`,
                                    inline: true,
                                },
                            ])
                            .setFooter({
                                text: `Scrobbles: ${lastfmAccount.playcount} • via Last.fm`,
                            })
                            .setThumbnail(
                                track.image.find(
                                    (image) => image.size === 'large',
                                )?.['#text']!,
                            );

                        const spotifyData = await searchSpotifyTrack(
                            `${track.artist.name} ${track.name}`,
                        );

                        if ('error' in spotifyData) {
                            return interaction.reply({
                                embeds: [
                                    baseEmbed(
                                        `An error occurred while searching for the track on Spotify`,
                                        {
                                            author: interaction.user,
                                        },
                                    ),
                                ],
                            });
                        }

                        const spotifyTrack = spotifyData as ISpotifyTrack;

                        const row =
                            new ActionRowBuilder<ButtonBuilder>().addComponents(
                                new ButtonBuilder()
                                    .setLabel('Play on Spotify')
                                    .setStyle(ButtonStyle.Link)
                                    .setURL(spotifyTrack.external_urls.spotify)
                                    .setEmoji(
                                        this.client.config.emojis.spotify,
                                    ),
                            );

                        interaction.reply({
                            embeds: [embed],
                            components: [row],
                        });

                        break;
                    }

                    case 'playcount': {
                        const user =
                            interaction.options.getUser('user') ||
                            interaction.user;

                        const timeframe = interaction.options.getString(
                            'timeframe',
                            false,
                        );

                        const author = interaction.options.getString(
                            'author',
                            false,
                        );

                        const track = interaction.options.getString(
                            'track',
                            false,
                        );

                        const lastfmUser = await this.getLastfmByUserId(user.id);

                        if (!lastfmUser) {
                            return interaction.reply({
                                embeds: [
                                    baseEmbed(
                                        'This user does not have a Last.fm username set.',
                                        {
                                            author: interaction.user,
                                        }
                                    ),
                                ],
                            });
                        }

                        const lastfmAccount = await getUserInfo(
                            lastfmUser.username,
                        );

                        if ('error' in lastfmAccount) {
                            return interaction.reply({
                                embeds: [
                                    baseEmbed(
                                        `An error occurred while fetching the user info\n- This might be caused by incorrect username\n- Last.fm API issues`,
                                        {
                                            author: interaction.user,
                                        },
                                    ),
                                ],
                            });
                        }

                        const playcount = lastfmAccount.playcount;

                        break;
                    }

                    case 'cover': {
                        await interaction.deferReply();

                        const trackOption = interaction.options.getString(
                            'track',
                            false,
                        );

                        let track = trackOption;

                        if (!trackOption) {
                            const user = interaction.user;

                            const lastfmUser = await this.getLastfmByUserId(
                                user.id,
                            );

                            if (!lastfmUser) {
                                return interaction.followUp({
                                    embeds: [
                                        baseEmbed(
                                            'This user does not have a Last.fm username set.',
                                            {
                                                author: interaction.user,
                                            },
                                        ),
                                    ],
                                });
                            }

                            const recentTracks = await getRecentTracks(
                                lastfmUser.username,
                                {
                                    limit: 1,
                                },
                            );

                            if ('error' in recentTracks) {
                                return interaction.followUp({
                                    embeds: [
                                        baseEmbed(
                                            `An error occurred while fetching the recent tracks\n- This might be caused by incorrect username\n- Last.fm API issues`,
                                            {
                                                author: interaction.user,
                                            },
                                        ),
                                    ],
                                });
                            }

                            const recentTrack = recentTracks[0] as ILastFMTrack;

                            track = `${recentTrack.artist.name} ${recentTrack.name}`;
                        }

                        const spotifyData = await searchSpotifyTrack(track!);

                        if ('error' in spotifyData) {
                            return interaction.followUp({
                                embeds: [
                                    baseEmbed(
                                        `An error occurred while searching for the track on Spotify`,
                                        {
                                            author: interaction.user,
                                        },
                                    ),
                                ],
                            });
                        }

                        const spotifyTrack = spotifyData as ISpotifyTrack;

                        const image = spotifyTrack.album.images[0].url;

                        const buffer = await axios.get(image, {
                            responseType: 'arraybuffer',
                        });

                        const attachment = new AttachmentBuilder(buffer.data)
                            .setName('cover.png')
                            .setDescription('Spotify Album Cover');

                        interaction.followUp({
                            files: [attachment],
                        });

                        break;
                    }

                    case 'privacy': {
                        break;
                    }

                    default: {
                        break;
                    }
                }
            }
        }
    }
}
