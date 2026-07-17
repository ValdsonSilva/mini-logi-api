import type { Driver } from '../../../domain/entities/driver.js';
import type { DriverRepository } from '../../ports/repositories/driver-repository.js';

export class ListDriversUseCase {
    constructor(private readonly driverRepository: DriverRepository) { }

    public async execute(): Promise<Driver[]> {
        return this.driverRepository.findAll();
    }
}