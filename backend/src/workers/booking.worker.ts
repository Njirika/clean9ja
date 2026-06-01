import { Worker, Job } from 'bullmq';
import { env } from '../config/env';
import Redis from 'ioredis';

const connection = new Redis(env.redisUrl, { maxRetriesPerRequest: null });

export const bookingWorker = new Worker('bookingQueue', async (job: Job) => {
  console.log(`Processing Booking job ${job.id}:`, job.data);
  // Booking assignment logic 
  await new Promise((resolve) => setTimeout(resolve, 1000));
}, { connection: connection as any });

bookingWorker.on('completed', (job) => {
  console.log(`Booking job ${job.id} has completed!`);
});

bookingWorker.on('failed', (job, err) => {
  console.log(`Booking job ${job?.id} has failed with ${err.message}`);
});
