import { env } from '../config/env';
import { redis } from '../config/redis';
import { EmailService } from './email.service';
import { SmsService } from './sms.service';
import { logger } from '../utils/logger';

/**
 * Notification dispatch abstraction.
 *
 * Two execution modes, chosen automatically:
 *  - **Queued** (persistent host with Redis + running BullMQ workers): jobs are
 *    pushed onto `emailQueue` / `smsQueue` and processed by the workers in
 *    `src/workers`. This is what `server.ts` runs.
 *  - **Inline** (Vercel serverless, or no Redis): there is no always-on worker
 *    to drain a queue, so the email/SMS is sent directly within the request.
 *
 * All dispatch is best-effort: failures are logged but never bubble up to break
 * the originating request (e.g. a signup should still succeed if email fails).
 */

const emailService = new EmailService();
const smsService = new SmsService();

// Only enqueue when a worker process will actually consume the jobs.
const useQueue = !env.isServerless && !!redis;

type EmailJob =
  | { name: 'welcome'; data: { to: string; name: string } }
  | { name: 'bookingConfirmation'; data: { to: string; name: string; bookingRef: string; date: string } }
  | { name: 'passwordReset'; data: { to: string; resetLink: string } };

type SmsJob =
  | { name: 'bookingReminder'; data: { phone: string; date: string } }
  | { name: 'cleanerAssigned'; data: { phone: string; bookingRef: string } }
  | { name: 'dispatchNotification'; data: { phone: string; message: string } };

async function runEmailInline(job: EmailJob) {
  switch (job.name) {
    case 'welcome':
      return emailService.sendWelcomeEmail(job.data.to, job.data.name);
    case 'bookingConfirmation':
      return emailService.sendBookingConfirmation(
        job.data.to,
        job.data.name,
        job.data.bookingRef,
        job.data.date
      );
    case 'passwordReset':
      return emailService.sendPasswordReset(job.data.to, job.data.resetLink);
  }
}

async function runSmsInline(job: SmsJob) {
  switch (job.name) {
    case 'bookingReminder':
      return smsService.sendSms(
        job.data.phone,
        `Reminder: Your Clean9ja cleaner will arrive on ${job.data.date}.`
      );
    case 'cleanerAssigned':
      return smsService.sendSms(
        job.data.phone,
        `A cleaner has been assigned to your booking (${job.data.bookingRef}).`
      );
    case 'dispatchNotification':
      return smsService.sendSms(job.data.phone, `Clean9ja: ${job.data.message}`);
  }
}

export async function dispatchEmail(job: EmailJob): Promise<void> {
  try {
    if (useQueue) {
      const { emailQueue } = await import('../workers/queues');
      await emailQueue.add(job.name, job.data);
    } else {
      await runEmailInline(job);
    }
  } catch (err) {
    logger.error(`Failed to dispatch email job "${job.name}"`, err);
  }
}

export async function dispatchSms(job: SmsJob): Promise<void> {
  try {
    if (useQueue) {
      const { smsQueue } = await import('../workers/queues');
      await smsQueue.add(job.name, job.data);
    } else {
      await runSmsInline(job);
    }
  } catch (err) {
    logger.error(`Failed to dispatch SMS job "${job.name}"`, err);
  }
}
