import { Injectable, Logger } from '@nestjs/common';
import { SeleniumService } from './selenium.service';
import { By, WebDriver, until } from 'selenium-webdriver';

@Injectable()
export class PwdService {
  private logger = new Logger(PwdService.name);
  constructor(private readonly seleniumService: SeleniumService) {
    this.test();
  }

  async test() {
    const sessions = await this.seleniumService.getSessions();
    const sessionId = sessions?.[0];
    let driver: WebDriver;
    if (sessionId) {
      driver = await this.seleniumService.getDriverBySession(sessionId);
    } else {
      driver = await this.seleniumService.newDriver();
    }
    // await this.loginDockerHub(driver);
    // await this.startPwd(driver);
    await this.handle(driver);
    // await this.pushSSHKey(driver);
    // await driver.quit();
  }

  async startPwd(driver: WebDriver) {
    this.logger.warn('[play with docker] init...');
    await driver.get('https://labs.play-with-docker.com/');
    const button = await driver.findElement(By.id('btnGroupDrop1'));
    await button.click();

    this.logger.warn('[play with docker] login...');
    const buttonDocker = await driver.findElement(
      By.className('dropdown-item'),
    );
    await driver.wait(until.elementIsVisible(buttonDocker), 1000);
    await buttonDocker.click();

    this.logger.warn('[play with docker] start...');
    const buttonStart = await driver.findElement(By.className('btn-success'));
    await driver.wait(until.elementIsVisible(buttonStart), 5000);
    await buttonStart.click();
  }

  async loginDockerHub(driver: WebDriver) {
    this.logger.warn('[docker hub] init...');
    await driver.get('https://login.docker.com/u/login');

    this.logger.warn('[docker hub] enter username');
    await new Promise((res) => setTimeout(res, 1000));
    const username = await driver.findElement(By.id('username'));
    await driver.wait(until.elementIsVisible(username), 3000);
    await username.click();
    await new Promise((res) => setTimeout(res, 1000));
    await username.sendKeys('wawahuy');

    this.logger.warn('[docker hub] enter username - continue');
    await new Promise((res) => setTimeout(res, 1000));
    const continue1 = await driver.findElement(
      By.xpath("//button[text()='Continue']"),
    );
    continue1.click();

    this.logger.warn('[docker hub] enter password');
    await new Promise((res) => setTimeout(res, 1000));
    const password = await driver.findElement(By.id('password'));
    await driver.wait(until.elementIsVisible(password), 3000);
    await password.click();
    await new Promise((res) => setTimeout(res, 1000));
    await password.sendKeys('adadad1999');

    this.logger.warn('[docker hub] enter password - continue');
    await new Promise((res) => setTimeout(res, 1000));
    const continue2 = await driver.findElement(
      By.css('._button-login-password'),
    );
    continue2.click();

    await driver.wait(
      until.elementsLocated(
        By.xpath('//*[@data-testid="navBarUsernameDropdown"]'),
      ),
      10000,
    );
    this.logger.warn('[docker hub] logged');
    return true;
  }

  async handle(driver: WebDriver) {
    // // click add new instance
    // this.logger.warn('[play with docker] new instance');
    // const locatedNewIntance = By.xpath('//*[@ng-click="newInstance()"]');
    // await driver.wait(until.elementsLocated(locatedNewIntance), 5000);
    // const buttonNewIntance = await driver.findElement(locatedNewIntance);
    // buttonNewIntance.click();

    // // get ssh key
    // this.logger.warn('[play with docker] get ssh url');
    // const locatedSshUrl = By.id('input_3');
    // await driver.wait(until.elementsLocated(locatedSshUrl), 5000);
    // const sshInput = await driver.findElement(locatedSshUrl);
    // const sshUrl = await sshInput.getAttribute('value');
    // this.logger.warn('[play with docker] ' + sshUrl);
  }

  async pushSSHKey(driver: WebDriver) {
    this.logger.warn('[play with docker] push ssh key');
    const sshKey =
      'ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIDpNa3XUn/eTWYdFl3tAqNpTf9gR4ArJAGLtyTPAgfUC yuh@huy-dev';
    const command = `echo '${sshKey}' > ~/.ssh/authorized_keys`;
    this.sendCommand(driver, command);
  }

  async sendCommand(driver: WebDriver, command: string) {
    this.logger.warn('[play with docker] click command');
    const locatedTerminal = By.className('terminal-instance');
    await driver.wait(until.elementsLocated(locatedTerminal), 5000);
    const terminal = await driver.findElement(locatedTerminal);
    await terminal.click();

    this.logger.warn('[play with docker] send command');
    this.logger.warn('[play with docker] ' + command);
    await new Promise((res) => setTimeout(res, 1000));
    const txt = await driver.findElement(By.className('xterm-helper-textarea'));
    await txt.sendKeys(command + '\n');
  }
}
