import { LogLevel } from '../utils/enums';

export class Logger {
    private static loglevel: LogLevel = LogLevel.INFO;

    static setLogLevel(level: LogLevel): void {
        this.loglevel = level;
    }

    private static getLogLevelEmoji(level: LogLevel): string {
        switch (level) {
            case LogLevel.INFO:
                return '✅';
            case LogLevel.DEBUG:
                return '🐞';
            case LogLevel.ERROR:
                return '❌';
            case LogLevel.WARN:
                return '⚠️';
            default:
                return '';
        }
    }

    private static getTimestamp(): string {
        const now = new Date();
        const hour = now.getHours().toString().padStart(2, '0');
        const mins = now.getMinutes().toString().padStart(2, '0');
        const secs = now.getSeconds().toString().padStart(2, '0');
        return `${hour}:${mins}:${secs}`;
    }

    static log(level: LogLevel, message: string): void {
        if (this.isLogLevelEnabled(level)) {
            const logLevelEmoji = this.getLogLevelEmoji(level);
            const timestamp = this.getTimestamp();
            console.log(
                `[${level.toUpperCase()}] ${logLevelEmoji} [${timestamp}] ${message}`,
            );
        }
    }

    private static isLogLevelEnabled(level: LogLevel): boolean {
        const levels = Object.values(LogLevel) as string[];
        const currentLevelIndex = levels.indexOf(this.loglevel);
        const requiredLevelIndex = levels.indexOf(level);
        return (
            requiredLevelIndex >= 0 && currentLevelIndex >= requiredLevelIndex
        );
    }

    static info(message: string): void {
        this.log(LogLevel.INFO, message);
    }
    static debug(message: string): void {
        this.log(LogLevel.DEBUG, message);
    }
    static warn(message: string): void {
        this.log(LogLevel.WARN, message);
    }
    static error(message: string): void {
        this.log(LogLevel.ERROR, message);
    }
}
