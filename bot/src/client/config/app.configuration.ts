import {
    ActivityType,
    type ClientOptions,
    GatewayIntentBits,
    Partials,
} from 'discord.js';

export default class AppConfiguration {
    public static readonly token: string = process.env.DISCORD_TOKEN;

    public static readonly clientOptions: ClientOptions = {
        intents: Object.values(GatewayIntentBits) as GatewayIntentBits[],
        partials: Object.values(Partials) as Partials[],
        allowedMentions: {
            repliedUser: false,
        },
        presence: {
            status: 'online',
            activities: [
                {
                    name: 'eturn, fresh start',
                    type: ActivityType.Custom,
                },
            ],
        },
    };

    public static readonly colors = {
        primary: 0xefcb68,
    };

    public static readonly emojis = {
        check: '<:check:1250906683321094195>',
        cross: '<:cross:1250906275068248168>',
        arrow: '<:arrow:1146054737804931153>',
        online: '<:online:1127259472440594432>',
        dnd: '<:dnd:1127259470527991818>',
        idle: '<:idle:1127259468703477841>',
        offline: '<:offline:1127259474525159475>',
        spotify: '<:spotify:1255898716309688441>',
    };

    public static readonly support: string = 'https://discord.gg/eturn';
}
