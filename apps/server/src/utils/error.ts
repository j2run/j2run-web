type OneKey<K extends string, V = any> = {
  [P in K]: Record<P, V> & Partial<Record<Exclude<K, P>, never>> extends infer O
    ? { [Q in keyof O]: O[Q] }
    : never;
}[K];

export class JError extends Error {
  constructor(obj: OneKey<string, string>) {
    super(Object.values(obj)[0]);
    this.name = Object.keys(obj)[0];
  }
}
