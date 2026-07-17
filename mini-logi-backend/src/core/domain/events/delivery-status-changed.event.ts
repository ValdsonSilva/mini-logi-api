import { DeliveryStatus } from '../enums/delivery-status.js';
import type { DomainEvent } from './domain-event.js';

export interface DeliveryStatusChangedPayload {
    deliveryId: string;
    trackingCode: string;
    previousStatus: DeliveryStatus;
    status: DeliveryStatus;
    latitude: number | null;
    longitude: number | null;
}

export class DeliveryStatusChangedEvent implements DomainEvent<DeliveryStatusChangedPayload> {
    public static readonly eventName = 'delivery.status.changed';
    public readonly name = DeliveryStatusChangedEvent.eventName;
    public readonly occurredAt: Date;
    public readonly payload: DeliveryStatusChangedPayload;

    constructor(
        payload: DeliveryStatusChangedPayload,
        occurredAt: Date = new Date(),
    ) {
        this.payload = payload;
        this.occurredAt = occurredAt;
    }
}