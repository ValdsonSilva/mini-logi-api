import {
    Router,
    type Router as ExpressRouter,
} from 'express';

import {
    CreateDriverUseCaseFactory,
    ListDriversUseCaseFactory,
} from '../../../infra/factories/driver-use-case.factories.js';

import { DriverController } from '../controllers/driver.controller.js';
import { sensitiveEndpointRateLimiter } from '../middlewares/rate-limit.middleware.js';
import { validateRequest } from '../middlewares/validate-request.middleware.js';
import { createDriverSchema } from '../schemas/driver.schemas.js';

const driverController = new DriverController(
    CreateDriverUseCaseFactory.create(),
    ListDriversUseCaseFactory.create(),
);

export const driverRoutes: ExpressRouter = Router();

driverRoutes.post(
    '/',
    sensitiveEndpointRateLimiter,
    validateRequest(createDriverSchema),
    driverController.create,
);

driverRoutes.get(
    '/',
    driverController.list,
);