import { BaseInteraction, type CacheType } from 'discord.js';
import BaseEvent from '../../structures/baseEvent';

export default class CommandRunEvent extends BaseEvent {
    async on_interactionCreate(interaction: BaseInteraction<CacheType>) {
        if (!interaction.isChatInputCommand()) return;
        if (!interaction.guildId) return;
        if (!this.client.commands.has(interaction.commandName)) return;

        try {
            await this.client.commands
                .get(interaction.commandName)
                ?.run(interaction);
        } catch (error) {
            // TODO: Add error handling
            // This is temporary error logging, later on i will add a proper error handling
            this.client.logger.error(error as string);
        }
    }
}
