import { Resend } from 'resend';
import { env } from '../config/env';

const resend = new Resend(env.resendApiKey || 're_mock_key');
const FROM_EMAIL = 'CleanNaija <hello@cleannaija.com>';

export class EmailService {
  private wrapInLayout(content: string, title: string) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>${title}</title>
        <style>
          body { font-family: 'Inter', sans-serif; background-color: #f9f9f9; padding: 20px; color: #333; }
          .container { max-width: 600px; margin: 0 auto; background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
          .header { text-align: center; margin-bottom: 20px; }
          .header img { max-width: 150px; }
          .content { line-height: 1.6; }
          .footer { text-align: center; margin-top: 30px; font-size: 0.8em; color: #777; border-top: 1px solid #eee; padding-top: 10px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>CleanNaija</h2>
          </div>
          <div class="content">
            ${content}
          </div>
          <div class="footer">
            &copy; ${new Date().getFullYear()} CleanNaija. All rights reserved.
          </div>
        </div>
      </body>
      </html>
    `;
  }

  async sendWelcomeEmail(to: string, name: string) {
    const content = `
      <h3>Welcome to CleanNaija, ${name}!</h3>
      <p>We are thrilled to have you on board. You can now book premium cleaning services effortlessly.</p>
      <p>Get started by exploring our services and let us keep your spaces pristine.</p>
    `;
    return resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: 'Welcome to CleanNaija!',
      html: this.wrapInLayout(content, 'Welcome to CleanNaija'),
    });
  }

  async sendBookingConfirmation(to: string, name: string, bookingRef: string, date: string) {
    const content = `
      <h3>Booking Confirmed!</h3>
      <p>Hi ${name},</p>
      <p>Your booking (<strong>${bookingRef}</strong>) for ${date} has been successfully confirmed.</p>
      <p>We will notify you once a cleaner is assigned.</p>
    `;
    return resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: 'Your CleanNaija Booking Confirmation',
      html: this.wrapInLayout(content, 'Booking Confirmation'),
    });
  }

  async sendPasswordReset(to: string, resetLink: string) {
    const content = `
      <h3>Password Reset Request</h3>
      <p>We received a request to reset your password. Click the link below to set a new password:</p>
      <p><a href="${resetLink}" style="background-color:#0066cc;color:#fff;padding:10px 15px;text-decoration:none;border-radius:5px;">Reset Password</a></p>
      <p>If you didn't request this, please ignore this email.</p>
    `;
    return resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: 'Reset your CleanNaija password',
      html: this.wrapInLayout(content, 'Password Reset'),
    });
  }
}
