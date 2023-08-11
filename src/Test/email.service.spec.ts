import { Test, TestingModule } from '@nestjs/testing';
import { EmailService } from '../Service/email.service';
import { ForbiddenException } from '../Exception/forbidden.exception';
import { ConfigService } from '@nestjs/config';

class MockConfigService {
  get(key: string) {
    // Implement your mock logic here based on the expected behavior
    // Return appropriate values for HOST_MAIL, PORT_MAIL, USER_MAIL, PASS_MAIL
  }
}

describe('EmailService', () => {
  let emailService: EmailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailService,
        {
          provide: ConfigService,
          useClass: MockConfigService,
        },
      ],
    }).compile();

    emailService = module.get<EmailService>(EmailService);
  });

  it('should be defined', () => {
    expect(emailService).toBeDefined();
  });

  describe('sendEmail', () => {
    it('should send email successfully', async () => {
      const to = 'example@example.com';
      const subject = 'Test Subject';
      const text = 'Test Email Content';

      try {
        await emailService.sendMail(to, subject, text);
      } catch (error) {
        expect(error).toBeInstanceOf(ForbiddenException);
        expect(error.message).toBe('Failed to send email');
      }
    });
  });
});
