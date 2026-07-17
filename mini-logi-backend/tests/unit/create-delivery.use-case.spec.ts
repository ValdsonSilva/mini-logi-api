import { CreateDeliveryUseCase } from '../../src/core/application/use-cases/deliveries/create-delivery.use-case.js';
import { Delivery } from '../../src/core/domain/entities/delivery.js';
import { DeliveryStatus } from '../../src/core/domain/enums/delivery-status.js';
import { FixedTrackingCodeGenerator } from '../doubles/fixed-tracking-code-generator.js';
import { InMemoryDeliveryRepository } from '../doubles/in-memory-delivery-repository.js';

describe('CreateDeliveryUseCase', () => {
    it('creates a pending delivery with an eight-character tracking code', async () => {
        const repository = new InMemoryDeliveryRepository();

        const trackingCodeGenerator =
            new FixedTrackingCodeGenerator(['ABCD1234']);

        const useCase = new CreateDeliveryUseCase(
            repository,
            trackingCodeGenerator,
        );

        const delivery = await useCase.execute({
            description: 'Electronics package',
            origin: 'Fortaleza, CE',
            destination: 'Campina Grande, PB',
        });

        expect(delivery.status).toBe(DeliveryStatus.PENDING);
        expect(delivery.trackingCode).toBe('ABCD1234');
        expect(repository.items).toHaveLength(1);
        expect(repository.items[0]).toBe(delivery);
    });

    it('retries when a generated tracking code already exists', async () => {
        const repository = new InMemoryDeliveryRepository();

        repository.items.push(
            Delivery.create({
                trackingCode: 'DUPL1234',
                description: 'Existing package',
                origin: 'Origin A',
                destination: 'Destination A',
            }),
        );

        const trackingCodeGenerator =
            new FixedTrackingCodeGenerator([
                'DUPL1234',
                'NEWC5678',
            ]);

        const useCase = new CreateDeliveryUseCase(
            repository,
            trackingCodeGenerator,
        );

        const delivery = await useCase.execute({
            description: 'New package',
            origin: 'Origin B',
            destination: 'Destination B',
        });

        expect(delivery.trackingCode).toBe('NEWC5678');
        expect(repository.items).toHaveLength(2);
    });
});