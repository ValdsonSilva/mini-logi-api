import { DeliveryStatus } from '../enums/delivery-status.js';
import { DomainValidationError } from '../errors/domain-validation-error.js';
import { Entity } from './entity.js';

export interface DeliveryProps {
  trackingCode: string;
  description: string;
  origin: string;
  destination: string;
  status?: DeliveryStatus;
  latitude?: number | null;
  longitude?: number | null;
  driverId?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface RestoreDeliveryProps extends DeliveryProps {
  id: string;
  status: DeliveryStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface DeliveryLocation {
  latitude: number | null;
  longitude: number | null;
}

export class Delivery extends Entity {
  public readonly trackingCode: string;
  private _description: string;
  private _status: DeliveryStatus;
  public readonly origin: string;
  public readonly destination: string;
  private _latitude: number | null;
  private _longitude: number | null;
  private _driverId: string | null;
  public readonly createdAt: Date;
  private _updatedAt: Date;

  private constructor(props: DeliveryProps, id?: string) {
    super(id);

    this.trackingCode = Delivery.validateTrackingCode(props.trackingCode);

    this._description = Delivery.validateRequiredText(
      props.description,
      'description',
      500,
    );

    this.origin = Delivery.validateRequiredText(
      props.origin,
      'origin',
      255,
    );

    this.destination = Delivery.validateRequiredText(
      props.destination,
      'destination',
      255,
    );

    this._status = props.status ?? DeliveryStatus.PENDING;
    this._latitude = Delivery.validateLatitude(props.latitude ?? null);
    this._longitude = Delivery.validateLongitude(props.longitude ?? null);
    this._driverId = props.driverId ?? null;
    this.createdAt = props.createdAt ?? new Date();
    this._updatedAt = props.updatedAt ?? this.createdAt;
  }

  public static create(props: DeliveryProps): Delivery {
    return new Delivery(props);
  }

  public static restore(props: RestoreDeliveryProps): Delivery {
    return new Delivery(props, props.id);
  }

  public get description(): string {
    return this._description;
  }

  public get status(): DeliveryStatus {
    return this._status;
  }

  public get latitude(): number | null {
    return this._latitude;
  }

  public get longitude(): number | null {
    return this._longitude;
  }

  public get driverId(): string | null {
    return this._driverId;
  }

  public get updatedAt(): Date {
    return this._updatedAt;
  }

  public updateDescription(description: string): void {
    this._description = Delivery.validateRequiredText(
      description,
      'description',
      500,
    );

    this.touch();
  }

  public updateStatus(
    status: DeliveryStatus,
    location?: Partial<DeliveryLocation>,
  ): boolean {
    const nextLatitude =
      location?.latitude === undefined
        ? this._latitude
        : Delivery.validateLatitude(location.latitude);

    const nextLongitude =
      location?.longitude === undefined
        ? this._longitude
        : Delivery.validateLongitude(location.longitude);

    const changed =
      this._status !== status ||
      this._latitude !== nextLatitude ||
      this._longitude !== nextLongitude;

    if (!changed) {
      return false;
    }

    this._status = status;
    this._latitude = nextLatitude;
    this._longitude = nextLongitude;
    this.touch();

    return true;
  }

  public assignDriver(driverId: string): void {
    const normalizedDriverId = driverId.trim();

    if (!normalizedDriverId) {
      throw new DomainValidationError(
        'Driver ID is required to assign a driver.',
        'INVALID_DRIVER_ID',
      );
    }

    this._driverId = normalizedDriverId;
    this.touch();
  }

  public unassignDriver(): void {
    if (this._driverId === null) {
      return;
    }

    this._driverId = null;
    this.touch();
  }

  private touch(): void {
    this._updatedAt = new Date();
  }

  private static validateTrackingCode(trackingCode: string): string {
    const normalizedTrackingCode = trackingCode.trim().toUpperCase();

    if (!/^[A-Z0-9]{8}$/.test(normalizedTrackingCode)) {
      throw new DomainValidationError(
        'Tracking code must contain exactly 8 alphanumeric characters.',
        'INVALID_TRACKING_CODE',
      );
    }

    return normalizedTrackingCode;
  }

  private static validateRequiredText(
    value: string,
    field: string,
    maximumLength: number,
  ): string {
    const normalizedValue = value.trim();

    if (!normalizedValue || normalizedValue.length > maximumLength) {
      throw new DomainValidationError(
        `${field} is required and must not exceed ${maximumLength} characters.`,
        `INVALID_${field.toUpperCase()}`,
      );
    }

    return normalizedValue;
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