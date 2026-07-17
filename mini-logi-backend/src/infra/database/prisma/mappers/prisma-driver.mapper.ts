import {
    DriverStatus as PrismaDriverStatus,
    type Driver as PrismaDriver,
} from '@prisma/client';

import { Driver } from '../../../../core/domain/entities/driver.js';
import { DriverStatus } from '../../../../core/domain/enums/driver-status.js';

export interface DriverPersistenceData {
    id: string;
    name: string;
    licenseId: string;
    status: PrismaDriverStatus;
    createdAt: Date;
    updatedAt: Date;
}

export class PrismaDriverMapper {
    public static toDomain(raw: PrismaDriver): Driver {
        return Driver.restore({
            id: raw.id,
            name: raw.name,
            licenseId: raw.licenseId,
            status: raw.status as DriverStatus,
            createdAt: raw.createdAt,
            updatedAt: raw.updatedAt,
        });
    }

    public static toPersistence(
        driver: Driver,
    ): DriverPersistenceData {
        return {
            id: driver.id,
            name: driver.name,
            licenseId: driver.licenseId,
            status: driver.status as PrismaDriverStatus,
            createdAt: driver.createdAt,
            updatedAt: driver.updatedAt,
        };
    }
}