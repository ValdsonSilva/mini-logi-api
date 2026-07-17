import type { DriverRepository } from '../../../../core/application/ports/repositories/driver-repository.js';
import type { Driver } from '../../../../core/domain/entities/driver.js';
import { PrismaDriverMapper } from '../mappers/prisma-driver.mapper.js';
import { prisma } from '../prisma-client.js';

export class PrismaDriverRepository implements DriverRepository {
    public async create(driver: Driver): Promise<void> {
        await prisma.driver.create({
            data: PrismaDriverMapper.toPersistence(driver),
        });
    }

    public async findById(
        id: string,
    ): Promise<Driver | null> {
        const driver = await prisma.driver.findUnique({
            where: { id },
        });

        return driver
            ? PrismaDriverMapper.toDomain(driver)
            : null;
    }

    public async findByLicenseId(
        licenseId: string,
    ): Promise<Driver | null> {
        const driver = await prisma.driver.findUnique({
            where: { licenseId },
        });

        return driver
            ? PrismaDriverMapper.toDomain(driver)
            : null;
    }

    public async findAll(): Promise<Driver[]> {
        const drivers = await prisma.driver.findMany({
            orderBy: {
                createdAt: 'desc',
            },
        });

        return drivers.map(PrismaDriverMapper.toDomain);
    }

    public async save(driver: Driver): Promise<void> {
        const data =
            PrismaDriverMapper.toPersistence(driver);

        await prisma.driver.update({
            where: {
                id: driver.id,
            },
            data: {
                name: data.name,
                licenseId: data.licenseId,
                status: data.status,
                updatedAt: data.updatedAt,
            },
        });
    }
}