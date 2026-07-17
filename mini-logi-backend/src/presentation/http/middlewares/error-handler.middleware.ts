import { Prisma } from '@prisma/client';
import type { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../../../core/domain/errors/app-error.js';
import { logger } from '../../../infra/logging/logger.js';

export const errorHandler: ErrorRequestHandler = (
    error: unknown,
    request,
    response,
    _next,
) => {
    if (
        error instanceof SyntaxError &&
        'status' in error &&
        error.status === 400
    ) {
        response.status(400).json({
            error: {
                code: 'INVALID_JSON',
                message:
                    'The request body contains invalid JSON.',
            },
        });
        return;
    }

    if (error instanceof ZodError) {
        response.status(400).json({
            error: {
                code: 'VALIDATION_ERROR',
                message:
                    'The request contains invalid data.',
                details: error.issues.map((issue) => ({
                    path: issue.path.join('.'),
                    message: issue.message,
                    code: issue.code,
                })),
            },
        });
        return;
    }

    if (error instanceof AppError) {
        response.status(error.statusCode).json({
            error: {
                code: error.code,
                message: error.message,
            },
        });
        return;
    }

    if (
        error instanceof
        Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
    ) {
        response.status(409).json({
            error: {
                code: 'RESOURCE_CONFLICT',
                message:
                    'A resource with the provided unique data already exists.',
            },
        });
        return;
    }

    logger.error('Unhandled HTTP error', {
        method: request.method,
        path: request.path,
        error,
    });

    response.status(500).json({
        error: {
            code: 'INTERNAL_SERVER_ERROR',
            message:
                'An unexpected internal error occurred.',
        },
    });
};