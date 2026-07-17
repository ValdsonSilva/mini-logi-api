import type { DriverRepository } from '../../src/core/application/ports/repositories/driver-repository.js';
import type { Driver } from '../../src/core/domain/entities/driver.js';

export class InMemoryDriverRepository implements DriverRepository {
    public readonly items: Driver[] = [];

    public async create(driver: Driver): Promise<void> {
        this.items.push(driver);
    }

    public async findById(id: string): Promise<Driver | null> {
        return this.items.find((driver) => driver.id === id) ?? null;
    }

    public async findByLicenseId(
        licenseId: string,
    ): Promise<Driver | null> {
        return (
            this.items.find((driver) => driver.licenseId === licenseId) ?? null
        );
    }

    public async findAll(): Promise<Driver[]> {
        return [...this.items];
    }

    public async save(driver: Driver): Promise<void> {
        const index = this.items.findIndex(
            (item) => item.id === driver.id,
        );

        if (index >= 0) {
            this.items[index] = driver;
        }
    }
}