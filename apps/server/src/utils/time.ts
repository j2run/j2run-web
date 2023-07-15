import { Logger } from '@nestjs/common';

export const benchmarkRuntime = (name: string) => {
  const t = new Date().getTime();
  const logger = new Logger(name);
  logger.debug('============== start ==============');
  return () => {
    logger.debug(
      `============== end: ${new Date().getTime() - t}ms ==============`,
    );
  };
};
