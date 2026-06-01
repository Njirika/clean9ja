import { Worker, Job } from 'bullmq';
import { env } from '../config/env';
import Redis from 'ioredis';
import { SmsService } from '../services/sms.service';

const connection = new Redis(env.redisUrl, { maxRetriesPerRequest: null });
const smsService = new SmsService();

export const smsWorker = new Worker('smsQueue', async (job: Job) => {
  console.log(`Processing SMS job ${job.id}:`, job.data);
  
  if (job.name === 'bookingReminder') {
    await smsService.sendSms(job.data.phone, `Reminder: Your Clean9ja cleaner will arrive on ${job.data.date}.`);
  } else if (job.name === 'cleanerAssigned') {
    await smsService.sendSms(job.data.phone, `A cleaner has been assigned to your booking (${job.data.bookingRef}).`);
  } else if (job.name === 'dispatchNotification') {
    await smsService.sendSms(job.data.phone, `Clean9ja: ${job.data.message}`);
  }
}, { connection: connection as any });

smsWorker.on('completed', (job) => {
  console.log(`SMS job ${job.id} has completed!`);
});

smsWorker.on('failed', (job, err) => {
  console.log(`SMS job ${job?.id} has failed with ${err.message}`);
});
