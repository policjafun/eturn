import {
    ChatInputCommandInteraction,
    EmbedBuilder,
    SlashCommandBuilder,
} from 'discord.js';
import BaseCommand from '../../structures/baseCommand';

export default class HelpCommand extends BaseCommand {
    constructor() {
        super(
            new SlashCommandBuilder()
                .setName('help')
                .setDescription('Get help with eturn'),
        );
    }

    async run(interaction: ChatInputCommandInteraction) {
        const embed = new EmbedBuilder()
            .setColor(this.client.config.colors.primary)
            .setAuthor({
                name: interaction.user.username,
                iconURL: interaction.user.avatarURL()!,
            })
            .setTitle('eturn — Next generation of Discord bots')

            .setDescription(
                'Looking for help? [eturn.app](https://eturn.app) is the place to go!\n\n— Command list\n— Documentation\n— Status page\n\nIf you want further help, feel free to join our [support server](https://eturn.app/support)',
            );

        interaction.reply({
            embeds: [embed],
        });
    }
}
