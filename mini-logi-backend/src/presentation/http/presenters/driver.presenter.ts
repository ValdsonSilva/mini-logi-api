import type { Driver } from '../../../core/domain/entities/driver.js';

export class DriverPresenter {
    public static toHTTP(driver: Driver) {
        return {
            id: driver.id,
            name: driver.name,
            licenseId: driver.licenseId,
            status: driver.status,
            createdAt: driver.createdAt.toISOString(),
            updatedAt: driver.updatedAt.toISOString(),
        };
    }
}