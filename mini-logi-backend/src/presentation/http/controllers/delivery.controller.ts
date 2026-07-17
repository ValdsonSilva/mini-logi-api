import type { RequestHandler } from 'express';
import type { CreateDeliveryUseCase } from '../../../core/application/use-cases/deliveries/create-delivery.use-case.js';
import type { GetDeliveryByTrackingCodeUseCase } from '../../../core/application/use-cases/deliveries/get-delivery-by-tracking-code.use-case.js';
import type { ListDeliveriesUseCase } from '../../../core/application/use-cases/deliveries/list-deliveries.use-case.js';
import type { UpdateDeliveryStatusUseCase } from '../../../core/application/use-cases/deliveries/update-delivery-status.use-case.js';
import { DeliveryPresenter } from '../presenters/delivery.presenter.js';
import type {
    CreateDeliveryRequest,
    GetDeliveryByTrackingCodeRequest,
    ListDeliveriesRequest,
    UpdateDeliveryStatusRequest,
} from '../schemas/delivery.schemas.js';
import { getValidatedInput } from '../types/validated-input.js';

export class DeliveryController {
    constructor(
        private readonly createDeliveryUseCase:
            CreateDeliveryUseCase,
        private readonly listDeliveriesUseCase:
            ListDeliveriesUseCase,
        private readonly getDeliveryByTrackingCodeUseCase:
            GetDeliveryByTrackingCodeUseCase,
        private readonly updateDeliveryStatusUseCase:
            UpdateDeliveryStatusUseCase,
    ) { }

    public create: RequestHandler = async (
        _request,
        response,
    ) => {
        const { body } =
            getValidatedInput<CreateDeliveryRequest>(
                response,
            );

        const delivery =
            await this.createDeliveryUseCase.execute({
                description: body.description,
                origin: body.origin,
                destination: body.destination,
                ...(body.driverId !== undefined
                    ? { driverId: body.driverId }
                    : {}),
            });

        response.status(201).json({
            data: DeliveryPresenter.toHTTP(delivery),
        });
    };

    public list: RequestHandler = async (
        _request,
        response,
    ) => {
        const { query } =
            getValidatedInput<ListDeliveriesRequest>(
                response,
            );

        const result =
            await this.listDeliveriesUseCase.execute(
                query,
            );

        response.status(200).json({
            data: result.items.map(
                DeliveryPresenter.toHTTP,
            ),
            pagination: {
                page: result.page,
                limit: result.limit,
                total: result.total,
                totalPages: result.totalPages,
            },
        });
    };

    public getByTrackingCode: RequestHandler =
        async (_request, response) => {
            const { params } =
                getValidatedInput<GetDeliveryByTrackingCodeRequest>(
                    response,
                );

            const result =
                await this.getDeliveryByTrackingCodeUseCase.execute(
                    params.trackingCode,
                );

            response.status(200).json({
                data: {
                    ...DeliveryPresenter.toHTTP(
                        result.delivery,
                    ),
                    statusHistory:
                        result.statusHistory.map(
                            DeliveryPresenter.historyToHTTP,
                        ),
                },
            });
        };

    public updateStatus: RequestHandler = async (
        _request,
        response,
    ) => {
        const { body, params } =
            getValidatedInput<UpdateDeliveryStatusRequest>(
                response,
            );

        const delivery =
            await this.updateDeliveryStatusUseCase.execute(
                {
                    deliveryId: params.id,
                    status: body.status,
                    ...(body.latitude !== undefined
                        ? { latitude: body.latitude }
                        : {}),
                    ...(body.longitude !== undefined
                        ? { longitude: body.longitude }
                        : {}),
                },
            );

        response.status(200).json({
            data: DeliveryPresenter.toHTTP(delivery),
        });
    };
}