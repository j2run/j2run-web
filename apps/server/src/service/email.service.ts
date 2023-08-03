import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SIBService } from './sib.service';
import * as handlebars from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class EmailService {
  constructor(
    private readonly configService: ConfigService,
    private readonly sibService: SIBService,
  ) {}

  sendVerifyEmail(to: string, verifyToken: string) {
    const subject = '[J2RUN] Xác thực tài khoản';
    const link = this.configService.get('J2_VERIFY_LINK') + verifyToken;
    const template = fs.readFileSync(
      path.join(__dirname, '../templates/email-verify.hbs'),
      'utf8',
    );
    const compiledTemplate = handlebars.compile(template);
    const html = compiledTemplate({
      subject,
      link,
    });

    return this.sibService.sendEmail(to, subject, html);
  }
}
