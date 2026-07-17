import type { Response } from 'express';

export interface ValidatedInput {
    body?: unknown;
    params?: unknown;
    query?: unknown;
}

export function getValidatedInput<T extends ValidatedInput>(
    response: Response,
): T {
    return response.locals.validatedInput as T;
}