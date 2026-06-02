import 'dotenv/config';
import app from './app';
import { config } from './config/env';
import logger from './config/logger';

const startServer = async () => {
    try {
        const server = app.listen(config.PORT, () => {
            logger.info(`${config.SERVICE_NAME} is running on port http://localhost:${config.PORT}`);
        })
    } catch (error) {
        logger.error(`Failed to start ${config.SERVICE_NAME}:`, error);
        process.exit(1);
    }
}
startServer();