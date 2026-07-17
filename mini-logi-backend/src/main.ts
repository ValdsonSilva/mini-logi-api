import 'dotenv/config';
import type { Server } from 'node:http';
import { createApp } from './app.js';
import { loadEnvironment } from './config/environment.js';
import { prisma } from './infra/database/prisma/prisma-client.js';
import { logger } from './infra/logging/logger.js';

const environment = loadEnvironment();

const app = createApp({
    corsOrigin: environment.CORS_ORIGIN,
});

let server: Server | undefined;
let shuttingDown = false;

async function bootstrap(): Promise<void> {
    await prisma.$connect();

    server = app.listen(
        environment.PORT,
        () => {
            logger.info(
                'Mini-Logi API started',
                {
                    port: environment.PORT,
                    environment:
                        environment.NODE_ENV,
                    docs:
                        `http://localhost:${environment.PORT}/docs`,
                },
            );
        },
    );
}

async function shutdown(
    signal: NodeJS.Signals,
): Promise<void> {
    if (shuttingDown) {
        return;
    }

    shuttingDown = true;

    logger.info(
        'Graceful shutdown started',
        { signal },
    );

    const forceShutdownTimer = setTimeout(
        () => {
            logger.error(
                'Graceful shutdown timed out',
            );

            process.exit(1);
        },
        10_000,
    );

    forceShutdownTimer.unref();

    if (server) {
        await new Promise<void>(
            (resolve, reject) => {
                server?.close((error) => {
                    if (error) {
                        reject(error);
                        return;
                    }

                    resolve();
                });
            },
        );
    }

    await prisma.$disconnect();

    clearTimeout(forceShutdownTimer);

    logger.info(
        'Graceful shutdown completed',
    );
}

for (
    const signal of [
        'SIGINT',
        'SIGTERM',
    ] as const
) {
    process.on(signal, () => {
        void shutdown(signal)
            .then(() => process.exit(0))
            .catch((error: unknown) => {
                logger.error(
                    'Graceful shutdown failed',
                    { error },
                );

                process.exit(1);
            });
    });
}

bootstrap().catch(
    async (error: unknown) => {
        logger.error(
            'Mini-Logi API failed to start',
            { error },
        );

        await prisma.$disconnect();

        process.exit(1);
    },
);