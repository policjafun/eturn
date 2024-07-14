import chalk from 'chalk';

type LogType = 'info' | 'warn' | 'error' | 'debug';

export default class Logger {
    private debugEnabled: boolean;

    constructor() {
        this.debugEnabled = process.env.BUN_ENV !== 'production';
    }

    private getTime(): string {
        return chalk.gray(new Date().toLocaleTimeString());
    }

    private formatType(logType: LogType): string {
        const logTypes: Record<LogType, string> = {
            info: chalk.bold.blue('INFO'),
            warn: chalk.bold.yellow('WARN'),
            error: chalk.bold.red('ERROR'),
            debug: chalk.bold.magenta('DEBUG'),
        };
        return logTypes[logType];
    }

    private logMessage(
        logType: LogType,
        content: string,
        rightPadding = 1,
    ): void {
        const typeWithPadding = `${this.formatType(logType)}${' '.repeat(
            rightPadding,
        )}`;
        console.log(`${this.getTime()} ${typeWithPadding} ${content}`);
    }

    public log(content: string): void {
        this.logMessage('info', content, 2);
    }

    public warn(content: string): void {
        this.logMessage('warn', content, 2);
    }

    public error(content: string): void {
        this.logMessage('error', content);
    }

    public debug(content: string): void {
        if (this.debugEnabled) {
            this.logMessage('debug', content);
        }
    }
}
