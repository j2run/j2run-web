import moment from 'moment';

export function formatVnd(money: number) {
  return money.toLocaleString('it-IT', {style : 'currency', currency : 'VND'}).replace('VND', 'vnđ');
}

export function formatCpu(cpu: number) {
  if (cpu === -1) {
    return 'CPU: shared'
  }
  return 'CPU: ' + cpu;
}

export function formatSecondsToTime(seconds: number) {
  const duration = moment.duration(seconds, 'seconds');

  if (duration.asSeconds() >= 86400) {
    return duration.asDays() + ' ngày';
  }

  if (duration.asSeconds() >= 3600) {
    return duration.hours() + ' giờ';
  }

  if (duration.asSeconds() >= 60) {
    return duration.minutes() + ' phút';
  }

  return `${seconds} giây`;
}

export function list2map<T>(objs: T[], key: keyof T) {
  return objs.reduce<SMap<T>>((val, item) => {
    val[item[key] as string] = item;
    return val;
  }, {});
}