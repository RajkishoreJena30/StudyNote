# 🏗️ Production-Grade Backend in TypeScript
### Real-World E-Commerce Platform — 10k–100k Client Scale
#### Senior MERN Stack Developer — TypeScript Implementation Guide

> **Project**: `ShopFlow` — A scalable e-commerce backend
> **Stack**: Node.js + Express + TypeScript + MongoDB + PostgreSQL + Redis + Kafka + Socket.io
> **Scale**: Designed for 10,000–100,000 concurrent users

---

## 📚 Table of Contents

1. [Project Setup & TypeScript Configuration](#1-project-setup--typescript-configuration)
2. [Folder Structure (Production Grade)](#2-folder-structure-production-grade)
3. [Types, Interfaces & Enums](#3-types-interfaces--enums)
4. [Express App Setup with TypeScript](#4-express-app-setup-with-typescript)
5. [Environment Config & Validation](#5-environment-config--validation)
6. [MongoDB + Mongoose with TypeScript](#6-mongodb--mongoose-with-typescript)
7. [PostgreSQL + Prisma with TypeScript](#7-postgresql--prisma-with-typescript)
8. [Controllers & Service Layer](#8-controllers--service-layer)
9. [Middleware (Auth, Role, Validate, Cache)](#9-middleware-auth-role-validate-cache)
10. [Authentication — JWT + Refresh Tokens](#10-authentication--jwt--refresh-tokens)
11. [Authorization — RBAC](#11-authorization--rbac)
12. [Redis Caching Layer](#12-redis-caching-layer)
13. [File Upload — Multer + Cloudinary](#13-file-upload--multer--cloudinary)
14. [Payment — Stripe Integration](#14-payment--stripe-integration)
15. [Kafka Event Streaming](#15-kafka-event-streaming)
16. [Bull Queue — Background Jobs](#16-bull-queue--background-jobs)
17. [Socket.io — Real-Time Notifications](#17-socketio--real-time-notifications)
18. [API Gateway with TypeScript](#18-api-gateway-with-typescript)
19. [Microservice: Order Service](#19-microservice-order-service)
20. [Error Handling & Custom AppError](#20-error-handling--custom-apperror)
21. [Validation with Zod](#21-validation-with-zod)
22. [Logging — Winston + Morgan](#22-logging--winston--morgan)
23. [Rate Limiting & Security](#23-rate-limiting--security)
24. [Testing with Jest + Supertest](#24-testing-with-jest--supertest)
25. [Dockerizing the TypeScript App](#25-dockerizing-the-typescript-app)
26. [CI/CD Pipeline & PM2 Deployment](#26-cicd-pipeline--pm2-deployment)
27. [Production Checklist & Architecture](#27-production-checklist--architecture)

---

## 1. Project Setup & TypeScript Configuration

### Initialize Project
```bash
mkdir shopflow-api && cd shopflow-api
npm init -y
npm install express mongoose redis kafkajs socket.io stripe multer bcryptjs jsonwebtoken zod winston morgan helmet cors express-rate-limit axios bull dotenv uuid
npm install @prisma/client pg
npm install -D typescript ts-node ts-node-dev @types/express @types/node @types/bcryptjs @types/jsonwebtoken @types/multer @types/morgan @types/cors @types/uuid jest @types/jest supertest @types/supertest ts-jest
npx tsc --init
npx prisma init
```

### tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@config/*": ["src/config/*"],
      "@models/*": ["src/models/*"],
      "@controllers/*": ["src/controllers/*"],
      "@services/*": ["src/services/*"],
      "@middleware/*": ["src/middleware/*"],
      "@utils/*": ["src/utils/*"],
      "@types/*": ["src/types/*"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "tests"]
}
```

### package.json Scripts
```json
{
  "scripts": {
    "dev": "ts-node-dev --respawn --transpile-only src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "test": "jest --coverage",
    "lint": "eslint src/**/*.ts",
    "db:generate": "prisma generate",
    "db:migrate": "prisma migrate dev"
  }
}
```

---

## 2. Folder Structure (Production Grade)

```
shopflow-api/
├── src/
│   ├── config/
│   │   ├── db.ts              # MongoDB connection
│   │   ├── postgres.ts        # Prisma client
│   │   ├── redis.ts           # Redis client
│   │   ├── kafka.ts           # Kafka client
│   │   └── env.ts             # Validated env config
│   ├── types/
│   │   ├── index.ts           # Global type exports
│   │   ├── express.d.ts       # Augment Express Request
│   │   ├── user.types.ts
│   │   ├── product.types.ts
│   │   └── order.types.ts
│   ├── models/                # Mongoose models
│   │   ├── User.model.ts
│   │   ├── Product.model.ts
│   │   └── Order.model.ts
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── user.controller.ts
│   │   ├── product.controller.ts
│   │   └── order.controller.ts
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── user.service.ts
│   │   ├── product.service.ts
│   │   ├── order.service.ts
│   │   ├── payment.service.ts
│   │   └── email.service.ts
│   ├── routes/
│   │   ├── index.ts           # Route aggregator
│   │   ├── auth.routes.ts
│   │   ├── user.routes.ts
│   │   ├── product.routes.ts
│   │   └── order.routes.ts
│   ├── middleware/
│   │   ├── authenticate.ts
│   │   ├── authorize.ts
│   │   ├── validate.ts
│   │   ├── cache.ts
│   │   ├── rateLimiter.ts
│   │   └── errorHandler.ts
│   ├── validators/
│   │   ├── auth.validator.ts
│   │   ├── product.validator.ts
│   │   └── order.validator.ts
│   ├── jobs/
│   │   ├── email.queue.ts
│   │   └── image.queue.ts
│   ├── events/
│   │   ├── producers/
│   │   │   └── order.producer.ts
│   │   └── consumers/
│   │       └── notification.consumer.ts
│   ├── sockets/
│   │   └── index.ts
│   ├── utils/
│   │   ├── AppError.ts
│   │   ├── asyncHandler.ts
│   │   ├── jwt.ts
│   │   ├── logger.ts
│   │   └── cloudinary.ts
│   ├── app.ts                 # Express app
│   └── server.ts              # Entry point
├── prisma/
│   └── schema.prisma
├── tests/
│   ├── unit/
│   └── integration/
├── .env
├── .env.example
├── Dockerfile
├── docker-compose.yml
├── tsconfig.json
└── package.json
```

---

## 3. Types, Interfaces & Enums

### Express Request Augmentation
```typescript
// src/types/express.d.ts
import { IUser } from './user.types';

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
      correlationId?: string;
    }
  }
}
```

### User Types
```typescript
// src/types/user.types.ts
import { Document, Types } from 'mongoose';

export enum UserRole {
  ADMIN = 'admin',
  SELLER = 'seller',
  BUYER = 'buyer',
}

export enum UserStatus {
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  PENDING = 'pending',
}

export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  status: UserStatus;
  avatar?: string;
  googleId?: string;
  refreshToken?: string;
  passwordChangedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidate: string): Promise<boolean>;
}

export interface IUserPayload {
  id: string;
  role: UserRole;
  email: string;
}

export interface RegisterDTO {
  name: string;
  email: string;
  password: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: Omit<IUser, 'password' | 'refreshToken'>;
  accessToken: string;
  refreshToken: string;
}
```

### Product Types
```typescript
// src/types/product.types.ts
import { Document, Types } from 'mongoose';

export enum ProductStatus {
  ACTIVE = 'active',
  DRAFT = 'draft',
  OUT_OF_STOCK = 'out_of_stock',
  ARCHIVED = 'archived',
}

export interface IProductImage {
  url: string;
  publicId: string;
  isPrimary: boolean;
}

export interface IProductReview {
  user: Types.ObjectId;
  rating: number;
  comment: string;
  createdAt: Date;
}

export interface IProduct extends Document {
  _id: Types.ObjectId;
  name: string;
  description: string;
  price: number;
  discountedPrice?: number;
  category: Types.ObjectId;
  seller: Types.ObjectId;
  images: IProductImage[];
  stock: number;
  status: ProductStatus;
  ratings: number;
  numOfReviews: number;
  reviews: IProductReview[];
  tags: string[];
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProductDTO {
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  tags?: string[];
}

export interface ProductQuery {
  page?: number;
  limit?: number;
  sort?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  status?: ProductStatus;
}
```

### Order Types
```typescript
// src/types/order.types.ts
import { Document, Types } from 'mongoose';

export enum OrderStatus {
  PENDING = 'pending',
  PAID = 'paid',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
}

export interface IOrderItem {
  product: Types.ObjectId;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface IShippingAddress {
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
}

export interface IOrder extends Document {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  items: IOrderItem[];
  shippingAddress: IShippingAddress;
  totalPrice: number;
  shippingPrice: number;
  taxPrice: number;
  status: OrderStatus;
  paymentIntentId?: string;
  paidAt?: Date;
  deliveredAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateOrderDTO {
  items: Array<{ product: string; quantity: number }>;
  shippingAddress: IShippingAddress;
}
```

### API Response Types
```typescript
// src/types/index.ts
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  meta?: PaginationMeta;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface JwtPayload {
  id: string;
  role: string;
  email: string;
  iat?: number;
  exp?: number;
}
```

---

## 4. Express App Setup with TypeScript

```typescript
// src/app.ts
import express, { Application, Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import compression from 'compression';
import mongoSanitize from 'express-mongo-sanitize';
import { env } from './config/env';
import { errorHandler } from './middleware/errorHandler';
import { correlationId } from './middleware/correlationId';
import { globalRateLimiter } from './middleware/rateLimiter';
import routes from './routes';
import logger from './utils/logger';

const app: Application = express();

// Trust proxy (for Nginx/load balancer)
app.set('trust proxy', 1);

// Security headers
app.use(helmet());

// CORS
app.use(cors({
  origin: (origin, callback) => {
    const whitelist = env.CORS_ORIGINS.split(',');
    if (!origin || whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS: ${origin} not allowed`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression
app.use(compression());

// Sanitize MongoDB operators
app.use(mongoSanitize());

// HTTP logging
app.use(morgan('combined', {
  stream: { write: (msg: string) => logger.http(msg.trim()) },
  skip: (req) => req.url === '/health',
}));

// Correlation ID for distributed tracing
app.use(correlationId);

// Rate limiting
app.use('/api/', globalRateLimiter);

// Stripe webhook needs raw body — register BEFORE express.json
app.use('/api/v1/payments/webhook',
  express.raw({ type: 'application/json' }),
  (req: Request, _res: Response, next: NextFunction) => {
    (req as any).rawBody = req.body;
    next();
  }
);

// Health check
app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), uptime: process.uptime() });
});

// API Routes
app.use('/api/v1', routes);

// 404
app.use((_req: Request, res: Response) => {
  res.status(404).json({ success: false, error: 'Route not found' });
});

// Global error handler
app.use(errorHandler);

export default app;
```

### Routes Aggregator
```typescript
// src/routes/index.ts
import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import productRoutes from './product.routes';
import orderRoutes from './order.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/products', productRoutes);
router.use('/orders', orderRoutes);

export default router;
```

### Server Entry Point
```typescript
// src/server.ts
import 'dotenv/config';
import http from 'http';
import app from './app';
import { connectMongoDB } from './config/db';
import { connectRedis } from './config/redis';
import { initSocket } from './sockets';
import { startConsumers } from './events/consumers/notification.consumer';
import { env } from './config/env';
import logger from './utils/logger';

const httpServer = http.createServer(app);
initSocket(httpServer);

const start = async (): Promise<void> => {
  try {
    await connectMongoDB();
    await connectRedis();
    await startConsumers();

    httpServer.listen(env.PORT, () => {
      logger.info(`🚀 Server running on port ${env.PORT} [${env.NODE_ENV}]`);
    });
  } catch (err) {
    logger.error('Failed to start server:', err);
    process.exit(1);
  }
};

// Graceful shutdown
const shutdown = async (signal: string): Promise<void> => {
  logger.info(`${signal} received. Shutting down gracefully...`);
  httpServer.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
  setTimeout(() => process.exit(1), 10_000); // Force exit after 10s
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT',  () => shutdown('SIGINT'));
process.on('uncaughtException',  (err) => { logger.error('Uncaught Exception:', err);  process.exit(1); });
process.on('unhandledRejection', (err) => { logger.error('Unhandled Rejection:', err); process.exit(1); });

start();
```

---

## 5. Environment Config & Validation

```typescript
// src/config/env.ts
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV:              z.enum(['development', 'production', 'test']).default('development'),
  PORT:                  z.string().transform(Number).default('5000'),
  MONGO_URI:             z.string().url(),
  REDIS_URL:             z.string().url(),
  POSTGRES_URL:          z.string().url(),
  JWT_SECRET:            z.string().min(32),
  JWT_REFRESH_SECRET:    z.string().min(32),
  JWT_EXPIRES_IN:        z.string().default('15m'),
  JWT_REFRESH_EXPIRES:   z.string().default('7d'),
  CLOUDINARY_NAME:       z.string(),
  CLOUDINARY_KEY:        z.string(),
  CLOUDINARY_SECRET:     z.string(),
  STRIPE_SECRET_KEY:     z.string().startsWith('sk_'),
  STRIPE_WEBHOOK_SECRET: z.string().startsWith('whsec_'),
  KAFKA_BROKERS:         z.string().default('localhost:9092'),
  CORS_ORIGINS:          z.string().default('http://localhost:3000'),
  SESSION_SECRET:        z.string().min(32),
  LOG_LEVEL:             z.enum(['error', 'warn', 'info', 'http', 'debug']).default('info'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Invalid environment variables:');
  console.error(parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;
export type Env = z.infer<typeof envSchema>;
```

---

## 6. MongoDB + Mongoose with TypeScript

### MongoDB Connection
```typescript
// src/config/db.ts
import mongoose from 'mongoose';
import { env } from './env';
import logger from '../utils/logger';

export const connectMongoDB = async (): Promise<void> => {
  mongoose.connection.on('connected',    () => logger.info('MongoDB connected'));
  mongoose.connection.on('disconnected', () => logger.warn('MongoDB disconnected'));
  mongoose.connection.on('error',        (err) => logger.error('MongoDB error:', err));

  await mongoose.connect(env.MONGO_URI, {
    maxPoolSize: 20,
    minPoolSize: 5,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  });
};
```

### User Model
```typescript
// src/models/User.model.ts
import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import { IUser, UserRole, UserStatus } from '../types/user.types';

const userSchema = new Schema<IUser>(
  {
    name:     { type: String, required: true, trim: true, maxlength: 100 },
    email:    { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, select: false, minlength: 8 },
    role:     { type: String, enum: Object.values(UserRole), default: UserRole.BUYER },
    status:   { type: String, enum: Object.values(UserStatus), default: UserStatus.ACTIVE },
    avatar:   { type: String },
    googleId: { type: String },
    refreshToken:       { type: String, select: false },
    passwordChangedAt:  { type: Date },
  },
  { timestamps: true }
);

// Index
userSchema.index({ email: 1 });
userSchema.index({ googleId: 1 }, { sparse: true });

// Hash password before save
userSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Instance method
userSchema.methods.comparePassword = async function (candidate: string): Promise<boolean> {
  return bcrypt.compare(candidate, this.password);
};

export const UserModel = mongoose.model<IUser>('User', userSchema);
```

### Product Model
```typescript
// src/models/Product.model.ts
import mongoose, { Schema } from 'mongoose';
import slugify from 'slugify';
import { IProduct, ProductStatus } from '../types/product.types';

const reviewSchema = new Schema({
  user:      { type: Schema.Types.ObjectId, ref: 'User', required: true },
  rating:    { type: Number, required: true, min: 1, max: 5 },
  comment:   { type: String, trim: true, maxlength: 500 },
  createdAt: { type: Date, default: Date.now },
});

const imageSchema = new Schema({
  url:       { type: String, required: true },
  publicId:  { type: String, required: true },
  isPrimary: { type: Boolean, default: false },
});

const productSchema = new Schema<IProduct>(
  {
    name:             { type: String, required: true, trim: true, maxlength: 200 },
    description:      { type: String, required: true, maxlength: 2000 },
    price:            { type: Number, required: true, min: 0 },
    discountedPrice:  { type: Number, min: 0 },
    category:         { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    seller:           { type: Schema.Types.ObjectId, ref: 'User', required: true },
    images:           [imageSchema],
    stock:            { type: Number, required: true, min: 0, default: 0 },
    status:           { type: String, enum: Object.values(ProductStatus), default: ProductStatus.DRAFT },
    ratings:          { type: Number, default: 0, min: 0, max: 5 },
    numOfReviews:     { type: Number, default: 0 },
    reviews:          [reviewSchema],
    tags:             [{ type: String, trim: true, lowercase: true }],
    slug:             { type: String, unique: true },
  },
  { timestamps: true }
);

// Indexes
productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ category: 1, status: 1, price: 1 });
productSchema.index({ seller: 1 });
productSchema.index({ slug: 1 }, { unique: true });

// Auto-generate slug
productSchema.pre<IProduct>('save', function (next) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

// Recalculate ratings on review update
productSchema.methods.calcAverageRatings = function () {
  const totalRatings = this.reviews.reduce((acc: number, r: any) => acc + r.rating, 0);
  this.ratings = this.reviews.length ? totalRatings / this.reviews.length : 0;
  this.numOfReviews = this.reviews.length;
};

export const ProductModel = mongoose.model<IProduct>('Product', productSchema);
```

---

## 7. PostgreSQL + Prisma with TypeScript

### Prisma Schema
```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("POSTGRES_URL")
}

model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String
  role      String   @default("buyer")
  orders    Order[]
  payments  Payment[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([email])
}

model Order {
  id          Int       @id @default(autoincrement())
  userId      Int
  user        User      @relation(fields: [userId], references: [id])
  totalPrice  Float
  status      String    @default("pending")
  items       OrderItem[]
  payment     Payment?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  @@index([userId])
  @@index([status])
}

model OrderItem {
  id         Int    @id @default(autoincrement())
  orderId    Int
  order      Order  @relation(fields: [orderId], references: [id], onDelete: Cascade)
  productId  String
  name       String
  price      Float
  quantity   Int
}

model Payment {
  id                String   @id @default(cuid())
  orderId           Int      @unique
  order             Order    @relation(fields: [orderId], references: [id])
  userId            Int
  user              User     @relation(fields: [userId], references: [id])
  amount            Float
  currency          String   @default("usd")
  status            String   @default("pending")
  stripeIntentId    String?  @unique
  paidAt            DateTime?
  createdAt         DateTime @default(now())
}
```

### Prisma Client
```typescript
// src/config/postgres.ts
import { PrismaClient } from '@prisma/client';
import logger from '../utils/logger';

const prisma = new PrismaClient({
  log: [
    { emit: 'event', level: 'query' },
    { emit: 'event', level: 'error' },
  ],
});

prisma.$on('query', (e) => {
  if (process.env.NODE_ENV === 'development') {
    logger.debug(`Query: ${e.query} | Duration: ${e.duration}ms`);
  }
});

prisma.$on('error', (e) => logger.error('Prisma error:', e));

export default prisma;
```

---

## 8. Controllers & Service Layer

### asyncHandler Utility
```typescript
// src/utils/asyncHandler.ts
import { Request, Response, NextFunction, RequestHandler } from 'express';

type AsyncFn = (req: Request, res: Response, next: NextFunction) => Promise<unknown>;

export const asyncHandler = (fn: AsyncFn): RequestHandler =>
  (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
```

### Product Service
```typescript
// src/services/product.service.ts
import { ProductModel } from '../models/Product.model';
import { CreateProductDTO, ProductQuery, IProduct } from '../types/product.types';
import { ApiResponse, PaginationMeta } from '../types';
import { AppError } from '../utils/AppError';
import { redisClient } from '../config/redis';

interface ProductListResult {
  products: IProduct[];
  meta: PaginationMeta;
}

export class ProductService {
  async getProducts(query: ProductQuery): Promise<ProductListResult> {
    const {
      page = 1, limit = 10, sort = '-createdAt',
      category, minPrice, maxPrice, search, status,
    } = query;

    const filter: Record<string, unknown> = {};
    if (category) filter.category = category;
    if (status) filter.status = status;
    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {
        ...(minPrice !== undefined && { $gte: minPrice }),
        ...(maxPrice !== undefined && { $lte: maxPrice }),
      };
    }
    if (search) filter.$text = { $search: search };

    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      ProductModel.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .populate('category', 'name')
        .populate('seller', 'name')
        .lean(),
      ProductModel.countDocuments(filter),
    ]);

    return {
      products: products as IProduct[],
      meta: { page, limit, total, pages: Math.ceil(total / limit) },
    };
  }

  async getProductById(id: string): Promise<IProduct> {
    const cacheKey = `product:${id}`;
    const cached = await redisClient.get(cacheKey);
    if (cached) return JSON.parse(cached) as IProduct;

    const product = await ProductModel.findById(id)
      .populate('category', 'name')
      .populate('seller', 'name email');

    if (!product) throw new AppError('Product not found', 404);

    await redisClient.setEx(cacheKey, 3600, JSON.stringify(product));
    return product;
  }

  async createProduct(data: CreateProductDTO, sellerId: string): Promise<IProduct> {
    const product = await ProductModel.create({ ...data, seller: sellerId });
    await redisClient.del('products:list:*'); // Invalidate list cache
    return product;
  }

  async updateProduct(id: string, data: Partial<CreateProductDTO>, sellerId: string): Promise<IProduct> {
    const product = await ProductModel.findById(id);
    if (!product) throw new AppError('Product not found', 404);
    if (product.seller.toString() !== sellerId) throw new AppError('Not authorized', 403);

    Object.assign(product, data);
    await product.save();

    await redisClient.del(`product:${id}`);
    return product;
  }

  async deleteProduct(id: string, sellerId: string): Promise<void> {
    const product = await ProductModel.findById(id);
    if (!product) throw new AppError('Product not found', 404);
    if (product.seller.toString() !== sellerId) throw new AppError('Not authorized', 403);

    await product.deleteOne();
    await redisClient.del(`product:${id}`);
  }
}

export const productService = new ProductService();
```

### Product Controller
```typescript
// src/controllers/product.controller.ts
import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { productService } from '../services/product.service';
import { ApiResponse } from '../types';

export const getProducts = asyncHandler(async (req: Request, res: Response) => {
  const result = await productService.getProducts({
    page:     Number(req.query.page) || 1,
    limit:    Number(req.query.limit) || 10,
    sort:     req.query.sort as string,
    category: req.query.category as string,
    minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
    maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
    search:   req.query.search as string,
  });

  const response: ApiResponse = {
    success: true,
    data:    result.products,
    meta:    result.meta,
  };
  res.status(200).json(response);
});

export const getProduct = asyncHandler(async (req: Request, res: Response) => {
  const product = await productService.getProductById(req.params.id);
  res.status(200).json({ success: true, data: product });
});

export const createProduct = asyncHandler(async (req: Request, res: Response) => {
  const product = await productService.createProduct(req.body, req.user!._id.toString());
  res.status(201).json({ success: true, data: product });
});

export const updateProduct = asyncHandler(async (req: Request, res: Response) => {
  const product = await productService.updateProduct(
    req.params.id, req.body, req.user!._id.toString()
  );
  res.status(200).json({ success: true, data: product });
});

export const deleteProduct = asyncHandler(async (req: Request, res: Response) => {
  await productService.deleteProduct(req.params.id, req.user!._id.toString());
  res.status(204).send();
});
```

---

## 9. Middleware (Auth, Role, Validate, Cache)

### Authenticate Middleware
```typescript
// src/middleware/authenticate.ts
import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt';
import { UserModel } from '../models/User.model';
import { AppError } from '../utils/AppError';

export const authenticate = async (
  req: Request, _res: Response, next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return next(new AppError('No token provided', 401));
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyAccessToken(token);

    const user = await UserModel.findById(decoded.id).select('-password -refreshToken');
    if (!user) return next(new AppError('User not found', 401));
    if (user.status === 'suspended') return next(new AppError('Account suspended', 403));

    req.user = user;
    next();
  } catch (err) {
    next(new AppError('Invalid or expired token', 401));
  }
};
```

### Authorize Middleware
```typescript
// src/middleware/authorize.ts
import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../types/user.types';
import { AppError } from '../utils/AppError';

export const authorize = (...roles: UserRole[]) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) return next(new AppError('Not authenticated', 401));
    if (!roles.includes(req.user.role as UserRole)) {
      return next(new AppError(`Role '${req.user.role}' is not authorized`, 403));
    }
    next();
  };
```

### Zod Validate Middleware
```typescript
// src/middleware/validate.ts
import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

type ValidateTarget = 'body' | 'query' | 'params';

export const validate = (schema: ZodSchema, target: ValidateTarget = 'body') =>
  (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[target]);
    if (!result.success) {
      const errors = (result.error as ZodError).flatten().fieldErrors;
      res.status(400).json({ success: false, errors });
      return;
    }
    req[target] = result.data;
    next();
  };
```

### Cache Middleware
```typescript
// src/middleware/cache.ts
import { Request, Response, NextFunction } from 'express';
import { redisClient } from '../config/redis';
import logger from '../utils/logger';

export const cache = (ttlSeconds: number = 300) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (req.method !== 'GET') return next();

    const key = `cache:${req.originalUrl}`;
    try {
      const cached = await redisClient.get(key);
      if (cached) {
        res.setHeader('X-Cache', 'HIT');
        res.json(JSON.parse(cached));
        return;
      }

      res.setHeader('X-Cache', 'MISS');
      const originalJson = res.json.bind(res);
      res.json = (body: unknown) => {
        if (res.statusCode === 200) {
          redisClient.setEx(key, ttlSeconds, JSON.stringify(body)).catch((e) =>
            logger.error('Cache write error:', e)
          );
        }
        return originalJson(body);
      };
      next();
    } catch (err) {
      logger.warn('Cache middleware error, skipping cache:', err);
      next();
    }
  };
```

---

## 10. Authentication — JWT + Refresh Tokens

### JWT Utilities
```typescript
// src/utils/jwt.ts
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { JwtPayload } from '../types';

export const signAccessToken = (payload: Omit<JwtPayload, 'iat' | 'exp'>): string =>
  jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN } as jwt.SignOptions);

export const signRefreshToken = (payload: Omit<JwtPayload, 'iat' | 'exp'>): string =>
  jwt.sign(payload, env.JWT_REFRESH_SECRET, { expiresIn: env.JWT_REFRESH_EXPIRES } as jwt.SignOptions);

export const verifyAccessToken = (token: string): JwtPayload =>
  jwt.verify(token, env.JWT_SECRET) as JwtPayload;

export const verifyRefreshToken = (token: string): JwtPayload =>
  jwt.verify(token, env.JWT_REFRESH_SECRET) as JwtPayload;
```

### Auth Service
```typescript
// src/services/auth.service.ts
import { UserModel } from '../models/User.model';
import { RegisterDTO, LoginDTO, AuthResponse, IUserPayload } from '../types/user.types';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt';
import { AppError } from '../utils/AppError';
import { emailQueue } from '../jobs/email.queue';

export class AuthService {
  async register(dto: RegisterDTO): Promise<AuthResponse> {
    const existing = await UserModel.findOne({ email: dto.email });
    if (existing) throw new AppError('Email already registered', 400);

    const user = await UserModel.create(dto);

    // Queue welcome email (async, non-blocking)
    await emailQueue.add('welcome', {
      to: user.email,
      name: user.name,
      template: 'welcome',
    });

    return this.generateAuthResponse(user);
  }

  async login(dto: LoginDTO): Promise<AuthResponse> {
    const user = await UserModel.findOne({ email: dto.email }).select('+password');
    if (!user || !(await user.comparePassword(dto.password))) {
      throw new AppError('Invalid email or password', 401);
    }
    if (user.status === 'suspended') throw new AppError('Account suspended', 403);

    return this.generateAuthResponse(user);
  }

  async refreshToken(token: string): Promise<{ accessToken: string }> {
    const decoded = verifyRefreshToken(token); // throws if invalid
    const user = await UserModel.findById(decoded.id).select('+refreshToken');
    if (!user || user.refreshToken !== token) {
      throw new AppError('Invalid refresh token', 401);
    }

    const accessToken = signAccessToken({ id: user.id, role: user.role, email: user.email });
    return { accessToken };
  }

  async logout(userId: string): Promise<void> {
    await UserModel.findByIdAndUpdate(userId, { refreshToken: null });
  }

  private async generateAuthResponse(user: any): Promise<AuthResponse> {
    const payload: IUserPayload = { id: user.id, role: user.role, email: user.email };
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    // Store hashed refresh token
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    const { password, refreshToken: rt, ...safeUser } = user.toObject();

    return { user: safeUser, accessToken, refreshToken };
  }
}

export const authService = new AuthService();
```

### Auth Routes
```typescript
// src/routes/auth.routes.ts
import { Router } from 'express';
import { register, login, refreshToken, logout, getMe } from '../controllers/auth.controller';
import { authenticate } from '../middleware/authenticate';
import { validate } from '../middleware/validate';
import { registerSchema, loginSchema } from '../validators/auth.validator';
import { authRateLimiter } from '../middleware/rateLimiter';

const router = Router();

router.post('/register', authRateLimiter, validate(registerSchema), register);
router.post('/login',    authRateLimiter, validate(loginSchema), login);
router.post('/refresh',  refreshToken);
router.post('/logout',   authenticate, logout);
router.get('/me',        authenticate, getMe);

export default router;
```

---

## 11. Authorization — RBAC

```typescript
// src/routes/product.routes.ts
import { Router } from 'express';
import * as productController from '../controllers/product.controller';
import { authenticate } from '../middleware/authenticate';
import { authorize } from '../middleware/authorize';
import { validate } from '../middleware/validate';
import { cache } from '../middleware/cache';
import { upload } from '../config/multer';
import { createProductSchema } from '../validators/product.validator';
import { UserRole } from '../types/user.types';

const router = Router();

// Public
router.get('/',    cache(300), productController.getProducts);
router.get('/:id', cache(3600), productController.getProduct);

// Sellers & Admins
router.post(
  '/',
  authenticate,
  authorize(UserRole.SELLER, UserRole.ADMIN),
  upload.array('images', 5),
  validate(createProductSchema),
  productController.createProduct
);

router.patch(
  '/:id',
  authenticate,
  authorize(UserRole.SELLER, UserRole.ADMIN),
  productController.updateProduct
);

router.delete(
  '/:id',
  authenticate,
  authorize(UserRole.SELLER, UserRole.ADMIN),
  productController.deleteProduct
);

export default router;
```

---

## 12. Redis Caching Layer

```typescript
// src/config/redis.ts
import { createClient, RedisClientType } from 'redis';
import { env } from './env';
import logger from '../utils/logger';

let redisClient: RedisClientType;

export const connectRedis = async (): Promise<void> => {
  redisClient = createClient({ url: env.REDIS_URL });

  redisClient.on('connect',  () => logger.info('Redis connected'));
  redisClient.on('error',    (err) => logger.error('Redis error:', err));
  redisClient.on('reconnecting', () => logger.warn('Redis reconnecting...'));

  await redisClient.connect();
};

export { redisClient };

// Typed Redis helper
export const redisHelper = {
  async get<T>(key: string): Promise<T | null> {
    const val = await redisClient.get(key);
    return val ? JSON.parse(val) as T : null;
  },

  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    const str = JSON.stringify(value);
    if (ttl) await redisClient.setEx(key, ttl, str);
    else await redisClient.set(key, str);
  },

  async del(...keys: string[]): Promise<void> {
    if (keys.length) await redisClient.del(keys);
  },

  async invalidatePattern(pattern: string): Promise<void> {
    const keys = await redisClient.keys(pattern);
    if (keys.length) await redisClient.del(keys);
  },
};
```

---

## 13. File Upload — Multer + Cloudinary

### Multer Config
```typescript
// src/config/multer.ts
import multer, { FileFilterCallback } from 'multer';
import { Request } from 'express';
import path from 'path';
import { AppError } from '../utils/AppError';

const ALLOWED_TYPES = /jpeg|jpg|png|gif|webp/;
const MAX_SIZE_MB = 5;

const fileFilter = (_req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ALLOWED_TYPES.test(ext) && ALLOWED_TYPES.test(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError('Only image files are allowed (jpeg, jpg, png, gif, webp)', 400));
  }
};

export const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: { fileSize: MAX_SIZE_MB * 1024 * 1024 },
});
```

### Cloudinary Utility
```typescript
// src/utils/cloudinary.ts
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import streamifier from 'streamifier';
import { env } from '../config/env';

cloudinary.config({
  cloud_name: env.CLOUDINARY_NAME,
  api_key:    env.CLOUDINARY_KEY,
  api_secret: env.CLOUDINARY_SECRET,
});

interface UploadResult {
  url: string;
  publicId: string;
}

export const uploadImage = (
  buffer: Buffer,
  folder: string = 'shopflow',
  options: Record<string, unknown> = {}
): Promise<UploadResult> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
        transformation: [{ quality: 'auto', fetch_format: 'auto' }],
        ...options,
      },
      (error, result: UploadApiResponse | undefined) => {
        if (error || !result) return reject(error ?? new Error('Upload failed'));
        resolve({ url: result.secure_url, publicId: result.public_id });
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

export const deleteImage = async (publicId: string): Promise<void> => {
  await cloudinary.uploader.destroy(publicId);
};

// Upload multiple images
export const uploadMultipleImages = async (
  files: Express.Multer.File[],
  folder: string
): Promise<UploadResult[]> => {
  return Promise.all(files.map((f) => uploadImage(f.buffer, folder)));
};
```

---

## 14. Payment — Stripe Integration

```typescript
// src/services/payment.service.ts
import Stripe from 'stripe';
import { env } from '../config/env';
import { AppError } from '../utils/AppError';
import prisma from '../config/postgres';
import { orderProducer } from '../events/producers/order.producer';

const stripe = new Stripe(env.STRIPE_SECRET_KEY, { apiVersion: '2024-04-10' });

export class PaymentService {
  async createPaymentIntent(
    orderId: number,
    amount: number,
    userId: number,
    currency: string = 'usd'
  ): Promise<string> {
    const intent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency,
      metadata: { orderId: String(orderId), userId: String(userId) },
      automatic_payment_methods: { enabled: true },
    });

    await prisma.payment.create({
      data: {
        orderId,
        userId,
        amount,
        currency,
        status: 'pending',
        stripeIntentId: intent.id,
      },
    });

    return intent.client_secret!;
  }

  async handleWebhook(rawBody: Buffer, signature: string): Promise<void> {
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(rawBody, signature, env.STRIPE_WEBHOOK_SECRET);
    } catch {
      throw new AppError('Invalid webhook signature', 400);
    }

    switch (event.type) {
      case 'payment_intent.succeeded': {
        const intent = event.data.object as Stripe.PaymentIntent;
        const orderId = Number(intent.metadata.orderId);

        await prisma.$transaction([
          prisma.payment.update({
            where: { stripeIntentId: intent.id },
            data: { status: 'paid', paidAt: new Date() },
          }),
          prisma.order.update({
            where: { id: orderId },
            data: { status: 'paid' },
          }),
        ]);

        // Publish event to Kafka → notification + inventory services
        await orderProducer.publishOrderPaid({
          orderId,
          userId: Number(intent.metadata.userId),
          amount: intent.amount / 100,
        });
        break;
      }

      case 'payment_intent.payment_failed': {
        const intent = event.data.object as Stripe.PaymentIntent;
        await prisma.payment.update({
          where: { stripeIntentId: intent.id },
          data: { status: 'failed' },
        });
        break;
      }
    }
  }

  async refund(stripeIntentId: string, amount?: number): Promise<Stripe.Refund> {
    const refund = await stripe.refunds.create({
      payment_intent: stripeIntentId,
      ...(amount && { amount: Math.round(amount * 100) }),
    });

    await prisma.payment.update({
      where: { stripeIntentId },
      data: { status: 'refunded' },
    });

    return refund;
  }
}

export const paymentService = new PaymentService();
```

---

## 15. Kafka Event Streaming

### Kafka Config
```typescript
// src/config/kafka.ts
import { Kafka, Producer, Consumer, logLevel } from 'kafkajs';
import { env } from './env';

const kafka = new Kafka({
  clientId: 'shopflow-api',
  brokers: env.KAFKA_BROKERS.split(','),
  logLevel: logLevel.WARN,
  retry: { initialRetryTime: 300, retries: 8 },
});

export const createProducer = (): Producer => kafka.producer({
  allowAutoTopicCreation: true,
  transactionTimeout: 30000,
});

export const createConsumer = (groupId: string): Consumer =>
  kafka.consumer({ groupId, allowAutoTopicCreation: true });

export default kafka;
```

### Order Event Producer
```typescript
// src/events/producers/order.producer.ts
import { Producer } from 'kafkajs';
import { createProducer } from '../../config/kafka';
import logger from '../../utils/logger';

export enum OrderTopic {
  ORDER_CREATED = 'order.created',
  ORDER_PAID    = 'order.paid',
  ORDER_SHIPPED = 'order.shipped',
  ORDER_CANCELLED = 'order.cancelled',
}

interface OrderCreatedEvent {
  orderId: number;
  userId: number;
  items: Array<{ productId: string; quantity: number }>;
  totalPrice: number;
}

interface OrderPaidEvent {
  orderId: number;
  userId: number;
  amount: number;
}

class OrderProducer {
  private producer: Producer;
  private connected = false;

  constructor() {
    this.producer = createProducer();
  }

  private async connect(): Promise<void> {
    if (!this.connected) {
      await this.producer.connect();
      this.connected = true;
    }
  }

  async publishOrderCreated(event: OrderCreatedEvent): Promise<void> {
    await this.connect();
    await this.producer.send({
      topic: OrderTopic.ORDER_CREATED,
      messages: [{
        key: String(event.orderId),
        value: JSON.stringify({ ...event, timestamp: new Date().toISOString() }),
      }],
    });
    logger.info(`[Kafka] Published ${OrderTopic.ORDER_CREATED}: order ${event.orderId}`);
  }

  async publishOrderPaid(event: OrderPaidEvent): Promise<void> {
    await this.connect();
    await this.producer.send({
      topic: OrderTopic.ORDER_PAID,
      messages: [{
        key: String(event.orderId),
        value: JSON.stringify({ ...event, timestamp: new Date().toISOString() }),
      }],
    });
    logger.info(`[Kafka] Published ${OrderTopic.ORDER_PAID}: order ${event.orderId}`);
  }

  async disconnect(): Promise<void> {
    await this.producer.disconnect();
    this.connected = false;
  }
}

export const orderProducer = new OrderProducer();
```

### Notification Consumer
```typescript
// src/events/consumers/notification.consumer.ts
import { createConsumer } from '../../config/kafka';
import { OrderTopic } from '../producers/order.producer';
import { emailQueue } from '../../jobs/email.queue';
import logger from '../../utils/logger';

export const startConsumers = async (): Promise<void> => {
  const consumer = createConsumer('notification-service');
  await consumer.connect();

  await consumer.subscribe({
    topics: [OrderTopic.ORDER_CREATED, OrderTopic.ORDER_PAID],
    fromBeginning: false,
  });

  await consumer.run({
    eachMessage: async ({ topic, message }) => {
      if (!message.value) return;
      const data = JSON.parse(message.value.toString());

      try {
        switch (topic) {
          case OrderTopic.ORDER_CREATED:
            await emailQueue.add('order-confirmation', {
              to: data.userEmail,
              orderId: data.orderId,
              template: 'order-created',
            });
            logger.info(`[Consumer] Order confirmation queued for order ${data.orderId}`);
            break;

          case OrderTopic.ORDER_PAID:
            await emailQueue.add('payment-success', {
              to: data.userEmail,
              orderId: data.orderId,
              amount: data.amount,
              template: 'payment-success',
            });
            logger.info(`[Consumer] Payment success email queued for order ${data.orderId}`);
            break;
        }
      } catch (err) {
        logger.error(`[Consumer] Failed to process message:`, err);
      }
    },
  });

  logger.info('[Kafka] Notification consumer started');
};
```

---

## 16. Bull Queue — Background Jobs

```typescript
// src/jobs/email.queue.ts
import Bull, { Job } from 'bull';
import { env } from '../config/env';
import { emailService } from '../services/email.service';
import logger from '../utils/logger';

interface EmailJobData {
  to: string;
  name?: string;
  orderId?: number;
  amount?: number;
  template: string;
}

export const emailQueue = new Bull<EmailJobData>('email', {
  redis: env.REDIS_URL,
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: 'exponential', delay: 3000 },
    removeOnComplete: 100,
    removeOnFail: 200,
  },
});

// Process jobs
emailQueue.process('welcome', 5, async (job: Job<EmailJobData>) => {
  await emailService.sendWelcomeEmail(job.data.to, job.data.name ?? '');
  logger.info(`[Queue] Welcome email sent to ${job.data.to}`);
});

emailQueue.process('order-confirmation', 10, async (job: Job<EmailJobData>) => {
  await emailService.sendOrderConfirmation(job.data.to, job.data.orderId!);
  logger.info(`[Queue] Order confirmation sent for order ${job.data.orderId}`);
});

emailQueue.process('payment-success', 10, async (job: Job<EmailJobData>) => {
  await emailService.sendPaymentSuccess(job.data.to, job.data.orderId!, job.data.amount!);
});

// Events
emailQueue.on('failed', (job, err) => {
  logger.error(`[Queue] Email job ${job.id} failed (attempt ${job.attemptsMade}):`, err.message);
});

emailQueue.on('stalled', (job) => {
  logger.warn(`[Queue] Email job ${job.id} stalled`);
});
```

---

## 17. Socket.io — Real-Time Notifications

```typescript
// src/sockets/index.ts
import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';
import { verifyAccessToken } from '../utils/jwt';
import { UserModel } from '../models/User.model';
import { env } from '../config/env';
import logger from '../utils/logger';

let io: Server;

export const initSocket = (httpServer: HttpServer): Server => {
  io = new Server(httpServer, {
    cors: { origin: env.CORS_ORIGINS.split(','), credentials: true },
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  // Redis adapter for horizontal scaling (multi-instance)
  const pubClient = createClient({ url: env.REDIS_URL });
  const subClient = pubClient.duplicate();
  Promise.all([pubClient.connect(), subClient.connect()]).then(() => {
    io.adapter(createAdapter(pubClient, subClient));
    logger.info('[Socket.io] Redis adapter connected');
  });

  // Auth middleware
  io.use(async (socket: Socket, next) => {
    const token = socket.handshake.auth?.token as string;
    if (!token) return next(new Error('Authentication required'));

    try {
      const decoded = verifyAccessToken(token);
      const user = await UserModel.findById(decoded.id).lean();
      if (!user) return next(new Error('User not found'));
      (socket as any).user = user;
      next();
    } catch {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket: Socket) => {
    const user = (socket as any).user;
    logger.info(`[Socket] Connected: ${user.name} (${socket.id})`);

    // Join personal room for targeted notifications
    socket.join(`user:${user._id}`);

    // Join order tracking room
    socket.on('track-order', (orderId: string) => {
      socket.join(`order:${orderId}`);
    });

    socket.on('leave-order', (orderId: string) => {
      socket.leave(`order:${orderId}`);
    });

    socket.on('disconnect', () => {
      logger.info(`[Socket] Disconnected: ${user.name}`);
    });
  });

  return io;
};

// Emit helpers
export const emitToUser = (userId: string, event: string, data: unknown): void => {
  io?.to(`user:${userId}`).emit(event, data);
};

export const emitToOrder = (orderId: string, event: string, data: unknown): void => {
  io?.to(`order:${orderId}`).emit(event, data);
};

export const broadcastToAll = (event: string, data: unknown): void => {
  io?.emit(event, data);
};
```

### Using Socket Emit in Controller
```typescript
// In order.service.ts — emit real-time status update
import { emitToUser, emitToOrder } from '../sockets';

async updateOrderStatus(orderId: number, status: string): Promise<void> {
  const order = await prisma.order.update({
    where: { id: orderId },
    data: { status },
    include: { user: true },
  });

  // Real-time update to the customer
  emitToUser(String(order.userId), 'order:status-update', {
    orderId, status, updatedAt: new Date(),
  });

  emitToOrder(String(orderId), 'order:status-update', { orderId, status });
}
```

---

## 18. API Gateway with TypeScript

```typescript
// src/gateway/app.ts
import express, { Application, Request, Response, NextFunction } from 'express';
import { createProxyMiddleware, Options } from 'http-proxy-middleware';
import helmet from 'helmet';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import rateLimit from 'express-rate-limit';
import { verifyAccessToken } from '../utils/jwt';
import logger from '../utils/logger';

const app: Application = express();
app.use(helmet());
app.use(cors());

// Services map
const SERVICES: Record<string, string> = {
  users:    process.env.USER_SERVICE_URL    ?? 'http://user-service:3001',
  products: process.env.PRODUCT_SERVICE_URL ?? 'http://product-service:3002',
  orders:   process.env.ORDER_SERVICE_URL   ?? 'http://order-service:3003',
  payments: process.env.PAYMENT_SERVICE_URL ?? 'http://payment-service:3004',
};

// Correlation ID
app.use((req: Request, res: Response, next: NextFunction) => {
  const id = (req.headers['x-correlation-id'] as string) ?? uuidv4();
  req.headers['x-correlation-id'] = id;
  res.setHeader('x-correlation-id', id);
  next();
});

// Rate limit
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 500 }));

// Auth middleware — validates JWT and forwards user info as headers
const gatewayAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) { res.status(401).json({ error: 'Unauthorized' }); return; }
  try {
    const decoded = verifyAccessToken(token);
    req.headers['x-user-id']   = decoded.id;
    req.headers['x-user-role'] = decoded.role;
    req.headers['x-user-email'] = decoded.email;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

const proxyOptions = (target: string): Options => ({
  target,
  changeOrigin: true,
  on: {
    proxyReq: (proxyReq, req) => {
      logger.info(`[Gateway] ${req.method} ${req.url} → ${target}`);
    },
    error: (_err, _req, res) => {
      (res as Response).status(502).json({ error: 'Service unavailable' });
    },
  },
});

// Public routes
app.use('/api/v1/auth',     createProxyMiddleware(proxyOptions(SERVICES.users)));
app.use('/api/v1/products', createProxyMiddleware(proxyOptions(SERVICES.products)));

// Protected routes
app.use('/api/v1/users',    gatewayAuth, createProxyMiddleware(proxyOptions(SERVICES.users)));
app.use('/api/v1/orders',   gatewayAuth, createProxyMiddleware(proxyOptions(SERVICES.orders)));
app.use('/api/v1/payments', gatewayAuth, createProxyMiddleware(proxyOptions(SERVICES.payments)));

// Health
app.get('/health', async (_req, res) => {
  const checks = await Promise.allSettled(
    Object.entries(SERVICES).map(([name, url]) =>
      fetch(`${url}/health`).then(() => ({ name, status: 'up' }))
    )
  );
  const services = checks.map((c, i) => ({
    name: Object.keys(SERVICES)[i],
    status: c.status === 'fulfilled' ? 'up' : 'down',
  }));
  const healthy = services.every((s) => s.status === 'up');
  res.status(healthy ? 200 : 503).json({ gateway: 'up', services });
});

export default app;
```

---

## 19. Microservice: Order Service

```typescript
// order-service/src/services/order.service.ts
import prisma from '../config/postgres';
import { CreateOrderDTO } from '../types/order.types';
import { AppError } from '../utils/AppError';
import { orderProducer } from '../events/producers/order.producer';
import { emitToUser } from '../sockets';

export class OrderService {
  async createOrder(dto: CreateOrderDTO, userId: number): Promise<any> {
    // Calculate total (in real-world: fetch prices from product service)
    const total = dto.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = total > 100 ? 0 : 9.99;
    const tax = total * 0.08;

    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          userId,
          totalPrice: total + shipping + tax,
          status: 'pending',
          items: {
            create: dto.items.map((item) => ({
              productId: item.productId,
              name:      item.name,
              price:     item.price,
              quantity:  item.quantity,
            })),
          },
        },
        include: { items: true },
      });
      return newOrder;
    });

    // Publish event → inventory, notification services
    await orderProducer.publishOrderCreated({
      orderId:    order.id,
      userId,
      items:      dto.items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
      totalPrice: order.totalPrice,
    });

    // Real-time notification to the user
    emitToUser(String(userId), 'order:created', { orderId: order.id, status: 'pending' });

    return order;
  }

  async getUserOrders(userId: number, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where: { userId },
        include: { items: true, payment: true },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.order.count({ where: { userId } }),
    ]);
    return { orders, meta: { page, limit, total, pages: Math.ceil(total / limit) } };
  }

  async cancelOrder(orderId: number, userId: number): Promise<void> {
    const order = await prisma.order.findFirst({ where: { id: orderId, userId } });
    if (!order) throw new AppError('Order not found', 404);
    if (!['pending', 'processing'].includes(order.status)) {
      throw new AppError('Order cannot be cancelled at this stage', 400);
    }
    await prisma.order.update({ where: { id: orderId }, data: { status: 'cancelled' } });
    emitToUser(String(userId), 'order:cancelled', { orderId });
  }
}
```

---

## 20. Error Handling & Custom AppError

```typescript
// src/utils/AppError.ts
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly status: 'fail' | 'error';
  public readonly isOperational: boolean;
  public readonly code?: string;

  constructor(message: string, statusCode: number, code?: string) {
    super(message);
    this.statusCode = statusCode;
    this.status = statusCode >= 400 && statusCode < 500 ? 'fail' : 'error';
    this.isOperational = true;
    this.code = code;
    Error.captureStackTrace(this, this.constructor);
  }
}
```

```typescript
// src/middleware/errorHandler.ts
import { Request, Response, NextFunction } from 'express';
import { Error as MongooseError } from 'mongoose';
import { ZodError } from 'zod';
import { AppError } from '../utils/AppError';
import logger from '../utils/logger';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  let error = err instanceof AppError
    ? err
    : new AppError('Internal Server Error', 500);

  // Mongoose duplicate key
  if ((err as any).code === 11000) {
    const field = Object.keys((err as any).keyValue ?? {})[0] ?? 'field';
    error = new AppError(`${field} already exists`, 409, 'DUPLICATE_KEY');
  }

  // Mongoose validation
  if (err instanceof MongooseError.ValidationError) {
    const messages = Object.values(err.errors).map((e) => e.message).join(', ');
    error = new AppError(messages, 400, 'VALIDATION_ERROR');
  }

  // Mongoose cast error (invalid ObjectId)
  if (err instanceof MongooseError.CastError) {
    error = new AppError(`Invalid ${err.path}: ${err.value}`, 400, 'CAST_ERROR');
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') error = new AppError('Invalid token', 401);
  if (err.name === 'TokenExpiredError') error = new AppError('Token expired', 401);

  // Zod validation
  if (err instanceof ZodError) {
    const errors = err.flatten().fieldErrors;
    res.status(400).json({ success: false, errors });
    return;
  }

  logger.error(`[${req.method}] ${req.path} — ${error.statusCode}: ${error.message}`, {
    correlationId: req.correlationId,
    stack: error.stack,
  });

  const payload: Record<string, unknown> = {
    success: false,
    error:   error.message,
    ...(error.code && { code: error.code }),
  };

  if (process.env.NODE_ENV === 'development') {
    payload.stack = error.stack;
  }

  res.status(error.statusCode).json(payload);
};
```

---

## 21. Validation with Zod

```typescript
// src/validators/auth.validator.ts
import { z } from 'zod';

export const registerSchema = z.object({
  name:     z.string().min(2).max(100).trim(),
  email:    z.string().email().toLowerCase(),
  password: z
    .string()
    .min(8)
    .regex(/[A-Z]/,  'Must contain at least one uppercase letter')
    .regex(/[0-9]/,  'Must contain at least one number')
    .regex(/[!@#$%^&*]/, 'Must contain at least one special character'),
});

export const loginSchema = z.object({
  email:    z.string().email(),
  password: z.string().min(1, 'Password required'),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput    = z.infer<typeof loginSchema>;
```

```typescript
// src/validators/product.validator.ts
import { z } from 'zod';

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const createProductSchema = z.object({
  name:        z.string().min(2).max(200).trim(),
  description: z.string().min(10).max(2000).trim(),
  price:       z.number().positive().multipleOf(0.01),
  category:    z.string().regex(objectIdRegex, 'Invalid category ID'),
  stock:       z.number().int().min(0),
  tags:        z.array(z.string().trim().toLowerCase()).max(10).optional(),
});

export const productQuerySchema = z.object({
  page:     z.string().transform(Number).pipe(z.number().int().positive()).optional(),
  limit:    z.string().transform(Number).pipe(z.number().int().min(1).max(100)).optional(),
  sort:     z.string().optional(),
  category: z.string().regex(objectIdRegex).optional(),
  minPrice: z.string().transform(Number).pipe(z.number().min(0)).optional(),
  maxPrice: z.string().transform(Number).pipe(z.number().min(0)).optional(),
  search:   z.string().max(100).optional(),
});
```

---

## 22. Logging — Winston + Morgan

```typescript
// src/utils/logger.ts
import winston from 'winston';
import path from 'path';
import { env } from '../config/env';

const logDir = path.join(process.cwd(), 'logs');

const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
    return `${timestamp} [${level}]: ${message}${metaStr}`;
  })
);

const logger = winston.createLogger({
  level: env.LOG_LEVEL,
  format: logFormat,
  defaultMeta: { service: 'shopflow-api' },
  transports: [
    new winston.transports.Console({ format: consoleFormat }),
    new winston.transports.File({
      filename: path.join(logDir, 'error.log'),
      level: 'error',
      maxsize: 10 * 1024 * 1024, // 10MB
      maxFiles: 5,
    }),
    new winston.transports.File({
      filename: path.join(logDir, 'combined.log'),
      maxsize: 20 * 1024 * 1024,
      maxFiles: 10,
    }),
  ],
});

export default logger;
```

---

## 23. Rate Limiting & Security

```typescript
// src/middleware/rateLimiter.ts
import rateLimit from 'express-rate-limit';
import { Request, Response } from 'express';

const rateLimitResponse = (_req: Request, res: Response) => {
  res.status(429).json({
    success: false,
    error: 'Too many requests. Please try again later.',
    code: 'RATE_LIMIT_EXCEEDED',
  });
};

export const globalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitResponse,
});

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  skipSuccessfulRequests: true,
  handler: rateLimitResponse,
});

export const uploadRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50,
  handler: rateLimitResponse,
});
```

---

## 24. Testing with Jest + Supertest

### Jest Config
```typescript
// jest.config.ts
import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  testMatch: ['**/*.test.ts'],
  collectCoverageFrom: ['src/**/*.ts', '!src/types/**'],
  coverageThreshold: { global: { branches: 70, functions: 80, lines: 80 } },
  setupFilesAfterFramework: ['<rootDir>/tests/setup.ts'],
  globalSetup:    '<rootDir>/tests/globalSetup.ts',
  globalTeardown: '<rootDir>/tests/globalTeardown.ts',
};
export default config;
```

### Test Setup
```typescript
// tests/setup.ts
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  await Promise.all(Object.values(collections).map((c) => c.deleteMany({})));
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});
```

### Auth Integration Test
```typescript
// tests/integration/auth.test.ts
import request from 'supertest';
import app from '../../src/app';

describe('Auth API', () => {
  const validUser = {
    name: 'Test User',
    email: 'test@shopflow.com',
    password: 'Password@123',
  };

  describe('POST /api/v1/auth/register', () => {
    it('should register a new user and return tokens', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send(validUser);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('accessToken');
      expect(res.body.data).toHaveProperty('refreshToken');
      expect(res.body.data.user).not.toHaveProperty('password');
    });

    it('should return 400 for weak password', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({ ...validUser, password: '123' });

      expect(res.status).toBe(400);
      expect(res.body.errors).toBeDefined();
    });

    it('should return 400 for duplicate email', async () => {
      await request(app).post('/api/v1/auth/register').send(validUser);
      const res = await request(app).post('/api/v1/auth/register').send(validUser);

      expect(res.status).toBe(400);
    });
  });

  describe('POST /api/v1/auth/login', () => {
    beforeEach(async () => {
      await request(app).post('/api/v1/auth/register').send(validUser);
    });

    it('should login with valid credentials', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: validUser.email, password: validUser.password });

      expect(res.status).toBe(200);
      expect(res.body.data.accessToken).toBeDefined();
    });

    it('should return 401 for wrong password', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: validUser.email, password: 'WrongPass@1' });

      expect(res.status).toBe(401);
    });
  });
});
```

### Unit Test — ProductService
```typescript
// tests/unit/product.service.test.ts
import { productService } from '../../src/services/product.service';
import { ProductModel } from '../../src/models/Product.model';
import { AppError } from '../../src/utils/AppError';

jest.mock('../../src/models/Product.model');
jest.mock('../../src/config/redis', () => ({
  redisClient: { get: jest.fn().mockResolvedValue(null), setEx: jest.fn() },
}));

describe('ProductService.getProductById', () => {
  it('should return product when found', async () => {
    const mockProduct = { _id: 'abc123', name: 'Laptop', price: 999 };
    (ProductModel.findById as jest.Mock).mockReturnValue({
      populate: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue(mockProduct),
    });

    const product = await productService.getProductById('abc123');
    expect(product).toEqual(mockProduct);
  });

  it('should throw 404 when product not found', async () => {
    (ProductModel.findById as jest.Mock).mockReturnValue({
      populate: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue(null),
    });

    await expect(productService.getProductById('notfound')).rejects.toThrow(
      new AppError('Product not found', 404)
    );
  });
});
```

---

## 25. Dockerizing the TypeScript App

### Dockerfile (Multi-stage)
```dockerfile
# Stage 1: Builder
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production=false

COPY tsconfig.json ./
COPY src ./src
COPY prisma ./prisma

RUN npx prisma generate
RUN npm run build

# Stage 2: Production
FROM node:20-alpine AS production
WORKDIR /app

RUN addgroup -g 1001 -S nodejs && adduser -S nodeuser -u 1001

COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY prisma ./prisma

USER nodeuser
EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost:5000/health || exit 1

CMD ["node", "dist/server.js"]
```

### docker-compose.yml
```yaml
version: '3.8'

services:
  api:
    build:
      context: .
      target: production
    ports: ["5000:5000"]
    env_file: .env
    depends_on:
      mongo:    { condition: service_healthy }
      postgres: { condition: service_healthy }
      redis:    { condition: service_healthy }
    restart: unless-stopped
    networks: [shopflow]

  mongo:
    image: mongo:7
    volumes: [mongo_data:/data/db]
    healthcheck:
      test: ["CMD", "mongosh", "--eval", "db.adminCommand('ping')"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks: [shopflow]

  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB:       shopflow
      POSTGRES_USER:     postgres
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    volumes: [postgres_data:/var/lib/postgresql/data]
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks: [shopflow]

  redis:
    image: redis:7-alpine
    command: redis-server --appendonly yes --requirepass ${REDIS_PASSWORD}
    volumes: [redis_data:/data]
    healthcheck:
      test: ["CMD", "redis-cli", "--pass", "${REDIS_PASSWORD}", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks: [shopflow]

  kafka:
    image: confluentinc/cp-kafka:7.5.0
    environment:
      KAFKA_BROKER_ID: 1
      KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181
      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://kafka:9092
      KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 1
    depends_on: [zookeeper]
    networks: [shopflow]

  zookeeper:
    image: confluentinc/cp-zookeeper:7.5.0
    environment:
      ZOOKEEPER_CLIENT_PORT: 2181
    networks: [shopflow]

  nginx:
    image: nginx:alpine
    ports: ["80:80", "443:443"]
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./certs:/etc/nginx/certs:ro
    depends_on: [api]
    networks: [shopflow]

networks:
  shopflow:
    driver: bridge

volumes:
  mongo_data:
  postgres_data:
  redis_data:
```

---

## 26. CI/CD Pipeline & PM2 Deployment

### GitHub Actions CI/CD
```yaml
# .github/workflows/deploy.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    services:
      mongo:
        image: mongo:7
        ports: ["27017:27017"]
      redis:
        image: redis:7
        ports: ["6379:6379"]

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Type check
        run: npx tsc --noEmit

      - name: Run tests
        run: npm test -- --coverage
        env:
          NODE_ENV: test
          MONGO_URI: mongodb://localhost:27017/shopflow_test
          REDIS_URL: redis://localhost:6379
          JWT_SECRET: test-secret-key-minimum-32-characters-long
          JWT_REFRESH_SECRET: test-refresh-secret-32-characters!!

      - name: Upload coverage
        uses: codecov/codecov-action@v3

  build-and-push:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4

      - name: Login to Docker Hub
        uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}

      - name: Build and push
        uses: docker/build-push-action@v5
        with:
          context: .
          target: production
          push: true
          tags: |
            shopflow/api:latest
            shopflow/api:${{ github.sha }}

  deploy:
    needs: build-and-push
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Deploy to server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            cd /app/shopflow
            docker pull shopflow/api:latest
            docker-compose up -d --no-deps api
            docker system prune -f
```

### PM2 Ecosystem Config
```typescript
// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: 'shopflow-api',
      script: 'dist/server.js',
      instances: 'max',
      exec_mode: 'cluster',
      max_memory_restart: '1G',
      watch: false,
      error_file: 'logs/pm2-error.log',
      out_file:   'logs/pm2-out.log',
      log_file:   'logs/pm2-combined.log',
      merge_logs: true,
      env: { NODE_ENV: 'development' },
      env_production: { NODE_ENV: 'production', PORT: 5000 },
      // Graceful reload
      kill_timeout: 10000,
      wait_ready: true,
      listen_timeout: 10000,
    },
  ],
};
```

---

## 27. Production Checklist & Architecture

### Full Architecture (10k–100k Clients)

```
                    ┌──────────────────────────────────────┐
                    │         CDN (Cloudflare)              │
                    │  Static assets, DDoS protection       │
                    └────────────────┬─────────────────────┘
                                     │ HTTPS
                    ┌────────────────▼─────────────────────┐
                    │      Nginx Load Balancer              │
                    │  SSL Termination + Rate Limiting      │
                    └───────┬──────────────────┬───────────┘
                            │                  │
              ┌─────────────▼──────┐  ┌────────▼─────────────┐
              │  API Gateway       │  │  API Gateway          │
              │  (Node + TS) #1    │  │  (Node + TS) #2       │
              └─────────┬──────────┘  └──────────┬────────────┘
                        │                         │
        ┌───────────────┼─────────────────────────┼────────────────────┐
        │               │                         │                    │
┌───────▼──────┐  ┌─────▼──────────┐  ┌──────────▼────────┐  ┌───────▼──────────┐
│  User        │  │  Product        │  │  Order             │  │  Payment         │
│  Service     │  │  Service        │  │  Service           │  │  Service         │
│  (PM2/Docker)│  │  (PM2/Docker)   │  │  (PM2/Docker)      │  │  (PM2/Docker)    │
└───────┬──────┘  └──────┬──────────┘  └──────────┬─────────┘  └────────┬─────────┘
        │                │                         │                     │
        │         ┌──────▼──────┐           ┌──────▼──────┐             │
        │         │  Redis      │           │  Kafka       │             │
        │         │  Cluster    │           │  Cluster     │             │
        │         │  (Cache +   │           │  (Events)    │             │
        │         │   Sessions) │           └─────────────┘             │
        │         └─────────────┘                                        │
        │                                                                 │
┌───────▼─────────────┐                                    ┌─────────────▼──────┐
│  MongoDB            │                                    │  PostgreSQL        │
│  ReplicaSet         │                                    │  (Orders/Payments) │
│  (Users/Products)   │                                    │  Primary + Replica │
└─────────────────────┘                                    └────────────────────┘

External Services:
  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
  │  Cloudinary  │  │  Stripe      │  │  SendGrid    │  │  Sentry      │
  │  (Images)    │  │  (Payments)  │  │  (Emails)    │  │  (Errors)    │
  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘
```

### Production Checklist

```
Security:
✅ Helmet.js (HTTP security headers)
✅ CORS whitelist (not *)
✅ Rate limiting (global + per-route)
✅ Input validation (Zod on all routes)
✅ Mongoose sanitize (NoSQL injection)
✅ Parameterized SQL queries (Prisma)
✅ Passwords hashed (bcrypt, 12 rounds)
✅ JWT: short-lived (15m) + refresh token rotation
✅ httpOnly + sameSite + secure cookies
✅ Secrets in env vars, never committed
✅ HTTPS only in production

Performance:
✅ Redis caching on GET endpoints
✅ MongoDB indexes on queried fields
✅ Prisma connection pooling
✅ PM2 cluster mode (all CPU cores)
✅ gzip compression
✅ Pagination (never return all records)
✅ lean() on Mongoose read queries
✅ Background jobs for emails/images
✅ Kafka for async cross-service events

Reliability:
✅ Graceful shutdown (SIGTERM/SIGINT)
✅ Health check endpoints
✅ Circuit breaker (opossum)
✅ Retry logic with exponential backoff
✅ Global error handler
✅ Unhandled rejection / exception handlers
✅ Bull queue retry on job failure

Observability:
✅ Winston structured logging
✅ Morgan HTTP access logs
✅ Correlation IDs across services
✅ Sentry (error tracking)
✅ PM2 metrics / process monitoring
✅ Docker health checks

Testing:
✅ Unit tests (services, utils)
✅ Integration tests (Supertest + MongoMemoryServer)
✅ ≥ 80% code coverage
✅ CI runs tests on every PR

Deployment:
✅ Multi-stage Dockerfile
✅ .dockerignore
✅ GitHub Actions CI/CD
✅ Environment-specific configs
✅ Database migrations (Prisma)
✅ Zero-downtime deploys (PM2 reload)
```

### TypeScript Specific Best Practices

| Practice | Example |
|---|---|
| **Strict mode** | `"strict": true` in tsconfig |
| **No `any`** | Use `unknown` and type guards instead |
| **Typed env** | Zod-validated `env` object |
| **Typed request** | Augment `Express.Request` with `req.user` |
| **Generic responses** | `ApiResponse<T>` for all endpoints |
| **Enum for roles** | `UserRole.ADMIN` not `'admin'` strings |
| **DTO classes/types** | `CreateProductDTO`, `LoginDTO` |
| **Service classes** | Testable, injectable, mockable |
| **Return types** | Always declare return types on async functions |
| **Readonly** | `readonly` on immutable config objects |

---

> 💡 **Senior Interview Tip**: When asked "how would you scale this to 100k users?", mention:
> 1. **Horizontal scaling** — multiple Node instances via PM2 cluster or Kubernetes
> 2. **Redis** — shared cache/sessions across instances
> 3. **Kafka** — decouple services, handle traffic spikes asynchronously
> 4. **DB read replicas** — separate read/write workloads
> 5. **CDN** — offload static assets
> 6. **Circuit breaker** — prevent cascading failures under load
