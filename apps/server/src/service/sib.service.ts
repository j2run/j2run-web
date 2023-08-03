import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Brevo from '@getbrevo/brevo';

@Injectable()
export class SIBService {
  constructor(private readonly configService: ConfigService) {
    const defaultClient = Brevo.ApiClient.instance;
    const apiKey = defaultClient.authentications['api-key'];
    apiKey.apiKey = configService.get('J2_SIB_TOKEN');
    const partnerKey = defaultClient.authentications['partner-key'];
    partnerKey.apiKey = configService.get('J2_SIB_TOKEN');
  }

  sendEmail(to: string, subject: string, htmlContent: string): Promise<any> {
    const apiInstance = new Brevo.TransactionalEmailsApi();
    const sendSmtpEmail = new Brevo.SendSmtpEmail();
    sendSmtpEmail.sender = {
      email: this.configService.get('J2_SIB_EMAIL'),
    };
    sendSmtpEmail.subject = subject;
    sendSmtpEmail.htmlContent = htmlContent;
    sendSmtpEmail.to = [{ email: to }];
    return apiInstance.sendTransacEmail(sendSmtpEmail);
  }
}
