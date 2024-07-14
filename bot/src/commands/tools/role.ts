import {
    ChatInputCommandInteraction,
    EmbedBuilder,
    SlashCommandBuilder,
    PermissionFlagsBits,
    Role,
} from 'discord.js';
import BaseCommand from '../../structures/baseCommand';
import baseEmbed from '../../utils/baseEmbed';

export default class RoleCommand extends BaseCommand {
    constructor() {
        const builder = new SlashCommandBuilder();

        builder
            .setName('role')
            .setDescription('Manage roles')
            .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
            .addSubcommand((subcommand) =>
                subcommand
                    .setName('add')
                    .setDescription('Add a role to a user')
                    .addUserOption((option) =>
                        option
                            .setName('user')
                            .setDescription('The user to add the role to')
                            .setRequired(true),
                    )
                    .addRoleOption((option) =>
                        option
                            .setName('role')
                            .setDescription('The role to add to the user')
                            .setRequired(true),
                    )
                    .addStringOption((option) =>
                        option
                            .setName('reason')
                            .setDescription('The reason for adding the role'),
                    ),
            )
            .addSubcommand((subcommand) =>
                subcommand
                    .setName('remove')
                    .setDescription('Remove a role from a user')
                    .addUserOption((option) =>
                        option
                            .setName('user')
                            .setDescription('The user to remove the role from')
                            .setRequired(true),
                    )
                    .addRoleOption((option) =>
                        option
                            .setName('role')
                            .setDescription('The role to remove from the user')
                            .setRequired(true),
                    )
                    .addStringOption((option) =>
                        option
                            .setName('reason')
                            .setDescription('The reason for removing the role'),
                    ),
            );

        super(builder);
    }

    async run(interaction: ChatInputCommandInteraction) {
        const subcommand = interaction.options.getSubcommand();

        const user = interaction.options.getUser('user')!;
        const role = interaction.options.getRole('role')! as Role;

        const reason =
            interaction.options.getString('reason', false) ||
            'No reason provided';

        const member = interaction.guild?.members.cache.get(user.id);

        if (!member) {
            return interaction.reply({
                embeds: [
                    baseEmbed(`User ${user} is not a member of this server.`, {
                        author: interaction.user,
                    }),
                ],
                ephemeral: true,
            });
        }

        if (!interaction.guild?.members.me?.permissions.has('ManageRoles')) {
            return interaction.reply({
                embeds: [
                    baseEmbed('I do not have permission to manage roles.', {
                        author: interaction.user,
                    }),
                ],
                ephemeral: true,
            });
        }

        switch (subcommand) {
            case 'add': {
                if (member?.roles.cache.has(role.id)) {
                    return interaction.reply({
                        embeds: [
                            baseEmbed(
                                `User ${user} already has the role ${role}.`,
                                {
                                    author: interaction.user,
                                },
                            ),
                        ],
                        ephemeral: true,
                    });
                }

                try {
                    await member.roles.add(role, reason);
                } catch (error) {
                    interaction.reply({
                        embeds: [
                            baseEmbed(
                                `An error occurred while assigning the role to user ${user}. This might be caused by incorrect permissions or the role hierarchy.`,
                                {
                                    author: interaction.user,
                                },
                            ),
                        ],
                        ephemeral: true,
                    });
                    return;
                }

                const embed = new EmbedBuilder()
                    .setColor(this.client.config.colors.primary)
                    .setAuthor({
                        name: interaction.user.username,
                        iconURL: interaction.user.avatarURL()!,
                    })
                    .setDescription(
                        `Successfully assigned a role to user ${user}!`,
                    )
                    .addFields({
                        name: 'Summary',
                        value: `- Role${this.client.config.emojis.arrow}${role}\n- Reason${this.client.config.emojis.arrow}${reason}`,
                    });

                interaction.reply({ embeds: [embed] });
                break;
            }

            case 'remove': {
                if (!member.roles.cache.has(role.id)) {
                    return interaction.reply({
                        embeds: [
                            baseEmbed(
                                `User ${user} does not have the role ${role}.`,
                                {
                                    author: interaction.user,
                                },
                            ),
                        ],
                        ephemeral: true,
                    });
                }

                try {
                    await member.roles.remove(role, reason);
                } catch (error) {
                    interaction.reply({
                        embeds: [
                            baseEmbed(
                                `An error occurred while removing the role from user ${user}. This might be caused by incorrect permissions or the role hierarchy.`,
                                {
                                    author: interaction.user,
                                },
                            ),
                        ],
                        ephemeral: true,
                    });
                    return;
                }

                const embed = new EmbedBuilder()
                    .setColor(this.client.config.colors.primary)
                    .setAuthor({
                        name: interaction.user.username,
                        iconURL: interaction.user.avatarURL()!,
                    })
                    .setDescription(
                        `Successfully removed a role from user ${user}!`,
                    )
                    .addFields({
                        name: 'Summary',
                        value: `- Role${this.client.config.emojis.arrow}${role}\n- Reason${this.client.config.emojis.arrow}${reason}`,
                    });

                interaction.reply({ embeds: [embed] });
                break;
            }
        }
    }
}
