/**
 * Manual verification script for the branded Resend email templates.
 * Usage: npx ts-node -T scripts/send-test-emails.ts <recipient@example.com>
 */
import { EmailService } from '../src/services/email.service';

const to = process.argv[2];
if (!to) {
  console.error('Usage: ts-node scripts/send-test-emails.ts <recipient-email>');
  process.exit(1);
}

const svc = new EmailService();

(async () => {
  console.log(`Sending test emails to ${to} ...`);
  const welcome = await svc.sendWelcomeEmail(to, 'Stanley');
  console.log('welcome:', JSON.stringify(welcome));
  const booking = await svc.sendBookingConfirmation(to, 'Stanley', 'CLN-TEST-001', new Date().toDateString());
  console.log('bookingConfirmation:', JSON.stringify(booking));
  const reset = await svc.sendPasswordReset(to, 'https://clean9ja.com/reset?token=demo-token');
  console.log('passwordReset:', JSON.stringify(reset));
  console.log('Done.');
})().catch((e) => {
  console.error('Send failed:', e);
  process.exit(1);
});
