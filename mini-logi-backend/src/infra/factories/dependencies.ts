import { DeliveryStatusChangedEvent } from '../../core/domain/events/delivery-status-changed.event.js';

import { PrismaDeliveryRepository } from '../database/prisma/repositories/prisma-delivery.repository.js';
import { PrismaDriverRepository } from '../database/prisma/repositories/prisma-driver.repository.js';
import { PrismaStatusHistoryRepository } from '../database/prisma/repositories/prisma-status-history.repository.js';

import { EventEmitterDispatcher } from '../events/event-emitter-dispatcher.js';
import { HistoryLoggerHandler } from '../events/handlers/history-logger.handler.js';
import { NotificationHandler } from '../events/handlers/notification.handler.js';
import { AlphanumericTrackingCodeGenerator } from '../services/alphanumeric-tracking-code-generator.js';

export const driverRepository = new PrismaDriverRepository();

export const deliveryRepository = new PrismaDeliveryRepository();

export const statusHistoryRepository = new PrismaStatusHistoryRepository();

export const trackingCodeGenerator = new AlphanumericTrackingCodeGenerator();

export const eventDispatcher = new EventEmitterDispatcher();

// registra as inserções de eventos e handlers para que sejam executados quando o evento for emitido
eventDispatcher.register(
    DeliveryStatusChangedEvent.eventName,
    new HistoryLoggerHandler(
        statusHistoryRepository,
    ),
);

// simula o envio de notificações quando o status da entrega for alterado por meio de logs no console
eventDispatcher.register(
    DeliveryStatusChangedEvent.eventName,
    new NotificationHandler(),
);