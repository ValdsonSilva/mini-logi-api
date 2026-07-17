import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
    prisma?: PrismaClient;
};

// singleton pattern - para garantir que apenas uma instância do PrismaClient seja criada e usada em toda a aplicação
export const prisma = globalForPrisma.prisma ?? new PrismaClient({
    log: process.env.NODE_ENV === 'development'
            ? ['warn', 'error']
            : ['error'],
});

if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma;
}