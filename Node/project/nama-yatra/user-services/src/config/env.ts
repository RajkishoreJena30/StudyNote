import dotenv from "dotenv";

dotenv.config();

const config = {
    SERVICE_NAME: 'User Service',
    PORT: Number(process.env.PORT) || 4001,
    NODE_ENV: process.env.NODE_ENV || 'development',
    LOG_LEVEL: process.env.LOG_LEVEL || 'info',
    ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS || 'http://localhost:4000,http://localhost:4001',
    REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',
    DATABASE_URL: process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/userdb?schema=public',
    SMTP_HOST: process.env.SMTP_HOST || 'smtp.gmail.com',
    SMTP_PORT: Number(process.env.SMTP_PORT) || 587,
    SMTP_USER: process.env.SMTP_USER || '',
    SMTP_PASS: process.env.SMTP_PASS || '',
    MINUTES_TO_EXPIRE: Number(process.env.MINUTES_TO_EXPIRE) || 300,
    MAIL_FROM: process.env.MAIL_FROM || '',
    OTP_RATE_MAX: process.env.OTP_RATE_MAX || '5',
    OTP_HASH_SECRET: process.env.OTP_HASH_SECRET || 'change_this_secret_in_production',
};

export { config };