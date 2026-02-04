import { emailRepository } from '@/repositories/email.repository';
import { CreateKasirDTO } from '@schemas/kasir.schema';
import { emailTemplates } from '@/emails/template.email';

export class EmailService {
  async sendNewAccountNotification(
    data: CreateKasirDTO,
    plainPassword: string
  ): Promise<void> {
    const { subject, text, html } = emailTemplates.newKasirAccount(
      data.name,
      data.email,
      plainPassword
    );

    await emailRepository.sendEmail({
      to: data.email,
      subject,
      text,
      html,
    });
  }
}

export const emailService = new EmailService();
