import { Worker, Job } from 'bullmq';
import { env } from '../config/env';
import Redis from 'ioredis';
import { EmailService } from '../services/email.service';

const connection = new Redis(env.redisUrl, { maxRetriesPerRequest: null });
const emailService = new EmailService();

export const emailWorker = new Worker('emailQueue', async (job: Job) => {
  console.log(`Processing email job ${job.id} of type ${job.name}:`, job.data);
  
  if (job.name === 'welcome') {
    await emailService.sendWelcomeEmail(job.data.to, job.data.name);
  } else if (job.name === 'bookingConfirmation') {
    await emailService.sendBookingConfirmation(job.data.to, job.data.name, job.data.bookingRef, job.data.date);
  } else if (job.name === 'passwordReset') {
    await emailService.sendPasswordReset(job.data.to, job.data.resetLink);
  }
}, { connection: connection as any });

emailWorker.on('completed', (job) => {
  console.log(`Email job ${job.id} has completed!`);
});

emailWorker.on('failed', (job, err) => {
  console.log(`Email job ${job?.id} has failed with ${err.message}`);
});
