import { Resend } from 'resend';
import { env } from '../config/env';
import { logger } from '../utils/logger';

const resend = new Resend(env.resendApiKey || 're_mock_key');

// Brand palette (matches the website).
const BRAND = {
  green: '#1B5E20',
  greenDark: '#144718',
  gold: '#FFC107',
  orange: '#FF5722',
  ink: '#1f2937',
  muted: '#6b7280',
  phone: '0800-CLEAN-9JA',
  site: 'https://clean9ja.com',
};

export class EmailService {
  /** Branded, responsive HTML shell shared by every transactional email. */
  private wrapInLayout(opts: { title: string; preheader?: string; body: string }) {
    const { title, preheader = '', body } = opts;
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:'Segoe UI',Helvetica,Arial,sans-serif;color:${BRAND.ink};">
  <span style="display:none!important;visibility:hidden;opacity:0;height:0;width:0;overflow:hidden;">${preheader}</span>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:24px 0;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.08);">
        <!-- Header -->
        <tr><td style="background:${BRAND.green};padding:28px 32px;">
          <table role="presentation" cellpadding="0" cellspacing="0"><tr>
            <td>
              <a href="${BRAND.site}"><img src="${BRAND.site}/logo.png" alt="Clean9ja - Spotless Every Surface" height="44" style="display:block; border:0; outline:none; text-decoration:none;" /></a>
            </td>
          </tr></table>
        </td></tr>
        <!-- Body -->
        <tr><td style="padding:36px 32px;font-size:15px;line-height:1.65;color:${BRAND.ink};">
          ${body}
        </td></tr>
        <!-- CTA divider -->
        <tr><td style="padding:0 32px;"><hr style="border:none;border-top:1px solid #eef0f2;margin:0;"></td></tr>
        <!-- Footer -->
        <tr><td style="padding:24px 32px;background:#fafafa;">
          <p style="margin:0 0 6px;font-size:12px;color:${BRAND.muted};">
            Need help? Call <a href="tel:${BRAND.phone}" style="color:${BRAND.green};text-decoration:none;font-weight:700;">${BRAND.phone}</a>
            or reply to this email.
          </p>
          <p style="margin:0;font-size:11px;color:#9ca3af;">
            Clean9ja — professional cleaning across all 36 states &amp; the FCT.<br>
            <a href="${BRAND.site}" style="color:${BRAND.muted};">${BRAND.site}</a> ·
            &copy; ${new Date().getFullYear()} Clean9ja. All rights reserved.
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
  }

  private button(label: string, href: string) {
    return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px 0;"><tr>
      <td style="background:${BRAND.orange};border-radius:6px;">
        <a href="${href}" style="display:inline-block;padding:14px 28px;color:#ffffff;font-weight:700;font-size:14px;text-decoration:none;text-transform:uppercase;letter-spacing:1px;">${label}</a>
      </td></tr></table>`;
  }

  /** Send via Resend with shared from/reply-to; logs and never throws. */
  private async send(to: string, subject: string, html: string) {
    try {
      const result = await resend.emails.send({
        from: env.resendFrom,
        to,
        replyTo: env.resendReplyTo,
        subject,
        html,
      });
      if ((result as any)?.error) {
        logger.error(`Resend rejected email to ${to}: ${JSON.stringify((result as any).error)}`);
      }
      return result;
    } catch (err) {
      logger.error(`Failed to send email to ${to}`, err);
      throw err;
    }
  }

  async sendWelcomeEmail(to: string, name: string) {
    const body = `
      <h1 style="margin:0 0 16px;font-size:24px;color:${BRAND.green};">Welcome to Clean9ja, ${name}! 🎉</h1>
      <p style="margin:0 0 12px;">We're thrilled to have you on board. You can now book premium, NIN-verified cleaning teams for your home or business in about 60 seconds.</p>
      <p style="margin:0 0 4px;">Every clean is backed by our <strong>100% Satisfaction Guarantee</strong> — if you're not happy, we re-clean for free.</p>
      ${this.button('Book your first clean', `${BRAND.site}/book`)}
      <p style="margin:0;font-size:13px;color:${BRAND.muted};">Spotless. Guaranteed. Nationwide.</p>`;
    return this.send(to, 'Welcome to Clean9ja! 🧹', this.wrapInLayout({ title: 'Welcome to Clean9ja', preheader: 'Book premium cleaning in 60 seconds.', body }));
  }

  async sendBookingConfirmation(to: string, name: string, bookingRef: string, date: string) {
    const body = `
      <h1 style="margin:0 0 16px;font-size:24px;color:${BRAND.green};">Booking confirmed ✅</h1>
      <p style="margin:0 0 12px;">Hi ${name}, your Clean9ja booking is confirmed. Here are the details:</p>
      <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin:0 0 8px;border:1px solid #eef0f2;border-radius:8px;">
        <tr><td style="padding:14px 16px;border-bottom:1px solid #eef0f2;font-size:13px;color:${BRAND.muted};">Reference</td>
            <td style="padding:14px 16px;border-bottom:1px solid #eef0f2;font-size:14px;font-weight:700;text-align:right;">${bookingRef}</td></tr>
        <tr><td style="padding:14px 16px;font-size:13px;color:${BRAND.muted};">Scheduled date</td>
            <td style="padding:14px 16px;font-size:14px;font-weight:700;text-align:right;">${date}</td></tr>
      </table>
      <p style="margin:12px 0;">We'll notify you as soon as a verified cleaner is assigned. You can track everything from your dashboard.</p>
      ${this.button('View my bookings', `${BRAND.site}/dashboard`)}`;
    return this.send(to, `Your Clean9ja booking ${bookingRef} is confirmed`, this.wrapInLayout({ title: 'Booking Confirmation', preheader: `Booking ${bookingRef} confirmed for ${date}.`, body }));
  }

  async sendPasswordReset(to: string, resetLink: string) {
    const body = `
      <h1 style="margin:0 0 16px;font-size:24px;color:${BRAND.green};">Reset your password</h1>
      <p style="margin:0 0 12px;">We received a request to reset your Clean9ja password. Click the button below to choose a new one. This link expires in 1 hour.</p>
      ${this.button('Reset password', resetLink)}
      <p style="margin:0 0 8px;font-size:13px;color:${BRAND.muted};">If the button doesn't work, copy and paste this link:<br><a href="${resetLink}" style="color:${BRAND.green};word-break:break-all;">${resetLink}</a></p>
      <p style="margin:12px 0 0;font-size:13px;color:${BRAND.muted};">Didn't request this? You can safely ignore this email — your password won't change.</p>`;
    return this.send(to, 'Reset your Clean9ja password', this.wrapInLayout({ title: 'Password Reset', preheader: 'Reset your Clean9ja password.', body }));
  }
}
