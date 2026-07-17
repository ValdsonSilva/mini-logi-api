import { Delivery } from '../../../domain/entities/delivery.js';
import { AppError } from '../../../domain/errors/app-error.js';
import type { DeliveryRepository } from '../../ports/repositories/delivery-repository.js';
import type { TrackingCodeGenerator } from '../../ports/services/tracking-code-generator.js';

export interface CreateDeliveryInput {
    description: string;
    origin: string;
    destination: string;
    driverId?: string | null;
}

export class CreateDeliveryUseCase {
    private static readonly maximumTrackingCodeAttempts = 10;

    constructor(
        private readonly deliveryRepository: DeliveryRepository,
        private readonly trackingCodeGenerator: TrackingCodeGenerator,
    ) { }

    public async execute(input: CreateDeliveryInput): Promise<Delivery> {
        const trackingCode = await this.generateUniqueTrackingCode();

        const delivery = Delivery.create({
            trackingCode,
            description: input.description,
            origin: input.origin,
            destination: input.destination,
            ...(input.driverId !== undefined
                ? { driverId: input.driverId }
                : {}),
        });

        await this.deliveryRepository.create(delivery);

        return delivery;
    }

    private async generateUniqueTrackingCode(): Promise<string> {
        for (
            let attempt = 0;
            attempt < CreateDeliveryUseCase.maximumTrackingCodeAttempts;
            attempt += 1
        ) {
            const trackingCode = this.trackingCodeGenerator.generate();

            const alreadyExists =
                await this.deliveryRepository.existsByTrackingCode(trackingCode);

            if (!alreadyExists) {
                return trackingCode;
            }
        }

        throw new AppError(
            'Unable to generate a unique tracking code.',
            500,
            'TRACKING_CODE_GENERATION_FAILED',
        );
    }
}