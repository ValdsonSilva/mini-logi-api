import {
    DeliveryStatus as PrismaDeliveryStatus,
    type Delivery as PrismaDelivery,
} from '@prisma/client';

import { Delivery } from '../../../../core/domain/entities/delivery.js';
import { DeliveryStatus } from '../../../../core/domain/enums/delivery-status.js';

export interface DeliveryPersistenceData {
    id: string;
    trackingCode: string;
    description: string;
    status: PrismaDeliveryStatus;
    origin: string;
    destination: string;
    latitude: number | null;
    longitude: number | null;
    driverId: string | null;
    createdAt: Date;
    updatedAt: Date;
}

export class PrismaDeliveryMapper {
    public static toDomain(raw: PrismaDelivery): Delivery {
        return Delivery.restore({
            id: raw.id,
            trackingCode: raw.trackingCode,
            description: raw.description,
            status: raw.status as DeliveryStatus,
            origin: raw.origin,
            destination: raw.destination,
            latitude: raw.latitude,
            longitude: raw.longitude,
            driverId: raw.driverId,
            createdAt: raw.createdAt,
            updatedAt: raw.updatedAt,
        });
    }

    public static toPersistence(
        delivery: Delivery,
    ): DeliveryPersistenceData {
        return {
            id: delivery.id,
            trackingCode: delivery.trackingCode,
            description: delivery.description,
            status: delivery.status as PrismaDeliveryStatus,
            origin: delivery.origin,
            destination: delivery.destination,
            latitude: delivery.latitude,
            longitude: delivery.longitude,
            driverId: delivery.driverId,
            createdAt: delivery.createdAt,
            updatedAt: delivery.updatedAt,
        };
    }
}