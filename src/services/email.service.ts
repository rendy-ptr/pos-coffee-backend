import { emailRepository } from '@/repositories/email.repository';
import { CreateCashierDTO } from '@/features/admin-role/cashier/schemas/cashier.schema';
import { emailTemplates } from '@/emails/template.email';

export class EmailService {
  async sendNewAccountNotification(
    data: CreateCashierDTO,
    plainPassword: string
  ): Promise<void> {
    const { subject, text, html } = emailTemplates.newCashierAccount(
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
