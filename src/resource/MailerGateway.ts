export interface MailerGateway {
  send(receiver: string, subject: string, content: string): Promise<void>;
}

export class MailerGatewayMemory implements MailerGateway {
  async send(receiver: string, subject: string, content: string) {
    console.log(`Sending email to ${receiver} with subject ${subject} and content ${content}`);
  }
}