import type { RequestHandler } from 'express';
import type { CreateDriverUseCase } from '../../../core/application/use-cases/drivers/create-driver.use-case.js';
import type { ListDriversUseCase } from '../../../core/application/use-cases/drivers/list-drivers.use-case.js';
import { DriverPresenter } from '../presenters/driver.presenter.js';
import type { CreateDriverRequest } from '../schemas/driver.schemas.js';
import { getValidatedInput } from '../types/validated-input.js';

export class DriverController {
    constructor(
        private readonly createDriverUseCase:
            CreateDriverUseCase,
        private readonly listDriversUseCase:
            ListDriversUseCase,
    ) { }

    public create: RequestHandler = async (
        _request,
        response,
    ) => {
        const { body } = getValidatedInput<CreateDriverRequest>(
                response,
            );

        const driver =
            await this.createDriverUseCase.execute(
                body,
            );

        response.status(201).json({
            data: DriverPresenter.toHTTP(driver),
        });
    };

    public list: RequestHandler = async (
        _request,
        response,
    ) => {
        const drivers =
            await this.listDriversUseCase.execute();

        response.status(200).json({
            data: drivers.map(
                DriverPresenter.toHTTP,
            ),
        });
    };
}