import { DeliveryStatus } from '../enums/delivery-status.js';
import { DomainValidationError } from '../errors/domain-validation-error.js';
import { Entity } from './entity.js';

export interface StatusHistoryProps {
    deliveryId: string;
    status: DeliveryStatus;
    latitude?: number | null;
    longitude?: number | null;
    changedAt?: Date;
}

export interface RestoreStatusHistoryProps extends StatusHistoryProps {
    id: string;
    changedAt: Date;
}

export class StatusHistory extends Entity {
    public readonly deliveryId: string;
    public readonly status: DeliveryStatus;
    public readonly latitude: number | null;
    public readonly longitude: number | null;
    public readonly changedAt: Date;

    private constructor(props: StatusHistoryProps, id?: string) {
        super(id);

        this.deliveryId = StatusHistory.validateDeliveryId(props.deliveryId);
        this.status = props.status;
        this.latitude = StatusHistory.validateLatitude(props.latitude ?? null);
        this.longitude = StatusHistory.validateLongitude(props.longitude ?? null);
        this.changedAt = props.changedAt ?? new Date();
    }

    public static create(props: StatusHistoryProps): StatusHistory {
        return new StatusHistory(props);
    }

    public static restore(
        props: RestoreStatusHistoryProps,
    ): StatusHistory {
        return new StatusHistory(props, props.id);
    }

    private static validateDeliveryId(deliveryId: string): string {
        const normalizedDeliveryId = deliveryId.trim();

        if (!normalizedDeliveryId) {
            throw new DomainValidationError(
                'Delivery ID is required for status history.',
                'INVALID_DELIVERY_ID',
            );
        }

        return normalizedDeliveryId;
    }

    private static validateLatitude(latitude: number | null): number | null {
        if (
            latitude !== null &&
            (!Number.isFinite(latitude) || latitude < -90 || latitude > 90)
        ) {
            throw new DomainValidationError(
                'Latitude must be between -90 and 90.',
                'INVALID_LATITUDE',
            );
        }

        return latitude;
    }

    private static validateLongitude(longitude: number | null): number | null {
        if (
            longitude !== null &&
            (!Number.isFinite(longitude) ||
                longitude < -180 ||
                longitude > 180)
        ) {
            throw new DomainValidationError(
                'Longitude must be between -180 and 180.',
                'INVALID_LONGITUDE',
            );
        }

        return longitude;
    }
}