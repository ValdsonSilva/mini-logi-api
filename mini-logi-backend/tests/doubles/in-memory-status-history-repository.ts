import type { StatusHistoryRepository } from '../../src/core/application/ports/repositories/status-history-repository.js';
import type { StatusHistory } from '../../src/core/domain/entities/status-history.js';

export class InMemoryStatusHistoryRepository
    implements StatusHistoryRepository {
    public readonly items: StatusHistory[] = [];

    public async create(
        statusHistory: StatusHistory,
    ): Promise<void> {
        this.items.push(statusHistory);
    }

    public async findByDeliveryId(
        deliveryId: string,
    ): Promise<StatusHistory[]> {
        return this.items
            .filter((item) => item.deliveryId === deliveryId)
            .sort(
                (first, second) => first.changedAt.getTime() - second.changedAt.getTime(),
            );
    }
}