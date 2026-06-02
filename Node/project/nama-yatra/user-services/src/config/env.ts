import dotenv from "dotenv"

dotenv.config();

const config = {
    SERVICE_NAME: 'User Service',
    PORT:Number( process.env.PORT )|| 4001,
    NODE_ENV: process.env.NODE_ENV || 'development',
    LOG_LEVEL: process.env.LOG_LEVEL || 'info',
    ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS || 'http://localhost:4000,http://localhost:4001',
    REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',
}

export { config }