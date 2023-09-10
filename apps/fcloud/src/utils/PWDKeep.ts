import { PWDocker } from './PWDocker';

export class PWDKeep {
  timer: NodeJS.Timeout;

  constructor(private pwd: PWDocker) {}

  keep() {
    if (this.timer) {
      clearTimeout(this.timer);
    }
    this.onKeep();
  }

  release() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  private onKeep() {
    for (const id in this.pwd.listCloud) {
      this.pwd.sendCommand(id, 'id');
    }
    this.timer = setTimeout(() => this.onKeep(), 20000);
  }
}
