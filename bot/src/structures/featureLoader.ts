import { readdirSync, statSync } from 'fs';
import path from 'path';
import { client } from '../main';
import type BaseCommand from './baseCommand';

export default class FeatureLoader {
    constructor() {
        this.loadEvents();
        this.loadCommands();
    }

    private findEventFiles() {
        const eventFiles: string[] = [];
        const files = readdirSync(path.join(__dirname, '../events'));

        for (const file of files) {
            if (
                statSync(
                    path.join(__dirname, `../events/${file}`),
                ).isDirectory()
            ) {
                const nestedFiles = readdirSync(
                    path.join(__dirname, `../events/${file}`),
                ).filter((f) => f.endsWith('.ts'));
                for (const nestedFile of nestedFiles) {
                    eventFiles.push(`${file}/${nestedFile}`);
                }
            } else {
                eventFiles.push(file);
            }
        }

        return eventFiles;
    }

    private async loadEvents() {
        const eventFiles = this.findEventFiles();

        for (const file of eventFiles) {
            const event = await import(`../events/${file}`);
            new event.default();
        }
    }

    private findCommandFiles() {
        const commandFiles: string[] = [];
        const categories = readdirSync(path.join(__dirname, '../commands'));

        for (const category of categories) {
            const files = readdirSync(
                path.join(__dirname, `../commands/${category}`),
            ).filter((file) => file.endsWith('.ts'));
            for (const file of files) {
                commandFiles.push(`${category}/${file}`);
            }
        }

        return commandFiles;
    }

    private async loadCommands() {
        const commandFiles = this.findCommandFiles();

        for (const file of commandFiles) {
            const Command = (await import(`../commands/${file}`)).default;
            const commandInstance = new Command() as BaseCommand;
            const commandCategory = (file as string).split('/')[0];

            const commandData = {
                ...commandInstance.data,
                category: commandCategory,
            };

            // commandInstance.data = commandData;

            client.commands.set(commandInstance.data.name, commandInstance);
        }

        client.on('ready', () => {
            client.application?.commands.set(
                client.commands.map((c) => c.data),
            );
        });
    }

    public async reloadAll() {
        client.commands.clear();
        this.loadCommands();

        client.removeAllListeners();
        this.loadEvents();
    }
}
