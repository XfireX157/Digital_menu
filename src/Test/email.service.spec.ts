import { Test, TestingModule } from '@nestjs/testing';
import { EmailService } from '../Service/email.service';
import { ForbiddenException } from '../Exception/forbidden.exception';

describe('EmailService', () => {
  let emailService: EmailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmailService],
    }).compile();

    emailService = module.get<EmailService>(EmailService);
  });

  it('should be defined', () => {
    expect(emailService).toBeDefined();
  });

  it('should send email successfully', async () => {
    const to = 'example@example.com';
    const subject = 'Test Subject';
    const text = 'Test Email Content';

    const result = await emailService.sendMail(to, subject, text);

    expect(result).toEqual({ message: 'Email sent successfully' });
  });

  it('should throw ForbiddenException if failed to send email', async () => {
    const to = 'example@example.com';
    const subject = 'Test Subject';
    const text = 'Test Email Content';

    jest
      .spyOn(emailService['transporter'], 'sendMail')
      .mockRejectedValueOnce(new Error('Failed to send email'));

    await expect(emailService.sendMail(to, subject, text)).rejects.toThrowError(
      new ForbiddenException('Failed to send email', 404),
    );
  });
});
