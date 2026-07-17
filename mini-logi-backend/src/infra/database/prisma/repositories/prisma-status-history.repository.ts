import type { StatusHistoryRepository } from '../../../../core/application/ports/repositories/status-history-repository.js';
import type { StatusHistory } from '../../../../core/domain/entities/status-history.js';
import { PrismaStatusHistoryMapper } from '../mappers/prisma-status-history.mapper.js';
import { prisma } from '../prisma-client.js';

export class PrismaStatusHistoryRepository
    implements StatusHistoryRepository {
    public async create(
        statusHistory: StatusHistory,
    ): Promise<void> {
        await prisma.statusHistory.create({
            data:
                PrismaStatusHistoryMapper.toPersistence(
                    statusHistory,
                ),
        });
    }

    public async findByDeliveryId(
        deliveryId: string,
    ): Promise<StatusHistory[]> {
        const history =
            await prisma.statusHistory.findMany({
                where: {
                    deliveryId,
                },
                orderBy: {
                    changedAt: 'asc',
                },
            });

        return history.map(
            PrismaStatusHistoryMapper.toDomain,
        );
    }
}