import type {
    NextFunction,
    Request,
    Response,
} from 'express';
import type { ZodType } from 'zod';

export function validateRequest(
    schema: ZodType<unknown>,
) {
    return (
        request: Request,
        response: Response,
        next: NextFunction,
    ): void => {
        const validatedInput = schema.parse({
            body: request.body as unknown,
            params: request.params,
            query: request.query,
        });

        response.locals.validatedInput =
            validatedInput;

        next();
    };
}