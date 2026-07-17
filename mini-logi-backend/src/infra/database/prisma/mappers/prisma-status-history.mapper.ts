import {
    DeliveryStatus as PrismaDeliveryStatus,
    type StatusHistory as PrismaStatusHistory,
} from '@prisma/client';

import { StatusHistory } from '../../../../core/domain/entities/status-history.js';
import { DeliveryStatus } from '../../../../core/domain/enums/delivery-status.js';

export interface StatusHistoryPersistenceData {
    id: string;
    deliveryId: string;
    status: PrismaDeliveryStatus;
    latitude: number | null;
    longitude: number | null;
    changedAt: Date;
}

export class PrismaStatusHistoryMapper {
    public static toDomain(
        raw: PrismaStatusHistory,
    ): StatusHistory {
        return StatusHistory.restore({
            id: raw.id,
            deliveryId: raw.deliveryId,
            status: raw.status as DeliveryStatus,
            latitude: raw.latitude,
            longitude: raw.longitude,
            changedAt: raw.changedAt,
        });
    }

    public static toPersistence(
        history: StatusHistory,
    ): StatusHistoryPersistenceData {
        return {
            id: history.id,
            deliveryId: history.deliveryId,
            status: history.status as PrismaDeliveryStatus,
            latitude: history.latitude,
            longitude: history.longitude,
            changedAt: history.changedAt,
        };
    }
}