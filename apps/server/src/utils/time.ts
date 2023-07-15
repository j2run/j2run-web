import { Logger } from '@nestjs/common';

export const benchmarkRuntime = (name: string) => {
  const t = new Date().getTime();
  const logger = new Logger(name);
  logger.warn('============== start ==============');
  return () => {
    logger.warn(
      `============== end: ${new Date().getTime() - t}ms ==============`,
    );
  };
};
