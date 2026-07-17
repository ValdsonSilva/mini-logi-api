import type { Delivery } from '../../../domain/entities/delivery.js';
import type { StatusHistory } from '../../../domain/entities/status-history.js';
import { NotFoundError } from '../../../domain/errors/not-found-error.js';
import type { DeliveryRepository } from '../../ports/repositories/delivery-repository.js';
import type { StatusHistoryRepository } from '../../ports/repositories/status-history-repository.js';

export interface DeliveryDetails {
    delivery: Delivery;
    statusHistory: StatusHistory[];
}

export class GetDeliveryByTrackingCodeUseCase {
    constructor(
        private readonly deliveryRepository: DeliveryRepository,
        private readonly statusHistoryRepository: StatusHistoryRepository,
    ) { }

    public async execute(trackingCode: string): Promise<DeliveryDetails> {
        const normalizedTrackingCode = trackingCode.trim().toUpperCase();

        const delivery =
            await this.deliveryRepository.findByTrackingCode(
                normalizedTrackingCode,
            );

        if (!delivery) {
            throw new NotFoundError(
                'Delivery not found.',
                'DELIVERY_NOT_FOUND',
            );
        }

        const statusHistory =
            await this.statusHistoryRepository.findByDeliveryId(delivery.id);

        return {
            delivery,
            statusHistory,
        };
    }
}