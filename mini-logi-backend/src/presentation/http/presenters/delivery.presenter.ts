import type { Delivery } from '../../../core/domain/entities/delivery.js';
import type { StatusHistory } from '../../../core/domain/entities/status-history.js';

export class DeliveryPresenter {
    public static toHTTP(delivery: Delivery) {
        return {
            id: delivery.id,
            trackingCode: delivery.trackingCode,
            description: delivery.description,
            status: delivery.status,
            origin: delivery.origin,
            destination: delivery.destination,
            latitude: delivery.latitude,
            longitude: delivery.longitude,
            driverId: delivery.driverId,
            createdAt:
                delivery.createdAt.toISOString(),
            updatedAt:
                delivery.updatedAt.toISOString(),
        };
    }

    public static historyToHTTP(
        history: StatusHistory,
    ) {
        return {
            id: history.id,
            status: history.status,
            latitude: history.latitude,
            longitude: history.longitude,
            changedAt:
                history.changedAt.toISOString(),
        };
    }
}