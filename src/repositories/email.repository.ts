import { transporter } from '@/utils/email';
import { baseLogger } from '@/middlewares/logger';

export interface SendEmailParams {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

export class EmailRepository {
  async sendEmail(params: SendEmailParams): Promise<void> {
    const { to, subject, text, html } = params;

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      text,
      html,
    });

    baseLogger.info(`Email dikirim ke: ${to}`);
  }
}

export const emailRepository = new EmailRepository();
