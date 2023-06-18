import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly transporter: nodemailer.Transporter;
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'sandbox.smtp.mailtrap.io',
      port: 2525,
      auth: {
        user: 'a568eb30ced0f8',
        pass: 'a8bfa243f79590',
      },
    });
  }

  async sendMail(to: string, subject: string, text: string) {
    try {
      const mailOptions = {
        from: 'gustavopereirafacal@gmail.com',
        to,
        subject,
        text,
      };

      await this.transporter.sendMail(mailOptions);

      return { message: 'Email sent successfully' };
    } catch (error) {
      throw new Error(`Failed to send email ${error}`);
    }
  }
}
