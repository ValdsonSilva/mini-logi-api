import { UpdateDeliveryStatusUseCase } from '../../src/core/application/use-cases/deliveries/update-delivery-status.use-case.js';
import { Delivery } from '../../src/core/domain/entities/delivery.js';
import { DeliveryStatus } from '../../src/core/domain/enums/delivery-status.js';
import { DeliveryStatusChangedEvent } from '../../src/core/domain/events/delivery-status-changed.event.js';
import { InMemoryDeliveryRepository } from '../doubles/in-memory-delivery-repository.js';
import { InMemoryEventDispatcher } from '../doubles/in-memory-event-dispatcher.js';

describe('UpdateDeliveryStatusUseCase', () => {
    it('updates the delivery and dispatches DeliveryStatusChanged', async () => {
        const repository = new InMemoryDeliveryRepository();
        const eventDispatcher = new InMemoryEventDispatcher();

        const delivery = Delivery.create({
            trackingCode: 'TEST1234',
            description: 'Test package',
            origin: 'Origin',
            destination: 'Destination',
        });

        repository.items.push(delivery);

        const useCase = new UpdateDeliveryStatusUseCase(
            repository,
            eventDispatcher,
        );

        const updatedDelivery = await useCase.execute({
            deliveryId: delivery.id,
            status: DeliveryStatus.DELIVERING,
            latitude: -3.7319,
            longitude: -38.5267,
        });

        expect(updatedDelivery.status).toBe(
            DeliveryStatus.DELIVERING,
        );

        expect(updatedDelivery.latitude).toBe(-3.7319);
        expect(updatedDelivery.longitude).toBe(-38.5267);
        expect(eventDispatcher.events).toHaveLength(1);

        const event = eventDispatcher.events[0];

        expect(event).toBeInstanceOf(DeliveryStatusChangedEvent);
        expect(event?.name).toBe(
            DeliveryStatusChangedEvent.eventName,
        );

        expect(event?.payload).toEqual({
            deliveryId: delivery.id,
            trackingCode: 'TEST1234',
            previousStatus: DeliveryStatus.PENDING,
            status: DeliveryStatus.DELIVERING,
            latitude: -3.7319,
            longitude: -38.5267,
        });
    });

    it('does not persist or dispatch when there is no change', async () => {
        const repository = new InMemoryDeliveryRepository();
        const eventDispatcher = new InMemoryEventDispatcher();

        const delivery = Delivery.create({
            trackingCode: 'SAME1234',
            description: 'Test package',
            origin: 'Origin',
            destination: 'Destination',
        });

        repository.items.push(delivery);

        const useCase = new UpdateDeliveryStatusUseCase(
            repository,
            eventDispatcher,
        );

        await useCase.execute({
            deliveryId: delivery.id,
            status: DeliveryStatus.PENDING,
        });

        expect(eventDispatcher.events).toHaveLength(0);
    });
});