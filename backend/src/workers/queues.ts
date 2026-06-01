import { Queue } from 'bullmq';
import { env } from '../config/env';
import Redis from 'ioredis';

const connection = new Redis(env.redisUrl, { maxRetriesPerRequest: null });

export const emailQueue = new Queue('emailQueue', { connection: connection as any });
export const smsQueue = new Queue('smsQueue', { connection: connection as any });
export const bookingQueue = new Queue('bookingQueue', { connection: connection as any });
