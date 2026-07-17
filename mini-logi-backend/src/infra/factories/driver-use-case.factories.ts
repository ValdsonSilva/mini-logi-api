import { CreateDriverUseCase } from '../../core/application/use-cases/drivers/create-driver.use-case.js';
import { ListDriversUseCase } from '../../core/application/use-cases/drivers/list-drivers.use-case.js';
import { driverRepository } from './dependencies.js';

export class CreateDriverUseCaseFactory {
    public static create(): CreateDriverUseCase {
        return new CreateDriverUseCase(
            driverRepository,
        );
    }
}

export class ListDriversUseCaseFactory {
    public static create(): ListDriversUseCase {
        return new ListDriversUseCase(
            driverRepository,
        );
    }
}