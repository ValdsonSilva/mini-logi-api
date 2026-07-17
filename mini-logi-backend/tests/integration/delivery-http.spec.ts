import express from 'express';
import request from 'supertest';
import { CreateDeliveryUseCase } from '../../src/core/application/use-cases/deliveries/create-delivery.use-case.js';
import { GetDeliveryByTrackingCodeUseCase } from '../../src/core/application/use-cases/deliveries/get-delivery-by-tracking-code.use-case.js';
import { ListDeliveriesUseCase } from '../../src/core/application/use-cases/deliveries/list-deliveries.use-case.js';
import { UpdateDeliveryStatusUseCase } from '../../src/core/application/use-cases/deliveries/update-delivery-status.use-case.js';
import { DeliveryStatus } from '../../src/core/domain/enums/delivery-status.js';
import { DeliveryController } from '../../src/presentation/http/controllers/delivery.controller.js';
import { errorHandler } from '../../src/presentation/http/middlewares/error-handler.middleware.js';
import { validateRequest } from '../../src/presentation/http/middlewares/validate-request.middleware.js';
import {
    createDeliverySchema,
    getDeliveryByTrackingCodeSchema,
    listDeliveriesSchema,
    updateDeliveryStatusSchema,
} from '../../src/presentation/http/schemas/delivery.schemas.js';
import { FixedTrackingCodeGenerator } from '../doubles/fixed-tracking-code-generator.js';
import { InMemoryDeliveryRepository } from '../doubles/in-memory-delivery-repository.js';
import { InMemoryEventDispatcher } from '../doubles/in-memory-event-dispatcher.js';
import { InMemoryStatusHistoryRepository } from '../doubles/in-memory-status-history-repository.js';

describe('Delivery HTTP API', () => {
    const deliveryRepository =
        new InMemoryDeliveryRepository();

    const historyRepository =
        new InMemoryStatusHistoryRepository();

    const eventDispatcher =
        new InMemoryEventDispatcher();

    const trackingCodeGenerator =
        new FixedTrackingCodeGenerator([
            'HTTP1234',
            'HTTP5678',
        ]);

    const controller =
        new DeliveryController(
            new CreateDeliveryUseCase(
                deliveryRepository,
                trackingCodeGenerator,
            ),
            new ListDeliveriesUseCase(
                deliveryRepository,
            ),
            new GetDeliveryByTrackingCodeUseCase(
                deliveryRepository,
                historyRepository,
            ),
            new UpdateDeliveryStatusUseCase(
                deliveryRepository,
                eventDispatcher,
            ),
        );

    const app = express();

    app.use(express.json());

    app.post(
        '/deliveries',
        validateRequest(
            createDeliverySchema,
        ),
        controller.create,
    );

    app.get(
        '/deliveries',
        validateRequest(
            listDeliveriesSchema,
        ),
        controller.list,
    );

    app.get(
        '/deliveries/:trackingCode',
        validateRequest(
            getDeliveryByTrackingCodeSchema,
        ),
        controller.getByTrackingCode,
    );

    app.patch(
        '/deliveries/:id/status',
        validateRequest(
            updateDeliveryStatusSchema,
        ),
        controller.updateStatus,
    );

    app.use(errorHandler);

    beforeEach(() => {
        deliveryRepository.items.splice(0);
        historyRepository.items.splice(0);
        eventDispatcher.events.splice(0);
    });

    it('creates, lists and retrieves a delivery', async () => {
        const creationResponse =
            await request(app)
                .post('/deliveries')
                .send({
                    description: 'HTTP package',
                    origin: 'Fortaleza, CE',
                    destination:
                        'Campina Grande, PB',
                });

        expect(
            creationResponse.status,
        ).toBe(201);

        expect(
            creationResponse.body.data,
        ).toMatchObject({
            trackingCode: 'HTTP1234',
            status: DeliveryStatus.PENDING,
            description: 'HTTP package',
        });

        const listResponse =
            await request(app).get(
                '/deliveries?page=1&limit=10',
            );

        expect(listResponse.status).toBe(200);
        expect(
            listResponse.body.data,
        ).toHaveLength(1);

        expect(
            listResponse.body.pagination,
        ).toMatchObject({
            page: 1,
            limit: 10,
            total: 1,
            totalPages: 1,
        });

        const detailsResponse =
            await request(app).get(
                '/deliveries/http1234',
            );

        expect(
            detailsResponse.status,
        ).toBe(200);

        expect(
            detailsResponse.body.data
                .trackingCode,
        ).toBe('HTTP1234');

        expect(
            detailsResponse.body.data
                .statusHistory,
        ).toEqual([]);
    });

    it('updates status and emits the domain event', async () => {
        const creationResponse =
            await request(app)
                .post('/deliveries')
                .send({
                    description:
                        'Status package',
                    origin: 'Origin',
                    destination: 'Destination',
                });

        const deliveryId =
            creationResponse.body.data
                .id as string;

        const response =
            await request(app)
                .patch(
                    `/deliveries/${deliveryId}/status`,
                )
                .send({
                    status:
                        DeliveryStatus.DELIVERING,
                    latitude: -3.7319,
                    longitude: -38.5267,
                });

        expect(response.status).toBe(200);

        expect(
            response.body.data,
        ).toMatchObject({
            id: deliveryId,
            status:
                DeliveryStatus.DELIVERING,
            latitude: -3.7319,
            longitude: -38.5267,
        });

        expect(
            eventDispatcher.events,
        ).toHaveLength(1);
    });

    it('returns detailed validation errors', async () => {
        const response =
            await request(app)
                .post('/deliveries')
                .send({
                    description: '',
                    origin: '',
                });

        expect(response.status).toBe(400);

        expect(
            response.body.error.code,
        ).toBe('VALIDATION_ERROR');

        expect(
            response.body.error.details,
        ).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    path: 'body.description',
                }),
                expect.objectContaining({
                    path: 'body.origin',
                }),
                expect.objectContaining({
                    path: 'body.destination',
                }),
            ]),
        );
    });
});