import { Driver } from '../../../domain/entities/driver.js';
import { ConflictError } from '../../../domain/errors/conflict-error.js';
import type { DriverRepository } from '../../ports/repositories/driver-repository.js';

export interface CreateDriverInput {
    name: string;
    licenseId: string;
}

export class CreateDriverUseCase {
    constructor(private readonly driverRepository: DriverRepository) { }

    public async execute(input: CreateDriverInput): Promise<Driver> {
        const normalizedLicenseId = input.licenseId.trim().toUpperCase();

        const existingDriver =
            await this.driverRepository.findByLicenseId(normalizedLicenseId);

        if (existingDriver) {
            throw new ConflictError(
                'A driver with this license ID already exists.',
                'DRIVER_LICENSE_ALREADY_EXISTS',
            );
        }

        const driver = Driver.create({
            name: input.name,
            licenseId: normalizedLicenseId,
        });

        await this.driverRepository.create(driver);

        return driver;
    }
}