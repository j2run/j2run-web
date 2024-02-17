import { Injectable, Scope } from '@nestjs/common';
import { Logger, transports, format, createLogger } from 'winston';

const colors = {
  info: '\x1b[36m',
  error: '\x1b[31m',
  warn: '\x1b[33m',
  verbose: '\x1b[43m',
};

@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService {
  name = '';
  logger: Logger;

  constructor() {
    this.logger = createLogger({
      format: format.combine(
        format.errors({ stack: true }),
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
        format.printf(({ timestamp, level, message, stack }) => {
          // eslint-disable-next-line prettier/prettier
          const text = `${timestamp} ${level.toUpperCase()} ${this.name} ${message}`;
          const fullText = stack ? text + '\n' + stack : text;
          const formatColor = `${colors[level]}${fullText}\x1b[0m'`;
          return formatColor;
        }),
      ),
      transports: [
        new transports.Console(),
        //
        // - Write all logs with importance level of `error` or less to `error.log`
        // - Write all logs with importance level of `info` or less to `combined.log`
        //
        // new transports.File({ filename: 'error.log', level: 'error' }),
        // new transports.File({ filename: 'combined.log' }),
      ],
    });
  }

  setContext(name: string) {
    this.name = name;
  }

  error(msg: any) {
    this.logger.error(msg);
  }
}
