import { z } from 'zod';

export const createDriverSchema = z.object({
    body: z.object({
        name: z.string().trim().min(2).max(120),
        licenseId: z
            .string()
            .trim()
            .min(3)
            .max(30),
    }),
    params: z.object({}),
    query: z.object({}),
});

export type CreateDriverRequest = z.infer<
    typeof createDriverSchema
>;