import {
    ActionRowBuilder,
    AttachmentBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChannelType,
    ChatInputCommandInteraction,
    ComponentType,
    EmbedBuilder,
    SlashCommandBuilder,
    TextChannel,
} from 'discord.js';
import BaseCommand from '../../structures/baseCommand';
import baseEmbed from '../../utils/baseEmbed';

export default class ArchiveCommand extends BaseCommand {
    constructor() {
        const slashCommandBuilder = new SlashCommandBuilder();

        slashCommandBuilder
            .setName('archive')
            .setDescription('Archive messages from a channel')
            .addChannelOption((option) =>
                option
                    .setName('channel')
                    .setDescription('The channel to archive messages from')
                    .setRequired(true)
                    .addChannelTypes(
                        ChannelType.GuildText,
                        ChannelType.GuildAnnouncement,
                    ),
            )
            .addNumberOption((option) =>
                option
                    .setName('limit')
                    .setDescription('The number of messages to archive')
                    .setMaxValue(100)
                    .setMinValue(1),
            );

        super(slashCommandBuilder);
    }

    async run(interaction: ChatInputCommandInteraction) {
        const channelOption = interaction.options.getChannel('channel', true);
        const channel = (await interaction.guild?.channels
            .fetch(channelOption.id)
            .catch(() => null)) as TextChannel;

        if (!channel) {
            return interaction.reply({
                embeds: [
                    baseEmbed('Channel not found.', {
                        author: interaction.user,
                    }),
                ],
                ephemeral: true,
            });
        }

        await interaction.deferReply();

        const messages = await channel.messages.fetch({
            limit: interaction.options.getNumber('limit') || 100,
        });
        const messagesArray = messages.toJSON();

        const formattedMessages = messagesArray
            .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
            .map((message) => {
                return `[${message.createdAt.toISOString()}] ${
                    message.author.username
                }: ${message.content || 'No content'}`;
            })
            .join('\n');

        const attachment = new AttachmentBuilder(
            Buffer.from(formattedMessages),
        ).setName(`${channel.name}-archive.txt`);

        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
                .setCustomId('download')
                .setLabel('Download')
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId('self-destruct')
                .setLabel('Delete this message')
                .setStyle(ButtonStyle.Danger),
        );

        await interaction
            .followUp({
                embeds: [
                    new EmbedBuilder()
                        .setColor(this.client.config.colors.primary)
                        .setAuthor({
                            name: interaction.user.username,
                            iconURL: interaction.user.avatarURL()!,
                        })
                        .setDescription(`Successfully archived messages.`)
                        .addFields([
                            {
                                name: 'Summary',
                                value: `- Channel${this.client.config.emojis.arrow}${channel}\n- Messages${this.client.config.emojis.arrow}${messages.size}`,
                            },
                        ]),
                ],
                components: [row],
            })
            .then((message) => {
                const collector = message.createMessageComponentCollector({
                    componentType: ComponentType.Button,
                    time: 12000, // 2 minutes
                });

                collector.on('collect', async (buttonInteraction) => {
                    if (buttonInteraction.customId === 'download') {
                        await buttonInteraction.reply({
                            files: [attachment],
                            ephemeral: true,
                        });
                    }

                    if (buttonInteraction.customId === 'self-destruct') {
                        if (interaction.user.id !== buttonInteraction.user.id) {
                            await buttonInteraction.deferUpdate();
                        } else {
                            await message.delete();
                        }
                    }
                });

                collector.on('end', async () => {
                    await message
                        .edit({
                            components: [
                                row.setComponents(
                                    row.components.map((component) => {
                                        return component.setDisabled(true);
                                    }),
                                ),
                            ],
                        })
                        .catch(() => null);
                });
            });
    }
}
