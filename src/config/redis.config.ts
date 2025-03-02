import Redis from 'ioredis';
import { config } from 'dotenv';
import { Logger } from '../api/v1/helpers/logger';

config();

//
const redis = new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: Number(process.env.REDIS_PORT) || 6379,
    password: process.env.REDIS_PASSWORD || '',
    db: Number(process.env.REDIS_DB) || 0,
    lazyConnect: true,
    reconnectOnError: (err: Error) => {
        Logger.error(`Redis connection error: ${err.message}`);
        return true;
    },
});

// Handle Redis connection errors
redis.on('error', err => {
    console.error(`Error connecting to Redis: ${err.message}`);
});

// Optionally, handle successful connection
redis.on('connect', () => {
    console.log('Successfully connected to Redis');
});

// Optionally, log when Redis is ready
redis.on('ready', () => {
    console.log('Redis is ready for use');
});

export default redis;
