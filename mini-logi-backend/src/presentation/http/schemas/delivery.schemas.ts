import { z } from 'zod';
import { DeliveryStatus } from '../../../core/domain/enums/delivery-status.js';

const trackingCode = z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^[A-Z0-9]{8}$/);

export const createDeliverySchema = z.object({
    body: z.object({
        description: z
            .string()
            .trim()
            .min(1)
            .max(500),
        origin: z.string().trim().min(1).max(255),
        destination: z
            .string()
            .trim()
            .min(1)
            .max(255),
        driverId: z.uuid().nullable().optional(),
    }),
    params: z.object({}),
    query: z.object({}),
});

export const listDeliveriesSchema = z.object({
    body: z.unknown().optional(),
    params: z.object({}),
    query: z.object({
        page: z.coerce
            .number()
            .int()
            .positive()
            .default(1),
        limit: z.coerce
            .number()
            .int()
            .min(1)
            .max(100)
            .default(20),
    }),
});

export const getDeliveryByTrackingCodeSchema =
    z.object({
        body: z.unknown().optional(),
        params: z.object({
            trackingCode,
        }),
        query: z.object({}),
    });

export const updateDeliveryStatusSchema =
    z.object({
        body: z.object({
            status: z.enum(DeliveryStatus),
            latitude: z
                .number()
                .min(-90)
                .max(90)
                .nullable()
                .optional(),
            longitude: z
                .number()
                .min(-180)
                .max(180)
                .nullable()
                .optional(),
        }),
        params: z.object({
            id: z.uuid(),
        }),
        query: z.object({}),
    });

export type CreateDeliveryRequest = z.infer<
    typeof createDeliverySchema
>;

export type ListDeliveriesRequest = z.infer<
    typeof listDeliveriesSchema
>;

export type GetDeliveryByTrackingCodeRequest =
    z.infer<
        typeof getDeliveryByTrackingCodeSchema
    >;

export type UpdateDeliveryStatusRequest = z.infer<
    typeof updateDeliveryStatusSchema
>;