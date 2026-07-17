import type {
    DeliveryPagination,
    DeliveryRepository,
    PaginatedDeliveries,
} from '../../../../core/application/ports/repositories/delivery-repository.js';

import type { Delivery } from '../../../../core/domain/entities/delivery.js';
import { PrismaDeliveryMapper } from '../mappers/prisma-delivery.mapper.js';
import { prisma } from '../prisma-client.js';

export class PrismaDeliveryRepository implements DeliveryRepository {
    public async create(
        delivery: Delivery,
    ): Promise<void> {
        await prisma.delivery.create({
            data: PrismaDeliveryMapper.toPersistence(delivery),
        });
    }

    public async findById(
        id: string,
    ): Promise<Delivery | null> {
        const delivery = await prisma.delivery.findUnique({
            where: { id },
        });

        return delivery
            ? PrismaDeliveryMapper.toDomain(delivery)
            : null;
    }

    public async findByTrackingCode(
        trackingCode: string,
    ): Promise<Delivery | null> {
        const delivery = await prisma.delivery.findUnique({
            where: { trackingCode },
        });

        return delivery
            ? PrismaDeliveryMapper.toDomain(delivery)
            : null;
    }

    public async existsByTrackingCode(
        trackingCode: string,
    ): Promise<boolean> {
        const delivery = await prisma.delivery.findUnique({
            where: { trackingCode },
            select: { id: true },
        });

        return delivery !== null;
    }

    public async findAll(
        pagination: DeliveryPagination,
    ): Promise<PaginatedDeliveries> {
        const skip =
            (pagination.page - 1) * pagination.limit;

        const [deliveries, total] =
            await prisma.$transaction([
                prisma.delivery.findMany({
                    skip,
                    take: pagination.limit,
                    orderBy: {
                        createdAt: 'desc',
                    },
                }),
                prisma.delivery.count(),
            ]);

        return {
            items: deliveries.map(
                PrismaDeliveryMapper.toDomain,
            ),
            total,
            page: pagination.page,
            limit: pagination.limit,
            totalPages: Math.ceil(
                total / pagination.limit,
            ),
        };
    }

    public async save(
        delivery: Delivery,
    ): Promise<void> {
        const data =
            PrismaDeliveryMapper.toPersistence(delivery);

        await prisma.delivery.update({
            where: {
                id: delivery.id,
            },
            data: {
                description: data.description,
                status: data.status,
                latitude: data.latitude,
                longitude: data.longitude,
                driverId: data.driverId,
                updatedAt: data.updatedAt,
            },
        });
    }
}