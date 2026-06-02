import Redis from "ioredis";
import { config} from "./env";
import logger from "./logger";

declare global {
    var redis: Redis | undefined;
}

class RedisSingleton {
    private static instance: Redis;
    private static isConnected = false;

    private constructor() {}

    private static createClient(): Redis {
        const client = new Redis(config.REDIS_URL, {
            retryStrategy: (times: number) => {
                const delay = Math.min(times * 50, 2000);
                logger.warn(`Redis connection lost. Attempting to reconnect in ${delay}ms...`);
                return delay;
            },
            maxRetriesPerRequest: 3,
        });

        client.on("close", () => {
            RedisSingleton.isConnected = false;
            logger.warn("Redis connection closed.");
        });

        client.on("reconnecting", (delay: number) => {
            logger.info(`Attempting to reconnect to Redis in ${delay}ms...`);
        });

        client.on("ready", () => {
            RedisSingleton.isConnected = true;
            logger.info("Redis connection is ready.");
        });

        client.on("connect", () => {
            RedisSingleton.isConnected = true;
            logger.info("Connected to Redis successfully.");
        });

        client.on("error", (error: Error) => {
            RedisSingleton.isConnected = false;
            logger.error(`Redis connection error: ${error.message}`);
        });

        return client;
    }

    static getInstance(): Redis {
        if (RedisSingleton.instance) {
            return RedisSingleton.instance;
        }

        const existingClient = globalThis.redis;
        if (existingClient) {
            RedisSingleton.instance = existingClient;
            return RedisSingleton.instance;
        }

        RedisSingleton.instance = RedisSingleton.createClient();

        if (config.NODE_ENV !== "production") {
            globalThis.redis = RedisSingleton.instance;
        }

        return RedisSingleton.instance;
    }

    static getConnectionStatus(): boolean {
        return RedisSingleton.isConnected;
    }
}

export const isRedisConnected = (): boolean => RedisSingleton.getConnectionStatus();
export default RedisSingleton.getInstance();