import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendMail(to: string, subject: string, html: string): Promise<any> {
    console.log('Checkpoint A');
    await this.mailerService.sendMail({
      to,
      subject,
      html,
    });
    console.log('Checkpoint B');
  }
}
