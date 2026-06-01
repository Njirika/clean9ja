import { env } from '../config/env';

export class SmsService {
  async sendSms(to: string, message: string) {
    // Standardize phone number format if needed
    // Assuming 'to' is a Nigerian number, e.g., '2348012345678'
    const payload = {
      to,
      from: env.termii.senderId,
      sms: message,
      type: 'plain',
      channel: 'generic',
      api_key: env.termii.apiKey,
    };

    if (env.nodeEnv === 'development' || !env.termii.apiKey) {
      console.log('--- MOCKED SMS DISPATCH ---');
      console.log(`To: ${to}`);
      console.log(`Message: ${message}`);
      console.log('---------------------------');
      return { message: 'Mocked SMS sent successfully', message_id: `mock-${Date.now()}` };
    }

    const response = await fetch('https://api.ng.termii.com/api/sms/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (!response.ok) {
      console.error('Termii SMS Error:', data);
      throw new Error(data.message || 'Failed to send SMS');
    }

    return data;
  }
}
