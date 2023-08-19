export interface IEmailService {
  sendMail(to: string, subject: string, text: string);
}
