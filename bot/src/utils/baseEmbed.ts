import { EmbedBuilder, type User } from 'discord.js';
import { client } from '../main';

export interface IBaseEmbedOptionsCustomProperties {
    color?: number;
    footer?: {
        text: string;
        iconURL?: string;
    };
    thumbnail?: string;
    image?: string;
}

export interface IBaseEmbedOptions {
    author: User;
    customProperties?: IBaseEmbedOptionsCustomProperties;
}

export default function baseEmbed(message: string, options: IBaseEmbedOptions) {
    const embed = new EmbedBuilder()
        .setColor(
            options.customProperties?.color || client.config.colors.primary,
        )
        .setDescription(message)
        .setAuthor({
            name: options.author.username,
            iconURL: options.author.displayAvatarURL(),
            url: `https://discord.com/users/${options.author.id}`,
        });

    if (options.customProperties?.footer) {
        embed.setFooter({
            text: options.customProperties.footer.text,
            iconURL: options.customProperties.footer.iconURL,
        });
    }

    if (options.customProperties?.thumbnail) {
        embed.setThumbnail(options.customProperties.thumbnail);
    }

    if (options.customProperties?.image) {
        embed.setImage(options.customProperties.image);
    }

    return embed;
}
