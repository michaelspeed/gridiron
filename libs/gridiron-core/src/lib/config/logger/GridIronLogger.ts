import {LoggerService} from '@nestjs/common';

export enum LogLevel {
    Error,
    Warn,
    Info,
    Verbose,
    Debug
}

export interface GridIronLogger {
    error(message: string, context?: string, trace?: string): void;
    warn(message: string, context?: string): void;
    info(message: string, context?: string): void;
    verbose(message: string, context?: string): void;
    debug(message: string, context?: string): void;
}

const noopLogger: GridIronLogger = {
    error() { /* */ },
    warn() { /* */ },
    info() { /* */ },
    verbose() { /* */ },
    debug() { /* */ },
};

export class Logger implements LoggerService {
    private static _instance: typeof Logger = Logger;
    private static _logger: GridIronLogger;

    static get logger(): GridIronLogger {
        return this._logger || noopLogger;
    }

    private get instance(): typeof Logger {
        const { _instance } = Logger;
        return _instance;
    }

    /** @internal */
    static useLogger(logger: GridIronLogger) {
        Logger._logger = logger;
    }

    /** @internal */
    error(message: any, trace?: string, context?: string): any {
        this.instance.error(message, context, trace);
    }

    /** @internal */
    warn(message: any, context?: string): any {
        this.instance.warn(message, context);
    }

    /** @internal */
    log(message: any, context?: string): any {
        this.instance.info(message, context);
    }

    /** @internal */
    verbose(message: any, context?: string): any {
        this.instance.verbose(message, context);
    }

    /** @internal */
    debug(message: any, context?: string): any {
        this.instance.debug(message, context);
    }

    static error(message: string, context?: string, trace?: string): void {
        Logger.logger.error(message, context, trace);
    }

    static warn(message: string, context?: string): void {
        Logger.logger.warn(message, context);
    }

    static info(message: string, context?: string): void {
        Logger.logger.info(message, context);
    }

    static verbose(message: string, context?: string): void {
        Logger.logger.verbose(message, context);
    }

    static debug(message: string, context?: string): void {
        Logger.logger.debug(message, context);
    }
}
