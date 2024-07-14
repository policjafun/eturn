import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { client } from '../main';

export default class BaseCommand {
    public data: SlashCommandBuilder;

    public constructor(data: SlashCommandBuilder) {
        this.data = data;
    }

    public client = client;

    public async run(interaction: ChatInputCommandInteraction): Promise<any> {
        throw new Error(
            `Command ${this.data.name} doesn't provide a run method.`,
        );
    }
}
