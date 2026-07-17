import type { Delivery } from '../../../domain/entities/delivery.js';
import { DeliveryStatus } from '../../../domain/enums/delivery-status.js';
import { DeliveryStatusChangedEvent } from '../../../domain/events/delivery-status-changed.event.js';
import { NotFoundError } from '../../../domain/errors/not-found-error.js';
import type { EventDispatcher } from '../../ports/events/event-dispatcher.js';
import type { DeliveryRepository } from '../../ports/repositories/delivery-repository.js';

export interface UpdateDeliveryStatusInput {
    deliveryId: string;
    status: DeliveryStatus;
    latitude?: number | null;
    longitude?: number | null;
}

export class UpdateDeliveryStatusUseCase {
    constructor(
        private readonly deliveryRepository: DeliveryRepository,
        private readonly eventDispatcher: EventDispatcher,
    ) { }

    public async execute(
        input: UpdateDeliveryStatusInput,
    ): Promise<Delivery> {
        const delivery =
            await this.deliveryRepository.findById(input.deliveryId);

        if (!delivery) {
            throw new NotFoundError(
                'Delivery not found.',
                'DELIVERY_NOT_FOUND',
            );
        }

        const previousStatus = delivery.status;

        const changed = delivery.updateStatus(input.status, {
            ...(input.latitude !== undefined
                ? { latitude: input.latitude }
                : {}),
            ...(input.longitude !== undefined
                ? { longitude: input.longitude }
                : {}),
        });

        if (!changed) {
            return delivery;
        }

        await this.deliveryRepository.save(delivery);

        await this.eventDispatcher.dispatch(
            new DeliveryStatusChangedEvent({
                deliveryId: delivery.id,
                trackingCode: delivery.trackingCode,
                previousStatus,
                status: delivery.status,
                latitude: delivery.latitude,
                longitude: delivery.longitude,
            }),
        );

        return delivery;
    }
}