import type { EventHandler } from '../../../core/application/ports/events/event-dispatcher.js';
import type { DeliveryStatusChangedEvent } from '../../../core/domain/events/delivery-status-changed.event.js';
import { logger } from '../../logging/logger.js';

export class NotificationHandler
    implements EventHandler<DeliveryStatusChangedEvent> {
    public handle(
        event: DeliveryStatusChangedEvent,
    ): Promise<void> {
        logger.info(
            'Delivery status notification simulated',
            {
                eventName: event.name,
                deliveryId:
                    event.payload.deliveryId,
                trackingCode:
                    event.payload.trackingCode,
                previousStatus:
                    event.payload.previousStatus,
                status: event.payload.status,
            },
        );

        return Promise.resolve();
    }
}