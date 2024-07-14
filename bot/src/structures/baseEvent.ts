import { type ClientEvents } from 'discord.js';
import { client } from '../main';

type EventMethod<T extends keyof ClientEvents> = (
    ...args: ClientEvents[T]
) => void;

export default class BaseEvent {
    protected client = client;

    constructor() {
        const proto = Object.getPrototypeOf(this) as Record<
            string,
            EventMethod<keyof ClientEvents>
        >;

        Object.getOwnPropertyNames(proto).forEach((key) => {
            const method = proto[key] as EventMethod<keyof ClientEvents>;

            if (
                typeof method === 'function' &&
                (key.startsWith('on_') || key.startsWith('once_'))
            ) {
                const eventName = key.slice(3) as keyof ClientEvents;
                const startsWith = key.startsWith('on_') ? 'on' : 'once';

                this.client[startsWith](eventName, (...args) =>
                    method.apply(this, args),
                );
            }
        });
    }
}
