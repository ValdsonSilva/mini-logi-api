import type {
    DeliveryRepository,
    PaginatedDeliveries,
} from '../../ports/repositories/delivery-repository.js';

export interface ListDeliveriesInput {
    page?: number;
    limit?: number;
}

export class ListDeliveriesUseCase {
    constructor(private readonly deliveryRepository: DeliveryRepository) { }

    public async execute(
        input: ListDeliveriesInput = {},
    ): Promise<PaginatedDeliveries> {
        const page = Math.max(1, Math.trunc(input.page ?? 1));
        const limit = Math.min(
            100,
            Math.max(1, Math.trunc(input.limit ?? 20)),
        );

        return this.deliveryRepository.findAll({ page, limit });
    }
}