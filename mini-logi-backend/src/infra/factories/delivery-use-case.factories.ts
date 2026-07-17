import { CreateDeliveryUseCase } from '../../core/application/use-cases/deliveries/create-delivery.use-case.js';

import { GetDeliveryByTrackingCodeUseCase } from '../../core/application/use-cases/deliveries/get-delivery-by-tracking-code.use-case.js';

import { ListDeliveriesUseCase } from '../../core/application/use-cases/deliveries/list-deliveries.use-case.js';

import { UpdateDeliveryStatusUseCase } from '../../core/application/use-cases/deliveries/update-delivery-status.use-case.js';

import {
    deliveryRepository,
    eventDispatcher,
    statusHistoryRepository,
    trackingCodeGenerator,
} from './dependencies.js';

export class CreateDeliveryUseCaseFactory {
    public static create(): CreateDeliveryUseCase {
        return new CreateDeliveryUseCase(
            deliveryRepository,
            trackingCodeGenerator,
        );
    }
}

export class ListDeliveriesUseCaseFactory {
    public static create(): ListDeliveriesUseCase {
        return new ListDeliveriesUseCase(
            deliveryRepository,
        );
    }
}

export class GetDeliveryByTrackingCodeUseCaseFactory {
    public static create(): GetDeliveryByTrackingCodeUseCase {
        return new GetDeliveryByTrackingCodeUseCase(
            deliveryRepository,
            statusHistoryRepository,
        );
    }
}

export class UpdateDeliveryStatusUseCaseFactory {
    public static create(): UpdateDeliveryStatusUseCase {
        return new UpdateDeliveryStatusUseCase(
            deliveryRepository,
            eventDispatcher,
        );
    }
}