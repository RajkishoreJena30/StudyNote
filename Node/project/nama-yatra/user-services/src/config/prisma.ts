import * as PrismaModule from "@prisma/client";
import { config } from "./env";

const PrismaClient = (PrismaModule as { PrismaClient?: new () => any }).PrismaClient;

if (!PrismaClient) {
	throw new Error("PrismaClient is not available. Run 'npx prisma generate' after creating prisma/schema.prisma.");
}

type PrismaClientInstance = InstanceType<typeof PrismaClient>;

declare global {
	var prisma: PrismaClientInstance | undefined;
}

const prisma = globalThis.prisma ?? new PrismaClient();

if (config.NODE_ENV !== "production") {
	globalThis.prisma = prisma;
}

export default prisma;