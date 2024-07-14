import {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    TextChannel,
    EmbedBuilder,
    PermissionFlagsBits,
} from 'discord.js';
import BaseCommand from '../../structures/baseCommand';
import baseEmbed from '../../utils/baseEmbed';

export default class SlowmodeCommand extends BaseCommand {
    constructor() {
        const builder = new SlashCommandBuilder();

        builder
            .setName('slowmode')
            .setDescription('Sets the slowmode for the channel')
            .addStringOption((option) =>
                option
                    .setName('duration')
                    .setDescription(
                        'Slowmode duration, accepts seconds (s), minutes (m), and hours (h) as units',
                    )
                    .setRequired(true),
            )
            .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels);

        super(builder);
    }

    async run(interaction: ChatInputCommandInteraction) {
        const duration = interaction.options.getString('duration') || '0';
        const channel = interaction.channel as TextChannel;

        const timePattern = /^(\d+)(s|m|h)?$/;
        const match = duration.match(timePattern);

        if (!match) {
            interaction.reply({
                embeds: [
                    baseEmbed(
                        'Invalid duration format, re-check the command usage and try again.\n- Accepting only seconds (s), minutes (m), and hours (h) as units\n- Example: `1s`, `1m`, `1h`',
                        {
                            author: interaction.user,
                        },
                    ),
                ],
                ephemeral: true,
            });
            return;
        }

        const amount = parseInt(match[1], 10);
        const unit = match[2] || 's';

        let seconds = 0;

        switch (unit) {
            case 's':
                seconds = amount;
                break;
            case 'm':
                seconds = amount * 60;
                break;
            case 'h':
                seconds = amount * 3600;
                break;
            default:
                seconds = 0;
                break;
        }

        if (seconds > 21600) {
            interaction.reply({
                embeds: [
                    baseEmbed('Slowmode duration cannot exceed 6 hours.', {
                        author: interaction.user,
                    }),
                ],
                ephemeral: true,
            });
            return;
        }

        await channel.setRateLimitPerUser(seconds).catch(async () => {
            await interaction.reply({
                embeds: [
                    baseEmbed(
                        'An error occurred while setting the slowmode, this can be caused by following:\n- Missing permissions\n- Invalid duration\n- Internal error',
                        {
                            author: interaction.user,
                        },
                    ),
                ],
                ephemeral: true,
            });
        });

        const embed = new EmbedBuilder()
            .setColor(this.client.config.colors.primary)
            .setAuthor({
                name: interaction.user.username,
                iconURL: interaction.user.avatarURL()!,
            })
            .setDescription(`Slowmode has been successfully set.`)
            .addFields([
                {
                    name: 'Summary',
                    value: `- Slowmode${this.client.config.emojis.arrow}${seconds} seconds`,
                },
            ]);

        interaction.reply({
            embeds: [embed],
        });
    }
}
