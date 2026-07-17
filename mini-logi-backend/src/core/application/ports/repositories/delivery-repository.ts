import type { Delivery } from '../../../domain/entities/delivery.js';

export interface DeliveryPagination {
    page: number;
    limit: number;
}

export interface PaginatedDeliveries {
    items: Delivery[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface DeliveryRepository {
    create(delivery: Delivery): Promise<void>;
    findById(id: string): Promise<Delivery | null>;
    findByTrackingCode(trackingCode: string): Promise<Delivery | null>;
    existsByTrackingCode(trackingCode: string): Promise<boolean>;
    findAll(pagination: DeliveryPagination): Promise<PaginatedDeliveries>;
    save(delivery: Delivery): Promise<void>;
}