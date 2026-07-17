import cors from 'cors';
import express, {
    type Express,
} from 'express';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import { errorHandler } from './presentation/http/middlewares/error-handler.middleware.js';
import { notFoundHandler } from './presentation/http/middlewares/not-found.middleware.js';
import { apiRoutes } from './presentation/http/routes/index.js';
import { swaggerDocument } from './presentation/http/swagger/swagger.js';

export interface CreateAppOptions {
    corsOrigin?: string;
}

export function createApp(
    options: CreateAppOptions = {},
): Express {
    const app = express();

    const corsOrigin = options.corsOrigin ?? '*';

    app.disable('x-powered-by');
    app.set('trust proxy', 1);

    app.use(helmet());

    app.use(
        cors({
            origin:
                corsOrigin === '*'
                    ? '*'
                    : corsOrigin
                        .split(',')
                        .map((origin) =>
                            origin.trim(),
                        ),
        }),
    );

    app.use(
        express.json({
            limit: '1mb',
        }),
    );

    app.get('/health', (_request, response) => {
        response.status(200).json({
            status: 'ok',
            timestamp: new Date().toISOString(),
        });
    });

    app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument),);

    app.use('/api/v1', apiRoutes);

    app.use(notFoundHandler);
    app.use(errorHandler);

    return app;
}