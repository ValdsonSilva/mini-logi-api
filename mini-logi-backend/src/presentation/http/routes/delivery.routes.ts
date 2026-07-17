import {
    Router,
    type Router as ExpressRouter,
} from 'express';

import {
    CreateDeliveryUseCaseFactory,
    GetDeliveryByTrackingCodeUseCaseFactory,
    ListDeliveriesUseCaseFactory,
    UpdateDeliveryStatusUseCaseFactory,
} from '../../../infra/factories/delivery-use-case.factories.js';

import { DeliveryController } from '../controllers/delivery.controller.js';
import { sensitiveEndpointRateLimiter } from '../middlewares/rate-limit.middleware.js';
import { validateRequest } from '../middlewares/validate-request.middleware.js';

import {
    createDeliverySchema,
    getDeliveryByTrackingCodeSchema,
    listDeliveriesSchema,
    updateDeliveryStatusSchema,
} from '../schemas/delivery.schemas.js';

const deliveryController =
    new DeliveryController(
        CreateDeliveryUseCaseFactory.create(),
        ListDeliveriesUseCaseFactory.create(),
        GetDeliveryByTrackingCodeUseCaseFactory.create(),
        UpdateDeliveryStatusUseCaseFactory.create(),
    );

export const deliveryRoutes: ExpressRouter =
    Router();

deliveryRoutes.post(
    '/',
    sensitiveEndpointRateLimiter,
    validateRequest(createDeliverySchema),
    deliveryController.create,
);

deliveryRoutes.get(
    '/',
    validateRequest(listDeliveriesSchema),
    deliveryController.list,
);

deliveryRoutes.get(
    '/:trackingCode',
    validateRequest(
        getDeliveryByTrackingCodeSchema,
    ),
    deliveryController.getByTrackingCode,
);

deliveryRoutes.patch(
    '/:id/status',
    validateRequest(
        updateDeliveryStatusSchema,
    ),
    deliveryController.updateStatus,
);