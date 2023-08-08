import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ForbiddenException } from '../Exception/forbidden.exception';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  private readonly transporter: nodemailer.Transporter;
  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('HOST_MAIL'),
      port: this.configService.get<number>('PORT_MAIL'),
      auth: {
        user: this.configService.get<string>('USER_MAIL'),
        pass: this.configService.get<string>('PASS_MAIL'),
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
      throw new ForbiddenException('Failed to send email', 404);
    }
  }
}
