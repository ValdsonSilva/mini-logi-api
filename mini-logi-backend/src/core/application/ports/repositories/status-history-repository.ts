import type { StatusHistory } from '../../../domain/entities/status-history.js';

export interface StatusHistoryRepository {
    create(statusHistory: StatusHistory): Promise<void>;
    findByDeliveryId(deliveryId: string): Promise<StatusHistory[]>;
}