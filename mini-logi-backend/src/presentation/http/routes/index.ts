import {
    Router,
    type Router as ExpressRouter,
} from 'express';

import { deliveryRoutes } from './delivery.routes.js';
import { driverRoutes } from './driver.routes.js';

export const apiRoutes: ExpressRouter = Router();

apiRoutes.use('/drivers', driverRoutes);
apiRoutes.use('/deliveries', deliveryRoutes);