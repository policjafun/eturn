import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChannelType,
    ChatInputCommandInteraction,
    EmbedBuilder,
    SlashCommandBuilder,
    TextChannel,
} from 'discord.js';
import BaseCommand from '../../structures/baseCommand';
import { version as discordjsVersion } from 'discord.js';
import { version as typescriptVersion } from 'typescript';
import baseEmbed from '../../utils/baseEmbed';

export default class InfoCommand extends BaseCommand {
    constructor() {
        const builder = new SlashCommandBuilder();

        builder
            .setName('info')
            .setDescription('Shows information')
            .addSubcommand((subcommand) =>
                subcommand
                    .setName('user')
                    .setDescription('Shows information about the user')
                    .addUserOption((option) =>
                        option
                            .setName('user')
                            .setDescription(
                                'The user to show information about',
                            ),
                    ),
            )
            .addSubcommand((subcommand) =>
                subcommand
                    .setName('server')
                    .setDescription('Shows information about the server'),
            )
            .addSubcommand((subcommand) =>
                subcommand
                    .setName('bot')
                    .setDescription('Shows information about the bot'),
            )
            .addSubcommand((subcommand) =>
                subcommand
                    .setName('role')
                    .setDescription('Shows information about the role')
                    .addRoleOption((option) =>
                        option
                            .setName('role')
                            .setDescription(
                                'The role to show information about',
                            )
                            .setRequired(true),
                    ),
            )
            .addSubcommand((subcommand) =>
                subcommand
                    .setName('channel')
                    .setDescription('Shows information about the channel')
                    .addChannelOption((option) =>
                        option
                            .setName('channel')
                            .setDescription(
                                'The channel to show information about',
                            )
                            .addChannelTypes(
                                ChannelType.GuildText,
                                ChannelType.GuildVoice,
                            ),
                    ),
            );

        super(builder);
    }

    async run(interaction: ChatInputCommandInteraction) {
        const subcommand = interaction.options.getSubcommand(true);

        switch (subcommand) {
            case 'user': {
                const user =
                    interaction.options.getUser('user', false) ||
                    interaction.user;

                const joinPosition = Array.from(
                    interaction.guild?.members.cache.values()!,
                )
                    .sort((a, b) => a.joinedTimestamp! - b.joinedTimestamp!)
                    .findIndex((member) => member.id === user.id);

                const embed = new EmbedBuilder()
                    .setColor(this.client.config.colors.primary)
                    .setAuthor({
                        name: `${user.displayName} (@${user.username})`,
                        iconURL: user.avatarURL()!,
                    })
                    .setDescription(
                        `- ID${this.client.config.emojis.arrow}${
                            user.id
                        }\n- Created at${
                            this.client.config.emojis.arrow
                        }<t:${Math.floor(
                            user.createdTimestamp / 1000,
                        )}:R>\n- Is bot${this.client.config.emojis.arrow}${
                            user.bot
                                ? this.client.config.emojis.check
                                : this.client.config.emojis.cross
                        }`,
                    )
                    .setThumbnail(user.avatarURL()!);

                const member = await interaction.guild?.members
                    .fetch(user.id)
                    .catch(() => null);

                if (member) {
                    const roles = member.roles.cache
                        .filter((role) => role.name !== '@everyone')
                        .sort((a, b) => b.position - a.position)
                        .map((role) => role.toString());
                    const rolesToShow = roles.slice(0, 2);
                    const rolesOverflow = roles.length - rolesToShow.length;
                    const rolesString = rolesToShow.join(', ');
                    const rolesOverflowString =
                        rolesOverflow > 0 ? ` **(+${rolesOverflow})**` : '';

                    embed.addFields([
                        {
                            name: 'Member',
                            value: `- Nickname${
                                this.client.config.emojis.arrow
                            }${
                                member.nickname || 'No nickname set'
                            }\n- Joined at${
                                this.client.config.emojis.arrow
                            }<t:${Math.floor(
                                member.joinedTimestamp! / 1000,
                            )}:R>\n- Join position${
                                this.client.config.emojis.arrow
                            }${joinPosition + 1} of ${
                                interaction.guild?.memberCount
                            }`,
                        },
                        {
                            name: 'Roles',
                            value: `- ${rolesString}${rolesOverflowString}`,
                        },
                    ]);
                }

                if (user.banner) {
                    embed.setImage(user.bannerURL()!);
                }

                const row = new ActionRowBuilder<ButtonBuilder>();

                if (user.avatar) {
                    row.addComponents(
                        new ButtonBuilder()
                            .setStyle(ButtonStyle.Link)
                            .setLabel('Avatar')
                            .setURL(
                                user.avatarURL({
                                    size: 4096,
                                })!,
                            ),
                    );
                }

                if (user.banner) {
                    row.addComponents(
                        new ButtonBuilder()
                            .setStyle(ButtonStyle.Link)
                            .setLabel('Banner')
                            .setURL(
                                user.bannerURL({
                                    size: 4096,
                                })!,
                            ),
                    );
                }

                row.addComponents(
                    new ButtonBuilder()
                        .setStyle(ButtonStyle.Link)
                        .setLabel('Profile')
                        .setURL(`https://discord.com/users/${user.id}`),
                );

                interaction.reply({
                    embeds: [embed],
                    components: [row],
                });

                break;
            }

            case 'server': {
                const guild = interaction.guild!;

                await interaction.deferReply();

                await guild.members.fetch({
                    withPresences: true,
                });

                const embed = new EmbedBuilder()
                    .setColor(this.client.config.colors.primary)
                    .setAuthor({
                        name: guild.name,
                        iconURL: guild.iconURL()!,
                    })
                    .setDescription(
                        `- ID${this.client.config.emojis.arrow}${
                            guild.id
                        }\n- Created at${
                            this.client.config.emojis.arrow
                        }<t:${Math.floor(
                            guild.createdTimestamp / 1000,
                        )}:R>\n- Owner${this.client.config.emojis.arrow}<@${
                            guild.ownerId
                        }> (${guild.ownerId})`,
                    )
                    .setThumbnail(guild.iconURL()!)
                    .addFields([
                        {
                            name: 'Statistics',
                            value: `- Member count${this.client.config.emojis.arrow}${guild.memberCount}\n- Roles${this.client.config.emojis.arrow}${guild.roles.cache.size}\n- Channels${this.client.config.emojis.arrow}${guild.channels.cache.size}`,
                        },
                        {
                            name: 'Status distribution',
                            value: `- ${this.client.config.emojis.online} ${
                                guild.members.cache.filter(
                                    (member) =>
                                        member.presence?.status === 'online',
                                ).size
                            } ** ** ${this.client.config.emojis.idle} ${
                                guild.members.cache.filter(
                                    (member) =>
                                        member.presence?.status === 'idle',
                                ).size
                            } ** ** ${this.client.config.emojis.dnd} ${
                                guild.members.cache.filter(
                                    (member) =>
                                        member.presence?.status === 'dnd',
                                ).size
                            } ** ** ${this.client.config.emojis.offline} ${
                                guild.members.cache.filter(
                                    (member) =>
                                        member.presence?.status === 'offline' ||
                                        member.presence?.status === 'invisible',
                                ).size
                            }`,
                        },
                    ]);

                if (guild.banner) {
                    embed.setImage(guild.bannerURL()!);
                }

                const row = new ActionRowBuilder<ButtonBuilder>();

                if (guild.icon) {
                    row.addComponents(
                        new ButtonBuilder()
                            .setStyle(ButtonStyle.Link)
                            .setLabel('Icon')
                            .setURL(
                                guild.iconURL({
                                    size: 4096,
                                })!,
                            ),
                    );
                }

                if (guild.banner) {
                    row.addComponents(
                        new ButtonBuilder()
                            .setStyle(ButtonStyle.Link)
                            .setLabel('Banner')
                            .setURL(
                                guild.bannerURL({
                                    size: 4096,
                                })!,
                            ),
                    );
                }

                interaction.followUp({
                    embeds: [embed],
                    components: [row],
                });

                break;
            }

            case 'bot': {
                const embed = new EmbedBuilder()
                    .setColor(this.client.config.colors.primary)
                    .setAuthor({
                        name: this.client.user!.username,
                        iconURL: this.client.user!.avatarURL()!,
                    })
                    .setDescription(
                        `- Existing since${
                            this.client.config.emojis.arrow
                        }<t:${Math.floor(
                            this.client.user!.createdTimestamp / 1000,
                        )}:R>\n- Version${this.client.config.emojis.arrow}${
                            this.client.version
                        }`,
                    )
                    .addFields([
                        {
                            name: 'System',
                            value: `- Memory usage${
                                this.client.config.emojis.arrow
                            }${Math.round(
                                process.memoryUsage().heapUsed / 1024 / 1024,
                            )} MB\n- Uptime${
                                this.client.config.emojis.arrow
                            }<t:${
                                Math.floor(Date.now() / 1000) -
                                Math.floor(process.uptime())
                            }:R>\n- Ping${this.client.config.emojis.arrow}${
                                this.client.ws.ping === -1
                                    ? 'N/a'
                                    : `${this.client.ws.ping} ms`
                            }`,
                        },
                        {
                            name: 'Statistics',
                            value: `- Guilds${this.client.config.emojis.arrow}${
                                this.client.guilds.cache.size
                            }\n- Users${
                                this.client.config.emojis.arrow
                            }${this.client.guilds.cache.reduce(
                                (acc, guild) => acc + guild.memberCount,
                                0,
                            )}\n- Commands${this.client.config.emojis.arrow}${
                                this.client.commands.size
                            }`,
                        },
                    ])
                    .setThumbnail(this.client.user!.avatarURL()!);

                const packagesEmbed = new EmbedBuilder()
                    .setColor(this.client.config.colors.primary)
                    .setAuthor({
                        name: this.client.user!.username,
                        iconURL: this.client.user!.avatarURL()!,
                    })
                    .setDescription(
                        `\`\`\`bf\neturn@ /home/eturn ${this.client.version}\n├─ Bun@${Bun.version}\n├─ TypeScript@${typescriptVersion}\n└─ Discord.js@${discordjsVersion}\n\`\`\``,
                    )
                    .addFields([
                        {
                            name: 'References',
                            value: '- [Bun](https://bun.sh/)\n- [TypeScript](https://www.typescriptlang.org/)\n- [Discord.js](https://discord.js.org/)',
                        },
                    ])
                    .setThumbnail(this.client.user!.avatarURL()!);

                const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
                    new ButtonBuilder()
                        .setStyle(ButtonStyle.Link)
                        .setLabel('eturn.app')
                        .setURL('https://eturn.app/'),
                    new ButtonBuilder()
                        .setStyle(ButtonStyle.Primary)
                        .setLabel('Packages used to build eturn')
                        .setCustomId('packages'),
                );

                const packagesRow =
                    new ActionRowBuilder<ButtonBuilder>().addComponents(
                        new ButtonBuilder()
                            .setStyle(ButtonStyle.Link)
                            .setLabel('eturn.app')
                            .setURL('https://eturn.app/'),
                        new ButtonBuilder()
                            .setStyle(ButtonStyle.Primary)
                            .setLabel('Go back')
                            .setCustomId('bot'),
                    );

                await interaction
                    .reply({
                        embeds: [embed],
                        components: [row],
                    })
                    .then(async (msg) => {
                        const collector = msg.createMessageComponentCollector({
                            time: 180000, // 3 minutes
                        });

                        collector.on('collect', async (i) => {
                            if (i.user.id !== interaction.user.id)
                                i.deferUpdate();

                            if (i.customId === 'packages') {
                                await i.update({
                                    embeds: [packagesEmbed],
                                    components: [packagesRow],
                                });
                            } else if (i.customId === 'bot') {
                                await i.update({
                                    embeds: [embed],
                                    components: [row],
                                });
                            }
                        });

                        collector.on('end', async () => {
                            await msg
                                .edit({
                                    components: [
                                        row.setComponents(
                                            row.components.map((component) => {
                                                return component.setDisabled(
                                                    true,
                                                );
                                            }),
                                        ),
                                    ],
                                    embeds: [embed],
                                })
                                .catch(() => null);
                        });
                    });

                break;
            }

            case 'role': {
                const roleOption = interaction.options.getRole('role', true);
                const role = await interaction.guild?.roles
                    .fetch(roleOption.id)
                    .catch(() => null);

                if (!role) {
                    return interaction.reply({
                        embeds: [
                            baseEmbed('The role could not be found.', {
                                author: interaction.user,
                            }),
                        ],
                        ephemeral: true,
                    });
                }

                const embed = new EmbedBuilder()
                    .setColor(this.client.config.colors.primary)
                    .setAuthor({
                        name: role.name,
                        iconURL:
                            role.iconURL() ||
                            'https://cdn3.emoji.gg/emojis/2305-discord-mention.png',
                    })
                    .setDescription(
                        `- ID${this.client.config.emojis.arrow}${
                            role.id
                        }\n- Color${this.client.config.emojis.arrow}${
                            role.color.toString(16) === '0'
                                ? 'None'
                                : `#${role.color.toString(16).toUpperCase()}`
                        }\n- Position${this.client.config.emojis.arrow}${
                            role.position
                        } of ${
                            (interaction.guild?.roles.cache.size || 1) - 1
                        }\n- Created at${this.client.config.emojis.arrow}${
                            role.createdTimestamp
                                ? '<t:' +
                                  Math.floor(role.createdTimestamp / 1000) +
                                  ':R>'
                                : 'N/a'
                        }`,
                    )
                    .addFields([
                        {
                            name: 'Role settings',
                            value: `- Hoisted${
                                this.client.config.emojis.arrow
                            }${
                                role.hoist
                                    ? this.client.config.emojis.check
                                    : this.client.config.emojis.cross
                            }\n- Mentionable${this.client.config.emojis.arrow}${
                                role.mentionable
                                    ? this.client.config.emojis.check
                                    : this.client.config.emojis.cross
                            }`,
                        },
                    ]);

                if (role.icon) {
                    embed.setThumbnail(role.iconURL()!);
                }

                interaction.reply({
                    embeds: [embed],
                });

                break;
            }

            case 'channel': {
                const channelOption =
                    interaction.options.getChannel('channel', false) ||
                    interaction.channel;

                if (!channelOption) {
                    return interaction.reply({
                        embeds: [
                            baseEmbed('The channel could not be found.', {
                                author: interaction.user,
                            }),
                        ],
                        ephemeral: true,
                    });
                }

                const channel = await interaction.guild?.channels
                    .fetch(channelOption.id)
                    .catch(() => null);

                if (!channel) {
                    return interaction.reply({
                        embeds: [
                            baseEmbed('The channel could not be found.', {
                                author: interaction.user,
                            }),
                        ],
                        ephemeral: true,
                    });
                }

                const channelIcons = {
                    text: 'https://cdn3.emoji.gg/emojis/6139-channel-text.png',
                    voice: 'https://cdn3.emoji.gg/emojis/6322-channel-voice.png',
                };

                const textChannelTypes = [
                    ChannelType.GuildAnnouncement,
                    ChannelType.GuildForum,
                    ChannelType.GuildDirectory,
                    ChannelType.GuildCategory,
                    ChannelType.GuildText,
                    ChannelType.GuildMedia,
                ];

                const embed = new EmbedBuilder()
                    .setColor(this.client.config.colors.primary)
                    .setAuthor({
                        name: channel.name,
                        iconURL: textChannelTypes.includes(channel.type)
                            ? channelIcons.text
                            : channelIcons.voice,
                    })
                    .setDescription(
                        `- ID${this.client.config.emojis.arrow}${
                            channel.id
                        }\n- Type${this.client.config.emojis.arrow}${
                            textChannelTypes.includes(channel.type)
                                ? 'Text'
                                : 'Voice'
                        }\n- Created at${this.client.config.emojis.arrow}${
                            channel.createdTimestamp
                                ? '<t:' +
                                  Math.floor(channel.createdTimestamp / 1000) +
                                  ':R>'
                                : 'N/a'
                        }`,
                    )
                    .addFields([
                        {
                            name: 'Channel settings',
                            value: `- Rate limit${
                                this.client.config.emojis.arrow
                            }${
                                channel.isTextBased()
                                    ? channel.rateLimitPerUser
                                        ? `${channel.rateLimitPerUser}s`
                                        : 'None'
                                    : 'N/a'
                            }\n- Topic${this.client.config.emojis.arrow}${
                                channel.isTextBased()
                                    ? (channel as TextChannel).topic || 'None'
                                    : 'N/a'
                            }`,
                        },
                    ]);

                interaction.reply({
                    embeds: [embed],
                });

                break;
            }
        }
    }
}
