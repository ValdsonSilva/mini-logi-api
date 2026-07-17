import { DeliveryStatus } from '../../src/core/domain/enums/delivery-status.js';
import { DeliveryStatusChangedEvent } from '../../src/core/domain/events/delivery-status-changed.event.js';
import { HistoryLoggerHandler } from '../../src/infra/events/handlers/history-logger.handler.js';
import { InMemoryStatusHistoryRepository } from '../doubles/in-memory-status-history-repository.js';

describe('HistoryLoggerHandler', () => {
    it('creates history from DeliveryStatusChanged', async () => {
        const repository =
            new InMemoryStatusHistoryRepository();

        const handler =
            new HistoryLoggerHandler(repository);

        const occurredAt = new Date(
            '2026-07-17T12:00:00.000Z',
        );

        await handler.handle(
            new DeliveryStatusChangedEvent(
                {
                    deliveryId: 'delivery-id',
                    trackingCode: 'TEST1234',
                    previousStatus:
                        DeliveryStatus.PENDING,
                    status:
                        DeliveryStatus.DELIVERING,
                    latitude: -3.7319,
                    longitude: -38.5267,
                },
                occurredAt,
            ),
        );

        expect(repository.items).toHaveLength(1);

        expect(repository.items[0]).toMatchObject({
            deliveryId: 'delivery-id',
            status: DeliveryStatus.DELIVERING,
            latitude: -3.7319,
            longitude: -38.5267,
            changedAt: occurredAt,
        });
    });
});