import type { Driver } from '../../../domain/entities/driver.js';

export interface DriverRepository {
    create(driver: Driver): Promise<void>;
    findById(id: string): Promise<Driver | null>;
    findByLicenseId(licenseId: string): Promise<Driver | null>;
    findAll(): Promise<Driver[]>;
    save(driver: Driver): Promise<void>;
}