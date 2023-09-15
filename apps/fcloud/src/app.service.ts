import { Injectable } from '@nestjs/common';
import { PWDocker } from './utils/PWDocker';
import { PWDKeep } from './utils/PWDKeep';
import {
  Browser,
  Builder,
  WebDriver,
  Session,
  Capabilities,
} from 'selenium-webdriver';
import nodeFetch from 'node-fetch';
import { HttpClient, Executor } from 'selenium-webdriver/http';

@Injectable()
export class AppService {
  constructor() {
    // const cookie =
    //   '_biz_uid=8ed0cb8f9748463ddafd8f05497ff323; ajs_anonymous_id=4a205da6-814c-4333-9a45-06cdcf6712df; _biz_flagsA=%7B%22Version%22%3A1%2C%22ViewThrough%22%3A%221%22%2C%22XDomain%22%3A%221%22%7D; id=MTY5NDI0NzczMHxIR3d0T1ZiNUpUYjJaSXFoZmdtWDBMVFpZQkxzaFVzUXU0WU1GbWEwZHVJUUVPR19SLU1VN1Q3S09fTkpFVXFaZmlwd1dCRkM1am5YZm1MUEJ4YWlnR1JxeEpkZHF4Qm9WaGFBYzdPUUE1T1ZTc2JINEZPNERLdmhkNmhGc2Qwd2Q5SXNuTXl5NWI0Z1ItZFpyUm5maWEyS0dwT1lUTUlHdFNmTEtRZWt1Q2R2SFBvWWdsd0wyZi1yRC1OS21XeVNrZEs5SGItSnNISllrX0JRYjRsdWx6VmY0TVFtZjhuWk9vWmFKVkRzRXpORUVJX0YzUTNJcWtraTY2cDRxeXVPelZSZ0JaMWp8vAXQGZXFlOCtAT6HC3-u2qiz6btJo271eHm8lslxrKk=; ajs_user_id=3567d62f-80b4-4e72-aaa4-9d3a18f8eb1b; _biz_sid=886a31; _ga=GA1.2.1577267878.1694247736; _gid=GA1.2.188143742.1694247736; _gat=1; _biz_nA=4; _ga_5219ZE0FPY=GS1.2.1694247737.1.1.1694248013.0.0.0; _biz_pendingA=%5B%5D';
    // const id = 'cju2mdefml8g00en2ceg';
    // const pwdocker = new PWDocker(id, cookie);
    // pwdocker.connect().then(() => {
    //   const pwdKeep = new PWDKeep(pwdocker);
    //   pwdKeep.keep();
    // });
  }

  getHello(): string {
    return 'Hello World!';
  }
}
