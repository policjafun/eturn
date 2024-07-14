import {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    PermissionsBitField,
    Role,
    TextChannel,
    EmbedBuilder,
    PermissionFlagsBits,
} from 'discord.js';
import BaseCommand from '../../structures/baseCommand';
import baseEmbed from '../../utils/baseEmbed';

export default class ChannelCommand extends BaseCommand {
    constructor() {
        const builder = new SlashCommandBuilder();

        builder
            .setName('channel')
            .setDescription('Quickly manage channel permissions')
            .addSubcommand((subcommand) =>
                subcommand
                    .setName('lock')
                    .setDescription(
                        'Locks the channel for everyone or a specific role',
                    )
                    .addRoleOption((option) =>
                        option
                            .setName('role')
                            .setDescription('Role to lock the channel for'),
                    ),
            )
            .addSubcommand((subcommand) =>
                subcommand
                    .setName('unlock')
                    .setDescription(
                        'Unlocks the channel for everyone or a specific role',
                    )
                    .addRoleOption((option) =>
                        option
                            .setName('role')
                            .setDescription('Role to unlock the channel for'),
                    ),
            )
            .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels);

        super(builder);
    }

    async run(interaction: ChatInputCommandInteraction) {
        const subcommand = interaction.options.getSubcommand();

        const roleOption = interaction.options.getRole('role');
        const role = roleOption
            ? await interaction.guild!.roles.fetch(roleOption.id)
            : null;

        const channel = interaction.channel as TextChannel;

        await channel.permissionOverwrites
            .edit(role || channel.guild.roles.everyone, {
                SendMessages: subcommand === 'lock' ? false : null,
            })
            .catch(() => {
                interaction.reply({
                    embeds: [
                        baseEmbed(
                            'An error occurred while setting the slowmode, this can be caused by following:\n- Missing permissions\n- Invalid role\n- Discord API limitations',
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
            .setDescription('Channel permissions have been updated')
            .addFields([
                {
                    name: 'Summary',
                    value: `- Action: ${
                        subcommand.charAt(0).toUpperCase() + subcommand.slice(1)
                    }\n${role ? `- Role: ${role}` : ''}`,
                },
            ]);

        interaction.reply({
            embeds: [embed],
        });
    }
}
