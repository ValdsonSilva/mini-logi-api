import winston from 'winston';

// singleton pattern - para garantir que apenas uma instância do logger seja criada e usada em toda a aplicação
export class Logger {
    private static instance: | winston.Logger | undefined;

    private constructor() { }

    public static getInstance(): winston.Logger {
        if (!Logger.instance) {
            Logger.instance = winston.createLogger({
                level: process.env.LOG_LEVEL ?? 'info',
                format: winston.format.combine(
                    winston.format.timestamp(),
                    winston.format.errors({
                        stack: true,
                    }),
                    winston.format.json(),
                ),
                defaultMeta: {
                    service: 'mini-logi-api',
                },
                transports: [
                    new winston.transports.Console({
                        silent:
                            process.env.NODE_ENV === 'test',
                    }),
                ],
                exitOnError: false,
            });
        }

        return Logger.instance;
    }
}

export const logger = Logger.getInstance();