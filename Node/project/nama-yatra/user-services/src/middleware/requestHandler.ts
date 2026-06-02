import { type Request, type Response, type NextFunction } from 'express';
import logger from '../config/logger';

const requesLoggertHandler = (req: Request, res: Response, next: NextFunction) => {
    logger.debug(`Incoming request: ${req.method} ${req.url}`);
    const start = Date.now();

    res.on('finish', () => {
        const duration = Date.now() - start;
        logger.debug(`Request processed: ${req.method} ${req.url} - ${res.statusCode} (${duration}ms)`);
    });

    next();
}

export default requesLoggertHandler;