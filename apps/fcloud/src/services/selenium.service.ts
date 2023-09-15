import { Injectable } from '@nestjs/common';
import nodeFetch from 'node-fetch';
import { gqlGetSessions } from '../utils/constants';
import {
  WebDriver,
  Session,
  Capabilities,
  Browser,
  Builder,
} from 'selenium-webdriver';
import { HttpClient, Executor } from 'selenium-webdriver/http';

@Injectable()
export class SeleniumService {
  private readonly server = 'http://j2-selenium-hub:4444/wd/hub';
  private readonly serverQL = 'http://j2-selenium-hub:4444/graphql';

  constructor() {
    this.getSessions().then((r) => console.log(r));
  }

  async getSessions(): Promise<string[]> {
    return await nodeFetch(this.serverQL, {
      body: JSON.stringify({
        operationName: 'GetSessions',
        variables: {},
        query: gqlGetSessions,
      }),
      method: 'POST',
    })
      .then((r) => r.json())
      .then((r) => r.data.sessionsInfo.sessions?.map((session) => session.id));
  }

  async getDriverBySession(sessionId: string): Promise<WebDriver> {
    const client: HttpClient = new HttpClient(this.server);
    const executor: Executor = new Executor(client);
    const session: Session = new Session(sessionId, Capabilities.chrome());
    return new WebDriver(session, executor);
  }

  newDriver() {
    return new Builder()
      .forBrowser(Browser.CHROME)
      .usingServer(this.server)
      .build();
  }
}
