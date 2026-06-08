import { PrismaClient } from '@prisma/client'
import { PrismaPg } from "@prisma/adapter-pg";
import { config } from "./env";

const connectionString = config.DATABASE_URL;

const globalForPrisma = globalThis as typeof globalThis & {
	prisma?: PrismaClient;
};

if (!globalForPrisma.prisma) {
	const adapter = new PrismaPg({ connectionString });

	globalForPrisma.prisma = new PrismaClient({
		adapter,
		log: ["error", "warn"],
	});
}

const prisma = globalForPrisma.prisma!;

export default prisma;