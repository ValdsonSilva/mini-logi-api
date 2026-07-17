import { z } from 'zod';

const environmentSchema = z.object({
    NODE_ENV: z
        .enum([
            'development',
            'test',
            'production',
        ])
        .default('development'),

    PORT: z.coerce
        .number()
        .int()
        .min(1)
        .max(65535)
        .default(3333),

    DATABASE_URL: z.url(),

    CORS_ORIGIN: z
        .string()
        .trim()
        .default('*'),

    LOG_LEVEL: z
        .string()
        .trim()
        .default('info'),
});

export type Environment = z.infer<
    typeof environmentSchema
>;

export function loadEnvironment(): Environment {
    return environmentSchema.parse(process.env);
}