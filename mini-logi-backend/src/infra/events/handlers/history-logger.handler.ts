import type { EventHandler } from '../../../core/application/ports/events/event-dispatcher.js';
import type { StatusHistoryRepository } from '../../../core/application/ports/repositories/status-history-repository.js';
import { StatusHistory } from '../../../core/domain/entities/status-history.js';
import type { DeliveryStatusChangedEvent } from '../../../core/domain/events/delivery-status-changed.event.js';
import { logger } from '../../logging/logger.js';

export class HistoryLoggerHandler implements EventHandler<DeliveryStatusChangedEvent> {
    constructor(
        private readonly statusHistoryRepository:
            StatusHistoryRepository,
    ) { }

    public async handle(
        event: DeliveryStatusChangedEvent,
    ): Promise<void> {
        const history = StatusHistory.create({
            deliveryId: event.payload.deliveryId,
            status: event.payload.status,
            latitude: event.payload.latitude,
            longitude: event.payload.longitude,
            changedAt: event.occurredAt,
        });

        await this.statusHistoryRepository.create(
            history,
        );

        logger.info(
            'Delivery status history created',
            {
                eventName: event.name,
                deliveryId: event.payload.deliveryId,
                status: event.payload.status,
                historyId: history.id,
            },
        );
    }
}