import { Client, Collection } from 'discord.js';
import AppConfiguration from './config/app.configuration';
import EnvironmentConfiguration from './config/environment.configuration';
import FeatureLoader from '../structures/featureLoader';
import { PrismaClient } from '@prisma/client';
import Logger from '../utils/logger';
import type BaseCommand from '../structures/baseCommand';

import { parseEnv } from '../schemas/env';
parseEnv(process.env);

export const database = new PrismaClient();

export default class CoreClient extends Client<boolean> {
    public readonly version = '1.0.0-b';

    public readonly database = database;
    public readonly config = AppConfiguration;
    public readonly env = EnvironmentConfiguration;

    public commands = new Collection<string, BaseCommand>();

    public logger = new Logger();

    constructor() {
        super(AppConfiguration.clientOptions);
    }

    public start() {
        new FeatureLoader();
        this.login(this.config.token).catch((err) => console.log(err));
    }
}
