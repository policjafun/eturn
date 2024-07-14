import BaseEvent from '../structures/baseEvent';

export default class BotConnectEvents extends BaseEvent {
    on_ready() {
        this.client.logger.log(
            `${this.client.user?.username} has connected to discord gateway`,
        );
    }
}
