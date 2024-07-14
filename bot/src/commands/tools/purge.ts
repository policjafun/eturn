import {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    EmbedBuilder,
    TextChannel,
    PermissionFlagsBits,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    Collection,
} from 'discord.js';
import BaseCommand from '../../structures/baseCommand';
import baseEmbed from '../../utils/baseEmbed';

export default class ClearCommand extends BaseCommand {
    constructor() {
        const builder = new SlashCommandBuilder();

        builder
            .setName('purge')
            .setDescription('Purge messages from the channel')
            .addIntegerOption((option) =>
                option
                    .setName('amount')
                    .setDescription('The number of messages to delete')
                    .setRequired(true)
                    .setMinValue(1)
                    .setMaxValue(100),
            )
            .addUserOption((option) =>
                option
                    .setName('user')
                    .setDescription('Filter messages by user')
                    .setRequired(false),
            )
            .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages);

        super(builder);
    }

    async run(interaction: ChatInputCommandInteraction) {
        const amount = interaction.options.getInteger('amount', true);
        const user = interaction.options.getUser('user', false);
        const channel = interaction.channel as TextChannel;

        const messages = await channel.messages.fetch({
            limit: user ? 100 : amount,
        });

        if (!messages || messages.size === 0) {
            return await interaction.reply({
                embeds: [
                    baseEmbed(
                        "No messages found, this might be caused because of discord's limitations. If the issue persists, please contact us.",
                        {
                            author: interaction.user,
                        },
                    ),
                ],
                ephemeral: true,
            });
        }

        const messagesToDelete = user
            ? messages.filter((msg) => msg.author.id === user.id).first(amount)
            : messages;

        if ((messagesToDelete as Collection<string, any>).size === 0) {
            return await interaction.reply({
                embeds: [
                    baseEmbed(
                        user
                            ? 'No messages found from that user'
                            : 'No messages found',
                        {
                            author: interaction.user,
                        },
                    ),
                ],
                ephemeral: true,
            });
        }

        const deletedMessages = await channel
            .bulkDelete(messagesToDelete, true)
            .catch((e) => {
                console.error(e);
                return null;
            });

        if (!deletedMessages) {
            return await interaction.reply({
                embeds: [
                    baseEmbed(
                        'An error occurred while trying to delete the messages. This might be problem on our end, in case of persisting issues, please contact us.',
                        {
                            author: interaction.user,
                        },
                    ),
                ],
                ephemeral: true,
            });
        }

        if (deletedMessages.size === 0) {
            return await interaction.reply({
                embeds: [
                    baseEmbed(
                        "No messages were deleted, this might be caused because of discord's limitations. If the issue persists, please contact us.",
                        {
                            author: interaction.user,
                        },
                    ),
                ],
                ephemeral: true,
            });
        }

        const embed = new EmbedBuilder()
            .setColor(this.client.config.colors.primary)
            .setAuthor({
                name: interaction.user.username,
                iconURL: interaction.user.avatarURL()!,
            })
            .setDescription(`Successfully purged current channel.`)
            .addFields([
                {
                    name: 'Summary',
                    value: `- Requested to delete${
                        this.client.config.emojis.arrow
                    }${amount} messages\n- Deleted${
                        this.client.config.emojis.arrow
                    }${deletedMessages.size} messages${
                        user
                            ? `\n- Filtered by${this.client.config.emojis.arrow}${user}`
                            : ''
                    }`,
                },
            ]);

        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
                .setCustomId('self-destruct')
                .setLabel('Delete this message')
                .setStyle(ButtonStyle.Danger),
        );

        await interaction
            .reply({
                embeds: [embed],
                components: [row],
            })
            .then((msg) => {
                const filter = (interaction: any) =>
                    interaction.customId === 'self-destruct' &&
                    interaction.user.id === interaction.user.id;

                const collector = msg.createMessageComponentCollector({
                    filter,
                    time: 30000,
                });

                collector.on('collect', async () => {
                    await msg.delete();
                });

                collector.on('end', async () => {
                    await msg
                        .edit({
                            components: [],
                        })
                        .catch(() => null);
                });
            });
    }
}
