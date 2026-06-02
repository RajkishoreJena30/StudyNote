import cors from 'cors';
import { config } from '../config/env';

const corsOptions: cors.CorsOptions = {
    origin: config.ALLOWED_ORIGINS.split(','),
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
        'Origin',
        'X-Requested-With',
        'Content-Type',
        'Accept',
        'Authorization'
    ],
    credentials: true,
};

export default cors(corsOptions);