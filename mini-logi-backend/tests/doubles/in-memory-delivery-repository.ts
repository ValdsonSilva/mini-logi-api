import type {
    DeliveryPagination,
    DeliveryRepository,
    PaginatedDeliveries,
} from '../../src/core/application/ports/repositories/delivery-repository.js';
import type { Delivery } from '../../src/core/domain/entities/delivery.js';

export class InMemoryDeliveryRepository implements DeliveryRepository {
    public readonly items: Delivery[] = [];

    public async create(delivery: Delivery): Promise<void> {
        this.items.push(delivery);
    }

    public async findById(id: string): Promise<Delivery | null> {
        return (
            this.items.find((delivery) => delivery.id === id) ?? null
        );
    }

    public async findByTrackingCode(
        trackingCode: string,
    ): Promise<Delivery | null> {
        return (
            this.items.find(
                (delivery) => delivery.trackingCode === trackingCode,
            ) ?? null
        );
    }

    public async existsByTrackingCode(
        trackingCode: string,
    ): Promise<boolean> {
        return this.items.some(
            (delivery) => delivery.trackingCode === trackingCode,
        );
    }

    public async findAll(
        pagination: DeliveryPagination,
    ): Promise<PaginatedDeliveries> {
        const start = (pagination.page - 1) * pagination.limit;

        const items = this.items.slice(
            start,
            start + pagination.limit,
        );

        const total = this.items.length;

        return {
            items,
            total,
            page: pagination.page,
            limit: pagination.limit,
            totalPages: Math.ceil(total / pagination.limit),
        };
    }

    public async save(delivery: Delivery): Promise<void> {
        const index = this.items.findIndex(
            (item) => item.id === delivery.id,
        );

        if (index >= 0) {
            this.items[index] = delivery;
        }
    }
}