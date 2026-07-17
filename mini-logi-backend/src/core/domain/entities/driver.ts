import { DomainValidationError } from '../errors/domain-validation-error.js';
import { DriverStatus } from '../enums/driver-status.js';
import { Entity } from './entity.js';

export interface DriverProps {
    name: string;
    licenseId: string;
    status?: DriverStatus;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface RestoreDriverProps {
    id: string;
    name: string;
    licenseId: string;
    status: DriverStatus;
    createdAt: Date;
    updatedAt: Date;
}

export class Driver extends Entity {
    private _name: string;
    private _licenseId: string;
    private _status: DriverStatus;
    public readonly createdAt: Date;
    private _updatedAt: Date;

    private constructor(props: DriverProps, id?: string) {
        super(id);
        this._name = Driver.validateName(props.name);
        this._licenseId = Driver.validateLicenseId(props.licenseId);
        this._status = props.status ?? DriverStatus.AVAILABLE;
        this.createdAt = props.createdAt ?? new Date();
        this._updatedAt = props.updatedAt ?? this.createdAt;
    }

    public static create(props: DriverProps): Driver {
        return new Driver(props);
    }

    public static restore(props: RestoreDriverProps): Driver {
        return new Driver(props, props.id);
    }

    public get name(): string {
        return this._name;
    }

    public get licenseId(): string {
        return this._licenseId;
    }

    public get status(): DriverStatus {
        return this._status;
    }

    public get updatedAt(): Date {
        return this._updatedAt;
    }

    public rename(name: string): void {
        this._name = Driver.validateName(name);
        this.touch();
    }

    public changeStatus(status: DriverStatus): void {
        if (this._status === status) {
            return;
        }

        this._status = status;
        this.touch();
    }

    private touch(): void {
        this._updatedAt = new Date();
    }

    private static validateName(name: string): string {
        const normalizedName = name.trim();

        if (normalizedName.length < 2 || normalizedName.length > 120) {
            throw new DomainValidationError(
                'Driver name must contain between 2 and 120 characters.',
                'INVALID_DRIVER_NAME',
            );
        }

        return normalizedName;
    }

    private static validateLicenseId(licenseId: string): string {
        const normalizedLicenseId = licenseId.trim().toUpperCase();

        if (normalizedLicenseId.length < 3 || normalizedLicenseId.length > 30) {
            throw new DomainValidationError(
                'Driver license ID must contain between 3 and 30 characters.',
                'INVALID_DRIVER_LICENSE_ID',
            );
        }

        return normalizedLicenseId;
    }
}