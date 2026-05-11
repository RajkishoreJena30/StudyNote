# 🚀 Production-Grade Backend — Node.js, Express, MongoDB, PostgreSQL & Beyond
### Senior MERN Stack Developer Interview Guide

---

## 📚 Table of Contents

1. [Node.js Core Concepts](#1-nodejs-core-concepts)
2. [Express.js Architecture](#2-expressjs-architecture)
3. [REST API Design & Best Practices](#3-rest-api-design--best-practices)
4. [Controllers & Service Layer Pattern](#4-controllers--service-layer-pattern)
5. [Middleware — Custom, Built-in & Third-party](#5-middleware--custom-built-in--third-party)
6. [Authentication — JWT, OAuth, Passport](#6-authentication--jwt-oauth-passport)
7. [Sessions & Cookies](#7-sessions--cookies)
8. [Authorization — RBAC & ABAC](#8-authorization--rbac--abac)
9. [MongoDB & Mongoose](#9-mongodb--mongoose)
10. [PostgreSQL with Node.js (pg / Sequelize / Prisma)](#10-postgresql-with-nodejs)
11. [Caching with Redis](#11-caching-with-redis)
12. [Message Queues — Bull, RabbitMQ, Kafka](#12-message-queues--bull-rabbitmq-kafka)
13. [Kafka Deep Dive](#13-kafka-deep-dive)
14. [File Upload — Multer, Cloudinary, S3](#14-file-upload--multer-cloudinary-s3)
15. [WebSockets & Socket.io](#15-websockets--socketio)
16. [MQTT — IoT Messaging Protocol](#16-mqtt--iot-messaging-protocol)
17. [Payment Integration — Stripe, Razorpay](#17-payment-integration--stripe-razorpay)
18. [Rate Limiting & Throttling](#18-rate-limiting--throttling)
19. [Security Best Practices](#19-security-best-practices)
20. [Error Handling & Logging](#20-error-handling--logging)
21. [Environment Config & Secrets Management](#21-environment-config--secrets-management)
22. [Validation — Joi, Zod, express-validator](#22-validation--joi-zod-express-validator)
23. [Testing — Unit, Integration, E2E](#23-testing--unit-integration-e2e)
24. [Performance Optimization](#24-performance-optimization)
25. [Microservice Architecture](#25-microservice-architecture)
26. [API Gateway](#26-api-gateway)
27. [Production Architecture Diagram](#27-production-architecture-diagram)
28. [Quick Revision Cheat Sheet](#28-quick-revision-cheat-sheet)

---

## 1. Node.js Core Concepts

### What is Node.js?
Node.js is a **runtime environment** built on Chrome's V8 JavaScript engine that allows JavaScript to run on the server side.

### Key Concepts

| Concept | Description |
|---|---|
| **Event Loop** | Single-threaded loop that processes async callbacks |
| **Non-blocking I/O** | Delegates I/O ops to OS/libuv, doesn't block the thread |
| **Libuv** | C++ library that handles async I/O, thread pool, timers |
| **Thread Pool** | Default 4 threads for CPU-intensive tasks (crypto, fs, dns) |
| **Event Emitter** | Observer pattern for emitting and listening to events |
| **Streams** | Readable, Writable, Duplex, Transform for handling large data |
| **Cluster Module** | Spawn multiple worker processes to use multi-core CPUs |
| **Worker Threads** | True multi-threading for CPU-heavy work in Node.js |

### Event Loop Phases

```
   ┌─────────────────────────────────────────────────────┐
   │                    Event Loop                        │
   │                                                      │
   │  ┌──────────┐  ┌──────────┐  ┌──────────────────┐  │
   │  │  timers  │→ │ pending  │→ │  idle, prepare   │  │
   │  │setTimeout│  │callbacks │  │                  │  │
   │  └──────────┘  └──────────┘  └──────────────────┘  │
   │        ↓                                            │
   │  ┌──────────┐  ┌──────────┐  ┌──────────────────┐  │
   │  │  close   │← │ check    │← │      poll        │  │
   │  │callbacks │  │setImmed. │  │  (I/O callbacks) │  │
   │  └──────────┘  └──────────┘  └──────────────────┘  │
   └─────────────────────────────────────────────────────┘
         ↑ microtasks (Promise.then, queueMicrotask)
              run after each phase
```

### Event Loop Example
```js
console.log('1 - sync');

setTimeout(() => console.log('2 - setTimeout'), 0);
setImmediate(() => console.log('3 - setImmediate'));

Promise.resolve().then(() => console.log('4 - microtask'));

console.log('5 - sync');

// Output: 1, 5, 4, 2, 3
```

### Streams Example (Memory-Efficient File Processing)
```js
const fs = require('fs');
const zlib = require('zlib');

// Process 10GB file without loading it in memory
fs.createReadStream('large-file.csv')
  .pipe(zlib.createGzip())
  .pipe(fs.createWriteStream('large-file.csv.gz'))
  .on('finish', () => console.log('Done!'));
```

### Cluster vs Worker Threads

```
Cluster:                        Worker Threads:
┌─────────────────────┐         ┌─────────────────────┐
│  Master Process     │         │   Main Thread        │
│  ┌───┐ ┌───┐ ┌───┐ │         │  ┌────────────────┐  │
│  │W1 │ │W2 │ │W3 │ │         │  │ Worker Thread 1│  │
│  └───┘ └───┘ └───┘ │         │  │ Worker Thread 2│  │
│  Each = full process│         │  └────────────────┘  │
│  Ideal: HTTP serving│         │  Shared ArrayBuffer  │
└─────────────────────┘         │  Ideal: CPU tasks    │
                                └─────────────────────┘
```

---

## 2. Express.js Architecture

### Project Folder Structure (Production Grade)

```
project/
├── src/
│   ├── config/
│   │   ├── db.js            # DB connections
│   │   ├── redis.js         # Redis client
│   │   └── env.js           # Environment variables
│   ├── controllers/         # Route handlers (thin layer)
│   ├── services/            # Business logic
│   ├── models/              # Mongoose / Sequelize models
│   ├── routes/              # Express routers
│   ├── middleware/          # Custom middleware
│   ├── validators/          # Input validation schemas
│   ├── utils/               # Helpers (logger, mailer, etc.)
│   ├── jobs/                # Background jobs / queues
│   ├── sockets/             # Socket.io handlers
│   └── app.js               # Express app setup
├── tests/
├── .env
├── .env.example
├── Dockerfile
├── package.json
└── server.js                # Entry point (listen)
```

### App Setup (app.js)
```js
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();

// Security
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logging
app.use(morgan('combined'));

// Rate limiting
app.use('/api/', rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

// Routes
app.use('/api/v1/auth', require('./routes/auth'));
app.use('/api/v1/users', require('./routes/users'));
app.use('/api/v1/products', require('./routes/products'));

// 404
app.use((req, res) => res.status(404).json({ message: 'Route not found' }));

// Global error handler (must be last)
app.use(errorHandler);

module.exports = app;
```

### server.js (Entry Point)
```js
const app = require('./src/app');
const connectDB = require('./src/config/db');

const PORT = process.env.PORT || 5000;

const start = async () => {
  await connectDB();
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};

start();
```

---

## 3. REST API Design & Best Practices

### RESTful Conventions

| HTTP Method | Endpoint | Action |
|---|---|---|
| GET | `/api/v1/users` | Get all users |
| GET | `/api/v1/users/:id` | Get user by ID |
| POST | `/api/v1/users` | Create user |
| PUT | `/api/v1/users/:id` | Full update |
| PATCH | `/api/v1/users/:id` | Partial update |
| DELETE | `/api/v1/users/:id` | Delete user |

### API Response Structure
```js
// Success
{
  "success": true,
  "data": { "user": { ... } },
  "message": "User fetched successfully",
  "meta": { "page": 1, "limit": 10, "total": 100 }
}

// Error
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Email is required",
    "details": [...]
  }
}
```

### Versioning Strategy
```
/api/v1/users   ← current stable
/api/v2/users   ← new version (breaking changes)
```

### Pagination, Filtering & Sorting
```js
// GET /api/v1/products?page=2&limit=10&sort=-price&category=shoes&minPrice=100

const getProducts = async (req, res) => {
  const { page = 1, limit = 10, sort = '-createdAt', ...filters } = req.query;

  const query = buildQuery(filters); // parse filters
  const skip = (page - 1) * limit;

  const [products, total] = await Promise.all([
    Product.find(query).sort(sort).skip(skip).limit(+limit),
    Product.countDocuments(query),
  ]);

  res.json({
    success: true,
    data: products,
    meta: { page: +page, limit: +limit, total, pages: Math.ceil(total / limit) },
  });
};
```

---

## 4. Controllers & Service Layer Pattern

### Separation of Concerns

```
Request → Router → Controller → Service → Model/DB → Response
                       ↓
                  Validation
                  Auth Check
```

### Controller (Thin Layer)
```js
// controllers/userController.js
const userService = require('../services/userService');
const { asyncHandler } = require('../utils/asyncHandler');

exports.getUser = asyncHandler(async (req, res) => {
  const user = await userService.getUserById(req.params.id);
  res.status(200).json({ success: true, data: user });
});

exports.createUser = asyncHandler(async (req, res) => {
  const user = await userService.createUser(req.body);
  res.status(201).json({ success: true, data: user });
});
```

### Service Layer (Business Logic)
```js
// services/userService.js
const User = require('../models/User');
const { AppError } = require('../utils/AppError');

exports.getUserById = async (id) => {
  const user = await User.findById(id).select('-password');
  if (!user) throw new AppError('User not found', 404);
  return user;
};

exports.createUser = async (data) => {
  const existing = await User.findOne({ email: data.email });
  if (existing) throw new AppError('Email already in use', 400);
  return User.create(data);
};
```

### AsyncHandler Utility
```js
// utils/asyncHandler.js
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = { asyncHandler };
```

---

## 5. Middleware — Custom, Built-in & Third-party

### Middleware Flow

```
Request
   │
   ▼
[helmet]         ← Security headers
[cors]           ← Cross-origin
[morgan]         ← Logging
[express.json]   ← Body parsing
[rateLimiter]    ← Throttle
[authenticate]   ← JWT verify
[authorize]      ← Role check
[validate]       ← Input schema
   │
   ▼
Controller
   │
   ▼
[errorHandler]   ← Global error middleware
   │
   ▼
Response
```

### Custom Auth Middleware
```js
// middleware/authenticate.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { AppError } = require('../utils/AppError');

const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Bearer <token>
  if (!token) return next(new AppError('No token provided', 401));

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) return next(new AppError('User not found', 401));
    next();
  } catch (err) {
    next(new AppError('Invalid or expired token', 401));
  }
};

module.exports = authenticate;
```

### Role-Based Middleware
```js
// middleware/authorize.js
const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return next(new AppError('Access denied', 403));
  }
  next();
};

// Usage in routes
router.delete('/users/:id', authenticate, authorize('admin'), deleteUser);
```

### Request Logger Middleware
```js
const requestLogger = (req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    console.log(`${req.method} ${req.url} ${res.statusCode} - ${Date.now() - start}ms`);
  });
  next();
};
```

---

## 6. Authentication — JWT, OAuth, Passport

### JWT Flow

```
Client                    Server
  │                          │
  │── POST /auth/login ──────►│
  │   { email, password }     │ Verify credentials
  │                          │ Sign JWT (access + refresh)
  │◄── { accessToken,  ──────│
  │      refreshToken }       │
  │                          │
  │── GET /api/profile ──────►│
  │   Authorization: Bearer   │ Verify JWT
  │   <accessToken>           │ Attach req.user
  │◄── { user data } ─────────│
  │                          │
  │── POST /auth/refresh ────►│
  │   { refreshToken }        │ Verify refresh token
  │◄── { newAccessToken } ────│
```

### JWT Implementation
```js
// utils/jwt.js
const jwt = require('jsonwebtoken');

const signAccessToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '15m' });

const signRefreshToken = (payload) =>
  jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

const verifyToken = (token, secret) => jwt.verify(token, secret);

module.exports = { signAccessToken, signRefreshToken, verifyToken };
```

### Auth Service
```js
// services/authService.js
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { signAccessToken, signRefreshToken } = require('../utils/jwt');
const { AppError } = require('../utils/AppError');

exports.register = async ({ name, email, password }) => {
  const exists = await User.findOne({ email });
  if (exists) throw new AppError('Email already registered', 400);

  const hashed = await bcrypt.hash(password, 12);
  const user = await User.create({ name, email, password: hashed });

  return generateTokens(user);
};

exports.login = async ({ email, password }) => {
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await bcrypt.compare(password, user.password)))
    throw new AppError('Invalid credentials', 401);

  return generateTokens(user);
};

const generateTokens = (user) => ({
  accessToken: signAccessToken({ id: user._id, role: user.role }),
  refreshToken: signRefreshToken({ id: user._id }),
});
```

### Google OAuth with Passport
```js
// config/passport.js
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/api/auth/google/callback',
}, async (accessToken, refreshToken, profile, done) => {
  let user = await User.findOne({ googleId: profile.id });
  if (!user) {
    user = await User.create({
      name: profile.displayName,
      email: profile.emails[0].value,
      googleId: profile.id,
    });
  }
  done(null, user);
}));
```

---

## 7. Sessions & Cookies

### Session vs JWT Comparison

| Feature | Session | JWT |
|---|---|---|
| **Storage** | Server-side (DB/Redis) | Client-side (token) |
| **Scalability** | Requires shared store | Stateless, scales easily |
| **Revocation** | Easy (delete session) | Hard (need blacklist) |
| **Size** | Small session ID | Token can be large |
| **Use Case** | Monolith, admin panels | Microservices, APIs |

### Express Session with Redis
```js
const session = require('express-session');
const RedisStore = require('connect-redis').default;
const { redisClient } = require('./config/redis');

app.use(session({
  store: new RedisStore({ client: redisClient }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // HTTPS only
    httpOnly: true,     // No JS access
    sameSite: 'strict', // CSRF protection
    maxAge: 1000 * 60 * 60 * 24, // 1 day
  },
}));
```

### Cookie Best Practices
```js
// Secure cookie settings
res.cookie('refreshToken', token, {
  httpOnly: true,
  secure: true,
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  path: '/api/auth/refresh',
});

// Clear cookie on logout
res.clearCookie('refreshToken', { path: '/api/auth/refresh' });
```

### CSRF Protection
```js
const csrf = require('csurf');
const csrfProtection = csrf({ cookie: true });

// For web apps using sessions/cookies
app.use(csrfProtection);
app.get('/form', (req, res) => {
  res.render('form', { csrfToken: req.csrfToken() });
});
```

---

## 8. Authorization — RBAC & ABAC

### RBAC (Role-Based Access Control)

```
Roles:
  admin   → can: read, write, delete, manage-users
  editor  → can: read, write
  viewer  → can: read only

User ──has──► Role ──has──► Permissions
```

### RBAC Implementation
```js
// models/User.js
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: { type: String, select: false },
  role: { type: String, enum: ['admin', 'editor', 'viewer'], default: 'viewer' },
});

// middleware/authorize.js
const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role))
    return res.status(403).json({ message: 'Forbidden' });
  next();
};

// Route usage
router.get('/admin/users', authenticate, authorize('admin'), getUsers);
router.put('/posts/:id', authenticate, authorize('admin', 'editor'), updatePost);
```

### Resource Ownership Check
```js
// Ensure user can only edit their own resource
const checkOwnership = (Model) => async (req, res, next) => {
  const resource = await Model.findById(req.params.id);
  if (!resource) return next(new AppError('Not found', 404));
  if (resource.user.toString() !== req.user.id && req.user.role !== 'admin')
    return next(new AppError('Not authorized', 403));
  req.resource = resource;
  next();
};
```

---

## 9. MongoDB & Mongoose

### Schema Design Best Practices

```
Embedding vs Referencing:

Embed when:                    Reference when:
- Data is accessed together    - Data grows unboundedly
- Small, bounded sub-docs      - Data shared across collections
- One-to-few relationships     - One-to-many/many-to-many
```

### Mongoose Model Example
```js
// models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 200 },
  price: { type: Number, required: true, min: 0 },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  images: [{ url: String, public_id: String }],
  stock: { type: Number, default: 0 },
  ratings: { type: Number, default: 0 },
  numOfReviews: { type: Number, default: 0 },
  reviews: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rating: Number,
    comment: String,
    createdAt: { type: Date, default: Date.now },
  }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

// Index for search
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ price: 1, category: 1 });

// Virtual
productSchema.virtual('discountedPrice').get(function () {
  return this.price * 0.9;
});

// Pre-save hook
productSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// Static method
productSchema.statics.getTopRated = function () {
  return this.find({ ratings: { $gte: 4 } }).sort('-ratings').limit(5);
};

module.exports = mongoose.model('Product', productSchema);
```

### Advanced Mongoose Queries
```js
// Aggregation Pipeline
const stats = await Order.aggregate([
  { $match: { status: 'delivered' } },
  { $group: {
    _id: { $month: '$createdAt' },
    totalRevenue: { $sum: '$totalPrice' },
    count: { $sum: 1 },
  }},
  { $sort: { _id: 1 } },
]);

// Populate with select
const orders = await Order.find({ user: req.user.id })
  .populate('products.product', 'name price images')
  .populate('user', 'name email')
  .lean(); // returns plain JS object (faster)

// Transactions (ACID)
const session = await mongoose.startSession();
session.startTransaction();
try {
  await Order.create([orderData], { session });
  await Product.updateOne({ _id: productId }, { $inc: { stock: -qty } }, { session });
  await session.commitTransaction();
} catch (err) {
  await session.abortTransaction();
  throw err;
} finally {
  session.endSession();
}
```

### Connection with Retry Logic
```js
// config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
};

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected. Reconnecting...');
  connectDB();
});

module.exports = connectDB;
```

---

## 10. PostgreSQL with Node.js

### Options Comparison

| Tool | Type | Use Case |
|---|---|---|
| **pg** | Raw driver | Full SQL control, performance |
| **Sequelize** | ORM | Auto migration, associations |
| **Prisma** | Modern ORM | Type-safe, DX-first |
| **Knex** | Query builder | Flexible, no magic |

### pg (node-postgres) Usage
```js
// config/postgres.js
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.POSTGRES_URI,
  max: 20,
  idleTimeoutMillis: 30000,
});

const query = (text, params) => pool.query(text, params);

module.exports = { query, pool };
```

```js
// Parameterized query (SQL injection safe)
const { rows } = await db.query(
  'SELECT * FROM users WHERE email = $1 AND active = $2',
  [email, true]
);

// Transaction
const client = await pool.connect();
try {
  await client.query('BEGIN');
  await client.query('INSERT INTO orders(user_id, total) VALUES($1, $2)', [userId, total]);
  await client.query('UPDATE products SET stock = stock - $1 WHERE id = $2', [qty, productId]);
  await client.query('COMMIT');
} catch (e) {
  await client.query('ROLLBACK');
  throw e;
} finally {
  client.release();
}
```

### Prisma Setup
```js
// schema.prisma
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String
  orders    Order[]
  createdAt DateTime @default(now())
}

model Order {
  id        Int      @id @default(autoincrement())
  total     Float
  user      User     @relation(fields: [userId], references: [id])
  userId    Int
  createdAt DateTime @default(now())
}
```

```js
// Prisma client usage
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const user = await prisma.user.create({
  data: { email, name },
});

const orders = await prisma.order.findMany({
  where: { userId: user.id },
  include: { user: true },
  orderBy: { createdAt: 'desc' },
});
```

---

## 11. Caching with Redis

### Why Redis?
- In-memory = microsecond response times
- Supports: Strings, Hashes, Lists, Sets, Sorted Sets, Pub/Sub, Streams

### Cache Architecture

```
Client Request
      │
      ▼
  [Express Route]
      │
      ▼
  Cache Hit? ──YES──► Return cached data
      │
      NO
      │
      ▼
  [DB Query]
      │
      ▼
  Store in Redis (TTL)
      │
      ▼
  Return data to client
```

### Redis Setup & Caching Middleware
```js
// config/redis.js
const { createClient } = require('redis');

const redisClient = createClient({ url: process.env.REDIS_URL });
redisClient.on('error', (err) => console.error('Redis error:', err));
redisClient.connect();

module.exports = { redisClient };
```

```js
// middleware/cache.js
const { redisClient } = require('../config/redis');

const cache = (ttl = 300) => async (req, res, next) => {
  const key = `cache:${req.originalUrl}`;
  const cached = await redisClient.get(key);

  if (cached) {
    return res.json({ success: true, data: JSON.parse(cached), fromCache: true });
  }

  // Monkey-patch res.json to intercept and cache the response
  const originalJson = res.json.bind(res);
  res.json = async (body) => {
    if (res.statusCode === 200) {
      await redisClient.setEx(key, ttl, JSON.stringify(body.data));
    }
    return originalJson(body);
  };

  next();
};

module.exports = cache;
```

```js
// Usage in route
router.get('/products', cache(600), getProducts);
```

### Cache Invalidation
```js
// Invalidate when data changes
const invalidateCache = async (pattern) => {
  const keys = await redisClient.keys(`cache:${pattern}*`);
  if (keys.length) await redisClient.del(keys);
};

// After product update
await Product.findByIdAndUpdate(id, data);
await invalidateCache('/api/v1/products');
```

### Redis for Rate Limiting
```js
const rateLimit = async (key, limit, window) => {
  const current = await redisClient.incr(key);
  if (current === 1) await redisClient.expire(key, window);
  return current <= limit;
};
```

### Redis Pub/Sub
```js
// Publisher
await redisClient.publish('notifications', JSON.stringify({ userId, message }));

// Subscriber
const subscriber = redisClient.duplicate();
await subscriber.connect();
await subscriber.subscribe('notifications', (message) => {
  const data = JSON.parse(message);
  io.to(data.userId).emit('notification', data);
});
```

---

## 12. Message Queues — Bull, RabbitMQ, Kafka

### Why Message Queues?

```
Without Queue:                  With Queue:
API → sends email directly      API → pushes to queue → Worker processes async
API → resizes image directly     API → pushes to queue → Worker resizes async

Problems solved:
✅ Async processing
✅ Retry on failure
✅ Decoupling services
✅ Handle traffic spikes
✅ Background jobs
```

### Bull Queue (Redis-based)
```js
// jobs/emailQueue.js
const Bull = require('bull');
const emailQueue = new Bull('email', { redis: process.env.REDIS_URL });

// Producer — add job
emailQueue.add('welcome', {
  to: 'user@example.com',
  subject: 'Welcome!',
  template: 'welcome',
}, {
  attempts: 3,
  backoff: { type: 'exponential', delay: 2000 },
  removeOnComplete: true,
});

// Consumer — process job
emailQueue.process('welcome', async (job) => {
  const { to, subject, template } = job.data;
  await sendEmail({ to, subject, template });
  console.log(`Email sent to ${to}`);
});

// Events
emailQueue.on('completed', (job) => console.log(`Job ${job.id} done`));
emailQueue.on('failed', (job, err) => console.error(`Job ${job.id} failed:`, err));
```

### BullMQ (Modern, TypeScript-friendly)
```js
const { Queue, Worker } = require('bullmq');
const connection = { host: 'localhost', port: 6379 };

const imageQueue = new Queue('image-processing', { connection });

// Add job
await imageQueue.add('resize', { imageUrl, sizes: [200, 400, 800] });

// Worker
const worker = new Worker('image-processing', async (job) => {
  if (job.name === 'resize') {
    await resizeImage(job.data.imageUrl, job.data.sizes);
  }
}, { connection, concurrency: 5 });
```

---

## 13. Kafka Deep Dive

### What is Kafka?

Kafka is a **distributed event streaming platform** for high-throughput, fault-tolerant, real-time data pipelines.

### Kafka Architecture

```
Producers → Topics → Consumers

┌──────────────────────────────────────────────────────────┐
│                        Kafka Cluster                      │
│                                                          │
│  ┌──────────────┐    ┌──────────────┐                   │
│  │   Broker 1   │    │   Broker 2   │                   │
│  │  Partition 0 │    │  Partition 1 │                   │
│  │  Partition 2 │    │  Partition 3 │                   │
│  └──────────────┘    └──────────────┘                   │
│                                                          │
│  Topic: "order-events"                                   │
│    Partition 0: [msg1, msg2, msg3...]  ← append-only log │
│    Partition 1: [msg4, msg5, msg6...]                    │
└──────────────────────────────────────────────────────────┘

Producers ──────────────────────────► Consumers (Consumer Groups)
  Order Service                         Notification Service
  Payment Service                       Analytics Service
                                        Inventory Service
```

### Kafka with KafkaJS (Node.js)
```js
// config/kafka.js
const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['kafka:9092'],
});

module.exports = kafka;
```

```js
// Producer
const kafka = require('../config/kafka');
const producer = kafka.producer();

const produceMessage = async (topic, messages) => {
  await producer.connect();
  await producer.send({
    topic,
    messages: messages.map((msg) => ({
      key: msg.key,
      value: JSON.stringify(msg.value),
    })),
  });
};

// Publish order event
await produceMessage('order-events', [{
  key: `order-${orderId}`,
  value: { orderId, userId, total, status: 'created' },
}]);
```

```js
// Consumer
const kafka = require('../config/kafka');
const consumer = kafka.consumer({ groupId: 'notification-service' });

const startConsumer = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: 'order-events', fromBeginning: false });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const data = JSON.parse(message.value.toString());
      console.log(`Order ${data.orderId} received`);
      await sendOrderConfirmationEmail(data);
    },
  });
};

startConsumer();
```

### Kafka vs RabbitMQ vs Bull

| Feature | Kafka | RabbitMQ | Bull (Redis) |
|---|---|---|---|
| **Throughput** | Millions/sec | Thousands/sec | High |
| **Persistence** | Days/weeks | Until consumed | Redis TTL |
| **Replay** | Yes (offset) | No | No |
| **Complexity** | High | Medium | Low |
| **Use Case** | Event streaming, audit logs | Task queues, RPC | Job queues in Node.js |

---

## 14. File Upload — Multer, Cloudinary, S3

### Upload Architecture

```
Client
  │ (multipart/form-data)
  ▼
Express + Multer        ← Parse & temporarily store
  │
  ▼
Validate (type, size)
  │
  ▼
Upload to Cloud         ← Cloudinary / AWS S3
  │
  ▼
Save URL in DB
  │
  ▼
Return URL to client
```

### Multer Setup
```js
// config/multer.js
const multer = require('multer');
const path = require('path');

const storage = multer.memoryStorage(); // store in buffer (for cloud upload)

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|gif|webp/;
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.test(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

module.exports = upload;
```

### Cloudinary Upload
```js
// utils/cloudinary.js
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const uploadToCloudinary = (buffer, folder = 'uploads') => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'auto' },
      (error, result) => (error ? reject(error) : resolve(result))
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

module.exports = { uploadToCloudinary };
```

```js
// Controller
const uploadProduct = asyncHandler(async (req, res) => {
  if (!req.file) throw new AppError('No file uploaded', 400);

  const result = await uploadToCloudinary(req.file.buffer, 'products');
  const product = await Product.create({
    ...req.body,
    image: { url: result.secure_url, public_id: result.public_id },
  });

  res.status(201).json({ success: true, data: product });
});

// Route
router.post('/products', authenticate, upload.single('image'), uploadProduct);
```

### AWS S3 Upload
```js
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { v4: uuidv4 } = require('uuid');

const s3 = new S3Client({ region: process.env.AWS_REGION });

const uploadToS3 = async (file) => {
  const key = `uploads/${uuidv4()}-${file.originalname}`;
  await s3.send(new PutObjectCommand({
    Bucket: process.env.S3_BUCKET,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
  }));
  return `https://${process.env.S3_BUCKET}.s3.amazonaws.com/${key}`;
};
```

---

## 15. WebSockets & Socket.io

### WebSocket vs HTTP

```
HTTP (Request-Response):        WebSocket (Full-Duplex):
Client ──request──► Server      Client ◄──────────► Server
Client ◄──response── Server     (persistent connection,
(connection closes)              bidirectional, real-time)
```

### Socket.io Server Setup
```js
// sockets/index.js
const { Server } = require('socket.io');
const { verifyToken } = require('../utils/jwt');
const User = require('../models/User');

const initSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: { origin: process.env.CLIENT_URL, methods: ['GET', 'POST'] },
  });

  // Auth middleware for socket
  io.use(async (socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error('Unauthorized'));
    try {
      const decoded = verifyToken(token, process.env.JWT_SECRET);
      socket.user = await User.findById(decoded.id);
      next();
    } catch {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.user.name}`);

    // Join user to their personal room
    socket.join(`user:${socket.user.id}`);

    // Join a chat room
    socket.on('join-room', (roomId) => {
      socket.join(roomId);
      socket.to(roomId).emit('user-joined', { user: socket.user.name });
    });

    // Chat message
    socket.on('send-message', async ({ roomId, message }) => {
      const msg = await Message.create({ sender: socket.user.id, roomId, message });
      io.to(roomId).emit('new-message', msg);
    });

    // Typing indicator
    socket.on('typing', ({ roomId }) => {
      socket.to(roomId).emit('user-typing', { name: socket.user.name });
    });

    // Disconnect
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.user.name}`);
    });
  });

  return io;
};

module.exports = initSocket;
```

```js
// server.js — attach socket to HTTP server
const http = require('http');
const app = require('./src/app');
const initSocket = require('./src/sockets');

const httpServer = http.createServer(app);
const io = initSocket(httpServer);

// Make io available in controllers
app.set('io', io);

httpServer.listen(PORT);
```

### Emit from Controller
```js
// Send notification via socket from a controller
const sendNotification = async (req, res) => {
  const io = req.app.get('io');
  const notification = await Notification.create({ user: targetId, message });
  io.to(`user:${targetId}`).emit('notification', notification);
  res.json({ success: true });
};
```

### Socket.io Scaling with Redis Adapter
```js
const { createAdapter } = require('@socket.io/redis-adapter');
const { createClient } = require('redis');

const pubClient = createClient({ url: process.env.REDIS_URL });
const subClient = pubClient.duplicate();
await Promise.all([pubClient.connect(), subClient.connect()]);

io.adapter(createAdapter(pubClient, subClient));
// Now works across multiple Node.js instances
```

---

## 16. MQTT — IoT Messaging Protocol

### What is MQTT?
MQTT (Message Queuing Telemetry Transport) is a lightweight **publish-subscribe** protocol designed for IoT devices with low bandwidth.

### MQTT vs WebSocket

| Feature | MQTT | WebSocket |
|---|---|---|
| **Protocol** | TCP (lightweight) | TCP (HTTP upgrade) |
| **Pattern** | Pub/Sub | Full-duplex |
| **QoS** | 0, 1, 2 levels | No built-in QoS |
| **Broker** | Required (Mosquitto) | Not needed |
| **Use Case** | IoT, sensors, devices | Real-time web apps |

### MQTT Flow
```
IoT Sensor                Mosquitto Broker          Node.js Server
    │                           │                         │
    │── PUBLISH ────────────────►│                         │
    │   topic: sensors/temp     │── PUSH to subscribers ──►│
    │   payload: { temp: 23.5 } │                         │ Process data
    │                           │◄─── PUBLISH ────────────│
    │                           │     topic: devices/led  │
    │◄── receives LED command ──│                         │
```

### MQTT with Node.js (mqtt.js)
```js
const mqtt = require('mqtt');

const client = mqtt.connect(process.env.MQTT_BROKER_URL, {
  username: process.env.MQTT_USER,
  password: process.env.MQTT_PASS,
  clientId: `node-server-${Date.now()}`,
});

// QoS Levels:
// 0 = At most once (fire and forget)
// 1 = At least once (acknowledged)
// 2 = Exactly once (guaranteed)

client.on('connect', () => {
  console.log('MQTT connected');
  client.subscribe('sensors/#', { qos: 1 }); // wildcard: all sensor topics
  client.subscribe('devices/status', { qos: 1 });
});

client.on('message', async (topic, payload) => {
  const data = JSON.parse(payload.toString());

  if (topic.startsWith('sensors/')) {
    const sensorId = topic.split('/')[1];
    await SensorReading.create({ sensorId, ...data, timestamp: new Date() });

    // Trigger alert if threshold exceeded
    if (data.temperature > 80) {
      await sendAlert(`Sensor ${sensorId} overheating: ${data.temperature}°C`);
      client.publish(`devices/${sensorId}/alert`, JSON.stringify({ alert: true }), { qos: 1 });
    }
  }
});

// Publish command to device
const sendCommand = (deviceId, command) => {
  client.publish(`devices/${deviceId}/cmd`, JSON.stringify(command), { qos: 2 });
};
```

---

## 17. Payment Integration — Stripe, Razorpay

### Payment Flow

```
Client                  Server                   Stripe
  │                       │                         │
  │── Create Order ───────►│                         │
  │                        │── Create PaymentIntent ►│
  │                        │◄── { clientSecret } ────│
  │◄── { clientSecret } ───│                         │
  │                        │                         │
  │── Stripe.js confirm ──────────────────────────►  │
  │   (card details never touch your server)          │
  │◄──────── Payment Confirmed ─────────────────────  │
  │                        │                         │
  │                        │◄── Webhook event ───────│
  │                        │    payment_intent.      │
  │                        │    succeeded            │
  │                        │ Update order status     │
```

### Stripe Integration
```js
// services/paymentService.js
const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Create payment intent
exports.createPaymentIntent = async (amount, currency = 'usd', metadata = {}) => {
  return stripe.paymentIntents.create({
    amount: Math.round(amount * 100), // Convert to cents
    currency,
    metadata,
    automatic_payment_methods: { enabled: true },
  });
};

// Verify webhook
exports.constructWebhookEvent = (body, sig) => {
  return stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
};
```

```js
// controllers/paymentController.js
exports.createOrder = asyncHandler(async (req, res) => {
  const { items } = req.body;
  const total = calculateTotal(items);

  const paymentIntent = await paymentService.createPaymentIntent(total, 'usd', {
    userId: req.user.id,
  });

  const order = await Order.create({
    user: req.user.id,
    items,
    total,
    paymentIntentId: paymentIntent.id,
    status: 'pending',
  });

  res.json({ clientSecret: paymentIntent.client_secret, orderId: order._id });
});

// Stripe Webhook
exports.stripeWebhook = asyncHandler(async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const event = paymentService.constructWebhookEvent(req.body, sig);

  switch (event.type) {
    case 'payment_intent.succeeded': {
      const { id: paymentIntentId } = event.data.object;
      await Order.findOneAndUpdate(
        { paymentIntentId },
        { status: 'paid', paidAt: new Date() }
      );
      break;
    }
    case 'payment_intent.payment_failed':
      await Order.findOneAndUpdate(
        { paymentIntentId: event.data.object.id },
        { status: 'failed' }
      );
      break;
  }

  res.json({ received: true });
});

// Webhook route must use raw body
app.post('/webhook/stripe', express.raw({ type: 'application/json' }), stripeWebhook);
```

### Razorpay Integration
```js
const Razorpay = require('razorpay');
const crypto = require('crypto');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

// Create order
exports.createRazorpayOrder = async (amount) => {
  return razorpay.orders.create({
    amount: amount * 100, // paise
    currency: 'INR',
    receipt: `order_${Date.now()}`,
  });
};

// Verify signature after payment
exports.verifyPayment = (orderId, paymentId, signature) => {
  const body = `${orderId}|${paymentId}`;
  const expected = crypto
    .createHmac('sha256', process.env.RAZORPAY_SECRET)
    .update(body)
    .digest('hex');
  return expected === signature;
};
```

---

## 18. Rate Limiting & Throttling

### Strategies

| Strategy | Description | Use Case |
|---|---|---|
| **Fixed Window** | N requests per time window | Simple global limit |
| **Sliding Window** | Rolling window | More accurate |
| **Token Bucket** | Tokens refill at fixed rate | Burst-friendly |
| **Leaky Bucket** | Requests processed at constant rate | Smooth output |

### express-rate-limit
```js
const rateLimit = require('express-rate-limit');

// General API limit
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { error: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Strict limit for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: 'Too many login attempts, try again in 15 minutes.' },
  skipSuccessfulRequests: true,
});

app.use('/api/', apiLimiter);
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);
```

### Redis-based Rate Limiting (Distributed)
```js
const { redisClient } = require('../config/redis');

const redisRateLimiter = (limit, window) => async (req, res, next) => {
  const key = `ratelimit:${req.ip}`;
  const current = await redisClient.incr(key);
  if (current === 1) await redisClient.expire(key, window);

  res.set('X-RateLimit-Limit', limit);
  res.set('X-RateLimit-Remaining', Math.max(0, limit - current));

  if (current > limit) {
    return res.status(429).json({ error: 'Rate limit exceeded' });
  }
  next();
};
```

---

## 19. Security Best Practices

### Security Checklist

```
✅ Use helmet.js (HTTP security headers)
✅ Enable CORS with whitelist
✅ Rate limit all routes
✅ Sanitize inputs (express-mongo-sanitize, xss-clean)
✅ Use parameterized queries (prevent SQL injection)
✅ Hash passwords with bcrypt (min 12 rounds)
✅ Use HTTPS in production
✅ httpOnly, secure, sameSite cookies
✅ Validate all user inputs (Joi/Zod)
✅ Store secrets in .env (never commit)
✅ Use CSRF tokens for cookie-based auth
✅ Implement JWT expiry + refresh token rotation
✅ Log suspicious activity
✅ Use express-validator for body sanitization
```

### Input Sanitization
```js
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp'); // HTTP Parameter Pollution

app.use(mongoSanitize()); // Prevent NoSQL injection: { $gt: '' }
app.use(xss());           // Sanitize HTML tags in input
app.use(hpp());           // Prevent duplicate query params
```

### Helmet Configuration
```js
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
    },
  },
  hsts: { maxAge: 31536000, includeSubDomains: true },
}));
```

### AppError Class
```js
// utils/AppError.js
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = statusCode >= 400 && statusCode < 500 ? 'fail' : 'error';
    this.isOperational = true; // expected errors (not bugs)
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = { AppError };
```

---

## 20. Error Handling & Logging

### Global Error Handler
```js
// middleware/errorHandler.js
const { AppError } = require('../utils/AppError');

const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || 'Internal Server Error';

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    err = new AppError(`${field} already exists`, 400);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    err = new AppError(messages.join(', '), 400);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') err = new AppError('Invalid token', 401);
  if (err.name === 'TokenExpiredError') err = new AppError('Token expired', 401);

  // Dev vs Production error response
  if (process.env.NODE_ENV === 'development') {
    res.status(err.statusCode).json({
      success: false,
      error: err.message,
      stack: err.stack,
    });
  } else {
    // Don't leak internal errors to production
    const message = err.isOperational ? err.message : 'Something went wrong';
    res.status(err.statusCode).json({ success: false, error: message });
  }
};

// Unhandled rejections & exceptions
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION:', err);
  server.close(() => process.exit(1));
});

process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION:', err);
  process.exit(1);
});

module.exports = { errorHandler };
```

### Winston Logger
```js
// utils/logger.js
const winston = require('winston');

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

module.exports = logger;
```

---

## 21. Environment Config & Secrets Management

### Environment Variables
```js
// config/env.js
require('dotenv').config();

const required = ['MONGO_URI', 'JWT_SECRET', 'REDIS_URL', 'STRIPE_SECRET_KEY'];
required.forEach((key) => {
  if (!process.env[key]) throw new Error(`Missing env variable: ${key}`);
});

module.exports = {
  PORT: process.env.PORT || 5000,
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '15m',
  REDIS_URL: process.env.REDIS_URL,
  NODE_ENV: process.env.NODE_ENV || 'development',
};
```

### .env.example (commit this, not .env)
```
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/mydb
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-super-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
JWT_EXPIRES_IN=15m
CLOUDINARY_NAME=
CLOUDINARY_KEY=
CLOUDINARY_SECRET=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
SESSION_SECRET=
CLIENT_URL=http://localhost:3000
```

---

## 22. Validation — Joi, Zod, express-validator

### Joi Validation Middleware
```js
// validators/userValidator.js
const Joi = require('joi');

const registerSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string()
    .min(8)
    .pattern(/^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%])/)
    .required()
    .messages({ 'string.pattern.base': 'Password must have uppercase, number and special char' }),
});

const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    const messages = error.details.map((d) => d.message);
    return res.status(400).json({ success: false, errors: messages });
  }
  next();
};

module.exports = { registerSchema, validate };
```

### Zod Validation (TypeScript-friendly)
```js
const { z } = require('zod');

const productSchema = z.object({
  name: z.string().min(2).max(200),
  price: z.number().positive(),
  stock: z.number().int().min(0),
  category: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ObjectId'),
});

const zodValidate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      success: false,
      errors: result.error.flatten().fieldErrors,
    });
  }
  req.body = result.data;
  next();
};
```

---

## 23. Testing — Unit, Integration, E2E

### Testing Pyramid

```
         ┌─────────────┐
         │    E2E       │ ← Few, slow, full flow (Cypress, Playwright)
         └──────────────┘
        ┌────────────────┐
        │  Integration   │ ← Medium (Supertest + Jest)
        └────────────────┘
      ┌──────────────────────┐
      │      Unit Tests       │ ← Many, fast (Jest, Mocha)
      └──────────────────────┘
```

### Jest + Supertest API Testing
```js
// tests/auth.test.js
const request = require('supertest');
const app = require('../src/app');
const mongoose = require('mongoose');

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_TEST_URI);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

describe('POST /api/v1/auth/register', () => {
  it('should register a new user', async () => {
    const res = await request(app).post('/api/v1/auth/register').send({
      name: 'Test User',
      email: 'test@example.com',
      password: 'Password@123',
    });
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('accessToken');
  });

  it('should fail with duplicate email', async () => {
    await request(app).post('/api/v1/auth/register').send({
      name: 'Test', email: 'test@example.com', password: 'Password@123',
    });
    const res = await request(app).post('/api/v1/auth/register').send({
      name: 'Test', email: 'test@example.com', password: 'Password@123',
    });
    expect(res.statusCode).toBe(400);
  });
});
```

### Unit Test with Mocks
```js
// tests/userService.test.js
const userService = require('../src/services/userService');
const User = require('../src/models/User');

jest.mock('../src/models/User');

describe('getUserById', () => {
  it('should return user if found', async () => {
    const mockUser = { _id: '123', name: 'John', email: 'john@test.com' };
    User.findById.mockReturnValue({
      select: jest.fn().mockResolvedValue(mockUser),
    });

    const user = await userService.getUserById('123');
    expect(user).toEqual(mockUser);
  });

  it('should throw 404 if user not found', async () => {
    User.findById.mockReturnValue({ select: jest.fn().mockResolvedValue(null) });
    await expect(userService.getUserById('999')).rejects.toThrow('User not found');
  });
});
```

---

## 24. Performance Optimization

### Node.js Performance Tips

```
✅ Use clustering (cluster module / PM2)
✅ Enable gzip compression (compression middleware)
✅ Cache expensive queries in Redis
✅ Use lean() in Mongoose queries
✅ Create proper DB indexes
✅ Use connection pooling (pg Pool, Mongoose poolSize)
✅ Paginate results (never send all data)
✅ Use streams for large files
✅ Avoid synchronous blocking code
✅ Profile with clinic.js or node --inspect
✅ Use HTTP/2 where possible
✅ CDN for static assets
```

### Compression
```js
const compression = require('compression');
app.use(compression({ threshold: 1024 })); // Only compress > 1KB
```

### PM2 Cluster Mode
```js
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'api',
    script: 'server.js',
    instances: 'max',     // Use all CPU cores
    exec_mode: 'cluster',
    max_memory_restart: '1G',
    env_production: {
      NODE_ENV: 'production',
      PORT: 5000,
    },
  }],
};
```

### MongoDB Performance
```js
// Create indexes for frequently queried fields
productSchema.index({ category: 1, price: 1 });
productSchema.index({ name: 'text' }); // Full-text search
productSchema.index({ createdAt: -1 }); // Latest first

// Use .lean() for read-only queries (50% faster)
const products = await Product.find().lean();

// Projection — only fetch needed fields
const users = await User.find({}, 'name email role');

// Use explain() to analyze query performance
const plan = await Product.find({ category: id }).explain('executionStats');
```

---

## 25. Microservice Architecture

### Monolith vs Microservices

| Feature | Monolith | Microservices |
|---|---|---|
| **Deployment** | Single unit | Independent services |
| **Scaling** | Scale entire app | Scale individual services |
| **Tech Stack** | Uniform | Polyglot (each service picks its own) |
| **Failure** | One crash = all down | Isolated failures |
| **Complexity** | Simple to start | High operational complexity |
| **Communication** | In-process calls | HTTP/gRPC/Message queues |
| **Team Size** | Small teams | Large, independent teams |
| **Best For** | Startups, MVPs | Large-scale, mature products |

### Microservice Architecture Diagram

```
                        ┌─────────────────┐
                        │  Client (React)  │
                        └────────┬────────┘
                                 │
                        ┌────────▼────────┐
                        │   API Gateway    │  ← Single entry point
                        │ (Auth, Routing,  │
                        │  Rate Limit)     │
                        └────────┬────────┘
                                 │
      ┌──────────────────────────┼──────────────────────────────┐
      │                          │                              │
┌─────▼──────────┐         ┌─────▼──────────────┐          ┌───▼──────────────┐
│  User          │         │  Product            │          │  Order           │
│  Service       │         │  Service            │          │  Service         │
│  :3001         │         │  :3002              │          │  :3003           │
└─────┬──────────┘         └─────┬──────────────┘          └───┬──────────────┘
      │                          │                              │
┌─────▼──────────┐         ┌─────▼──────────────┐          ┌───▼──────────────┐
│  Users DB      │         │  Products DB         │          │  Orders DB       │
│  (Postgres)    │         │  (MongoDB)           │          │  (Postgres)      │
└────────────────┘         └──────────────────────┘          └──────────────────┘

                  ↕ All services communicate via:
              Message Queue (Kafka/RabbitMQ) for async events
              gRPC / REST for sync calls
```

### Communication Patterns

```
Synchronous (Request/Response):        Asynchronous (Event-Driven):

Order Service ──HTTP/gRPC──► User       Order Service ──publish──► Kafka
              ◄─── response ──          Notification  ◄─consume──  Kafka
                                         Service

Use when: Need immediate response       Use when: Decoupled, non-blocking
Risk: Cascading failures                Benefit: Resilient, retryable
```

### Inter-Service Communication

#### REST (HTTP)
```js
// Calling another microservice with axios + retry
const axios = require('axios');
const axiosRetry = require('axios-retry');

const serviceClient = axios.create({
  baseURL: process.env.USER_SERVICE_URL, // http://user-service:3001
  timeout: 5000,
});

axiosRetry(serviceClient, {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
});

// Fetch user from user-service
const getUser = async (userId) => {
  const { data } = await serviceClient.get(`/api/users/${userId}`);
  return data;
};
```

#### gRPC (High-Performance RPC)
```js
// user.proto
syntax = "proto3";
service UserService {
  rpc GetUser (UserRequest) returns (UserResponse);
}
message UserRequest { string id = 1; }
message UserResponse { string id = 1; string name = 2; string email = 3; }

// Server (User Service)
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const packageDef = protoLoader.loadSync('user.proto');
const grpcObj = grpc.loadPackageDefinition(packageDef);

const server = new grpc.Server();
server.addService(grpcObj.UserService.service, {
  getUser: async (call, callback) => {
    const user = await User.findById(call.request.id);
    callback(null, { id: user.id, name: user.name, email: user.email });
  },
});
server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), () =>
  server.start()
);

// Client (Order Service calling User Service)
const client = new grpcObj.UserService(
  'user-service:50051',
  grpc.credentials.createInsecure()
);
client.getUser({ id: userId }, (err, user) => {
  console.log(user.name);
});
```

### Service Discovery
```
Problem: Microservices have dynamic IPs (Docker/Kubernetes)

Solution — Service Registry (e.g., Consul, Kubernetes DNS):

Order Service ──► Consul: "Where is User Service?" ──► 10.0.0.5:3001
                          "Where is Product Service?" ──► 10.0.0.6:3002
```

### Circuit Breaker Pattern
```js
// Using opossum
const CircuitBreaker = require('opossum');

const options = {
  timeout: 3000,                    // If fn takes > 3s, trigger failure
  errorThresholdPercentage: 50,     // Open circuit if 50% of calls fail
  resetTimeout: 10000,              // Try again after 10s (half-open)
};

const breaker = new CircuitBreaker(getUser, options);

breaker.fallback(() => ({ id: null, name: 'Unknown' })); // fallback response

breaker.on('open',     () => console.log('Circuit OPEN — user service down'));
breaker.on('halfOpen', () => console.log('Circuit HALF-OPEN — testing...'));
breaker.on('close',    () => console.log('Circuit CLOSED — service recovered'));

// Usage
const user = await breaker.fire(userId);
```

### Saga Pattern (Distributed Transactions)
```
Problem: No single DB transaction across services.

Choreography Saga (event-driven):

Order Service            Payment Service          Inventory Service
     │                        │                         │
     │── order.created ────────►│                         │
     │                        │── payment.processed ────►│
     │                        │                         │── inventory.reserved
     │◄── order.confirmed ─────────────────────────────────────────────

Compensation (Rollback):
If inventory fails → publish inventory.failed
Payment Service listens → refund payment
Order Service listens → cancel order
```

### Docker Compose for Microservices
```yaml
# docker-compose.yml
version: '3.8'
services:
  api-gateway:
    build: ./gateway
    ports: ["3000:3000"]
    environment:
      - USER_SERVICE_URL=http://user-service:3001
      - ORDER_SERVICE_URL=http://order-service:3003

  user-service:
    build: ./user-service
    ports: ["3001:3001"]
    environment:
      - POSTGRES_URI=postgresql://postgres:password@postgres:5432/users
    depends_on: [postgres]

  order-service:
    build: ./order-service
    ports: ["3003:3003"]
    environment:
      - MONGO_URI=mongodb://mongo:27017/orders
      - KAFKA_BROKERS=kafka:9092
    depends_on: [mongo, kafka]

  postgres:
    image: postgres:15
    environment:
      POSTGRES_PASSWORD: password
    volumes: [postgres_data:/var/lib/postgresql/data]

  mongo:
    image: mongo:7
    volumes: [mongo_data:/data/db]

  redis:
    image: redis:7-alpine

  kafka:
    image: confluentinc/cp-kafka:latest
    environment:
      KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181
      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://kafka:9092

volumes:
  postgres_data:
  mongo_data:
```

---

## 26. API Gateway

### What is an API Gateway?

An **API Gateway** is the **single entry point** for all client requests in a microservice architecture. It acts as a reverse proxy that routes requests to the appropriate microservice.

```
Without Gateway:                  With Gateway:

Client ──► User Service           Client ──► API Gateway ──► User Service
Client ──► Order Service                                 ──► Order Service
Client ──► Product Service                               ──► Product Service

Problems:                         Benefits:
✗ Multiple URLs                   ✅ Single URL / entry point
✗ Auth in every service           ✅ Centralized auth & rate limiting
✗ CORS in every service           ✅ Centralized CORS, logging
✗ No central rate limiting        ✅ Request aggregation
✗ Client knows internal topology  ✅ Hides internal architecture
```

### API Gateway Responsibilities

| Responsibility | Description |
|---|---|
| **Routing** | Forward request to correct microservice |
| **Authentication** | Verify JWT before forwarding |
| **Rate Limiting** | Protect services from abuse |
| **Load Balancing** | Distribute traffic across instances |
| **SSL Termination** | Handle HTTPS, forward HTTP internally |
| **Request Aggregation** | Combine responses from multiple services |
| **Logging & Tracing** | Centralized request logs, correlation IDs |
| **Caching** | Cache responses at gateway level |
| **Transformation** | Modify request/response headers or body |

### Popular API Gateway Options

| Tool | Type | Best For |
|---|---|---|
| **Nginx** | Reverse proxy / gateway | High-performance, static config |
| **Kong** | Open-source gateway | Plugin ecosystem, enterprise |
| **AWS API Gateway** | Managed cloud | AWS Lambda, serverless |
| **Traefik** | Cloud-native gateway | Docker/Kubernetes auto-discovery |
| **Express Gateway** | Node.js based | Node.js teams, custom logic |
| **Custom Express** | DIY | Full control, learning |

### Build a Custom API Gateway in Express
```js
// gateway/src/app.js
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const rateLimit = require('express-rate-limit');
const authenticate = require('./middleware/authenticate');
const correlationId = require('./middleware/correlationId');

const app = express();

// Services registry
const SERVICES = {
  users:    process.env.USER_SERVICE_URL,    // http://user-service:3001
  orders:   process.env.ORDER_SERVICE_URL,   // http://order-service:3003
  products: process.env.PRODUCT_SERVICE_URL, // http://product-service:3002
  payments: process.env.PAYMENT_SERVICE_URL, // http://payment-service:3004
};

// Attach correlation ID to every request for distributed tracing
app.use(correlationId);

// Rate limiting at gateway level
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 200 }));

// Public routes — no auth needed
app.use('/api/v1/auth', createProxyMiddleware({
  target: SERVICES.users,
  changeOrigin: true,
}));

app.use('/api/v1/products', createProxyMiddleware({
  target: SERVICES.products,
  changeOrigin: true,
}));

// Protected routes — auth required
app.use('/api/v1/users',    authenticate, createProxyMiddleware({ target: SERVICES.users,    changeOrigin: true }));
app.use('/api/v1/orders',   authenticate, createProxyMiddleware({ target: SERVICES.orders,   changeOrigin: true }));
app.use('/api/v1/payments', authenticate, createProxyMiddleware({ target: SERVICES.payments, changeOrigin: true }));

// 404
app.use((req, res) => res.status(404).json({ error: 'Route not found' }));

module.exports = app;
```

### Correlation ID Middleware (Distributed Tracing)
```js
// middleware/correlationId.js
const { v4: uuidv4 } = require('uuid');

const correlationId = (req, res, next) => {
  // Use existing ID from upstream or generate new one
  const id = req.headers['x-correlation-id'] || uuidv4();
  req.correlationId = id;
  res.set('x-correlation-id', id);    // Pass to client response

  // Forward to downstream services
  req.headers['x-correlation-id'] = id;
  next();
};

module.exports = correlationId;

// Now every log entry across all services can be linked by this ID
// logger.info({ correlationId: req.correlationId, message: 'Order created' });
```

### Request Aggregation (BFF — Backend for Frontend)
```js
// Aggregate data from multiple services in one gateway response
// GET /api/v1/dashboard → combines user + orders + notifications

app.get('/api/v1/dashboard', authenticate, async (req, res) => {
  const userId = req.user.id;
  const headers = {
    'x-correlation-id': req.correlationId,
    Authorization: req.headers.authorization,
  };

  try {
    const [user, orders, notifications] = await Promise.all([
      axios.get(`${SERVICES.users}/api/users/${userId}`, { headers }),
      axios.get(`${SERVICES.orders}/api/orders?userId=${userId}&limit=5`, { headers }),
      axios.get(`${SERVICES.users}/api/notifications/${userId}`, { headers }),
    ]);

    res.json({
      success: true,
      data: {
        user: user.data.data,
        recentOrders: orders.data.data,
        notifications: notifications.data.data,
      },
    });
  } catch (err) {
    res.status(502).json({ error: 'One or more services unavailable' });
  }
});
```

### Nginx as API Gateway
```nginx
# nginx.conf
upstream user_service    { server user-service:3001; }
upstream order_service   { server order-service:3003; }
upstream product_service { server product-service:3002; }

server {
  listen 80;

  # Rate limiting zone
  limit_req_zone $binary_remote_addr zone=api:10m rate=100r/m;

  location /api/v1/users/ {
    limit_req zone=api burst=20 nodelay;
    proxy_pass         http://user_service;
    proxy_set_header   Host              $host;
    proxy_set_header   X-Real-IP         $remote_addr;
    proxy_set_header   X-Correlation-ID  $request_id;
  }

  location /api/v1/orders/ {
    limit_req zone=api burst=20 nodelay;
    proxy_pass http://order_service;
    proxy_set_header X-Real-IP $remote_addr;
  }

  location /api/v1/products/ {
    proxy_pass  http://product_service;
    proxy_cache api_cache;
    proxy_cache_valid 200 5m;   # Cache product responses for 5 minutes
  }
}
```

### API Gateway vs Load Balancer

```
Load Balancer:                    API Gateway:

Client ──► LB ──► App #1          Client ──► Gateway ──► Auth
              ──► App #2                              ──► Rate Limit
              ──► App #3                              ──► Route to Service A
                                                     ──► Route to Service B

Works at L4 (TCP/UDP)             Works at L7 (HTTP, Headers, Paths)
Distributes load only             Auth + Routing + Transform + Log
```

### Health Checks & Service Status
```js
// Gateway health endpoint + downstream service checks
app.get('/health', async (req, res) => {
  const checks = await Promise.allSettled(
    Object.entries(SERVICES).map(async ([name, url]) => {
      const resp = await axios.get(`${url}/health`, { timeout: 2000 });
      return { name, status: 'up' };
    })
  );

  const results = checks.map((c, i) => ({
    service: Object.keys(SERVICES)[i],
    status: c.status === 'fulfilled' ? 'up' : 'down',
    error: c.reason?.message,
  }));

  const allUp = results.every((r) => r.status === 'up');
  res.status(allUp ? 200 : 503).json({ gateway: 'up', services: results });
});
```

### Microservice + API Gateway — Interview Q&A

| Question | Key Answer |
|---|---|
| **When to switch Monolith → Microservices?** | When teams are large, services need independent scaling, or deployment cycles conflict |
| **What is a BFF?** | Backend for Frontend — a gateway tailored per client type (mobile, web) |
| **How do microservices share auth?** | Gateway validates JWT and forwards user info as headers (`x-user-id`, `x-user-role`) |
| **How to handle distributed transactions?** | Saga pattern (choreography or orchestration) with compensating transactions |
| **What is service mesh?** | Infrastructure layer (Istio, Linkerd) handling mTLS, retries, tracing between services |
| **How to prevent cascading failures?** | Circuit Breaker + Bulkhead + Timeout + Retry with exponential backoff |
| **What is the strangler fig pattern?** | Gradually migrate monolith → microservices by routing one feature at a time through gateway |

---

## 27. Production Architecture Diagram

```
                          ┌─────────────────┐
                          │   Client (React) │
                          └────────┬────────┘
                                   │ HTTPS
                          ┌────────▼────────┐
                          │   Nginx (Proxy)  │
                          │  SSL Termination │
                          └────────┬────────┘
                                   │
               ┌───────────────────┼───────────────────┐
               │                   │                   │
      ┌────────▼──────┐   ┌────────▼──────┐   ┌───────▼───────┐
      │  Node App #1  │   │  Node App #2  │   │  Node App #3  │
      │  (PM2/Docker) │   │  (PM2/Docker) │   │  (PM2/Docker) │
      └────────┬──────┘   └────────┬──────┘   └───────┬───────┘
               │                   │                   │
               └───────────────────┼───────────────────┘
                                   │
              ┌────────────────────┼────────────────────┐
              │                    │                     │
    ┌─────────▼────┐    ┌──────────▼──────┐   ┌────────▼────────┐
    │   MongoDB    │    │  Redis Cluster   │   │  Message Queue   │
    │  (Replica    │    │  (Cache/Session/ │   │  (Kafka/Bull)    │
    │   Set)       │    │   Rate Limit)    │   │                  │
    └──────────────┘    └─────────────────┘   └──────────────────┘
                                   │
              ┌────────────────────┼────────────────────┐
              │                    │                     │
    ┌─────────▼────┐    ┌──────────▼──────┐   ┌────────▼────────┐
    │  PostgreSQL   │    │  Cloudinary/S3   │   │  Stripe/Razorpay│
    │  (Relations) │    │  (File Storage)  │   │  (Payments)      │
    └──────────────┘    └─────────────────┘   └──────────────────┘
```

---

## 28. Quick Revision Cheat Sheet

### Most Common Interview Questions

| Question | Key Answer |
|---|---|
| **What is Event Loop?** | Single-threaded mechanism that processes async callbacks in phases |
| **Callback vs Promise vs Async/Await?** | Callback → Promise → Async/Await (syntactic sugar over Promises) |
| **JWT vs Session?** | JWT=stateless/scalable, Session=stateful/revocable |
| **How does Node handle concurrency?** | Non-blocking I/O + Event loop + libuv thread pool |
| **What is Middleware?** | Function with (req, res, next) that processes request in pipeline |
| **Mongoose vs Prisma?** | Mongoose=MongoDB ORM, Prisma=type-safe modern ORM (SQL+NoSQL) |
| **Redis use cases?** | Cache, Session, Rate Limit, Pub/Sub, Queue, Leaderboard |
| **When to use Kafka?** | High-throughput event streaming, replay, multiple consumers |
| **What is CSRF?** | Cross-Site Request Forgery — prevented by SameSite cookies / CSRF tokens |
| **bcrypt rounds?** | Min 10-12 in production. Higher = slower but more secure |
| **SQL vs NoSQL?** | SQL=ACID, relations; NoSQL=flexible schema, horizontal scale |
| **How to prevent SQL injection?** | Parameterized queries ($1, $2 in pg) / Prisma ORM |
| **What is CORS?** | Cross-Origin Resource Sharing — controlled by Access-Control headers |
| **Cluster vs Worker Threads?** | Cluster=multiple processes for HTTP; Workers=CPU tasks in same process |

### Key npm Packages Reference

```
Security:       helmet, cors, express-rate-limit, csurf
Auth:           jsonwebtoken, bcryptjs, passport, passport-google-oauth20
Validation:     joi, zod, express-validator
DB:             mongoose, pg, prisma, sequelize
Cache/Queue:    redis, bull, bullmq, kafkajs
File Upload:    multer, cloudinary, @aws-sdk/client-s3
Real-time:      socket.io, mqtt
Payments:       stripe, razorpay
Logging:        winston, morgan
Testing:        jest, supertest, mocha, chai
Utilities:      dotenv, compression, uuid, slugify
Process:        pm2, nodemon, cross-env
```

### HTTP Status Codes (Quick Ref)

```
200 OK          201 Created     204 No Content
400 Bad Request 401 Unauthorized 403 Forbidden
404 Not Found   409 Conflict    422 Unprocessable
429 Too Many    500 Server Error 503 Unavailable
```

---

> 💡 **Pro Tip for Senior Interviews**: Always mention **trade-offs**, **scalability**, and **failure scenarios**.
> E.g., "I'd use Redis for caching but handle cache stampede with a lock, and use Redis Sentinel for HA."
