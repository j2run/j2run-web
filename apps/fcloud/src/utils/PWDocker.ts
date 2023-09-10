import { Logger } from '@nestjs/common';
import { WebSocket } from 'ws';

export class PWDocker {
  private logger = new Logger('PWDocker');
  private address: string;
  private headers: { [key: string]: string };
  private ws: WebSocket;
  listCloud: {
    [key: string]: {
      cpu: string;
      mem: string;
    };
  } = {};

  constructor(id: string, cookie: string) {
    this.address = `wss://labs.play-with-docker.com/sessions/${id}/ws/`;
    this.headers = {
      cookie,
    };
  }

  connect() {
    return new Promise<void>((resolve, reject) => {
      this.ws = new WebSocket(this.address, { headers: this.headers });
      this.ws.once('open', () => resolve());
      this.ws.once('error', () => reject());
      this.ws.on('open', this.onOpen.bind(this));
      this.ws.on('message', this.onMessage.bind(this));
      this.ws.on('error', this.onError.bind(this));
      this.ws.on('close', this.onClose.bind(this));
    });
  }

  onMessage(data: any) {
    try {
      data = JSON.parse(data.toString('utf-8'));
    } catch (err) {
      this.logger.error(err);
      return;
    }
    this.logger.warn(data);
    switch (data.name) {
      case 'instance stats':
        const args = data.args;
        args.forEach((arg: any) => {
          const id = arg.instance;
          if (!this.listCloud[id]) {
            this.logger.warn('insert ' + id);
          }
          this.listCloud[id] = {
            cpu: data.cpu,
            mem: data.mem,
          };
        });
        break;
    }
  }

  onError(err: Error) {
    this.logger.warn(err);
  }

  onClose() {
    this.logger.warn(`close ${this.address}`);
  }

  onOpen() {
    this.logger.warn(`open ${this.address}`);
  }

  async sendCommand(id: string, cmdText: string) {
    cmdText += '\r';
    return this._terminalIn(id, cmdText);
  }

  async sendCtrlC(id: string) {
    return this._terminalIn(id, '\u0003');
  }

  private _terminalIn(id: string, cmdText: string) {
    return this.ws.send(
      JSON.stringify({
        name: 'instance terminal in',
        args: [id, cmdText],
      }),
    );
  }
}
