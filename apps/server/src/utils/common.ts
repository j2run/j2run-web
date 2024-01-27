export function format(str: string, ...args: string[]) {
  return args.reduce((value, arg) => {
    return value.replace('{}', arg);
  }, str);
}
