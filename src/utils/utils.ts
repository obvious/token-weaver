export function equalsCheck(a: any[], b: any[]): Boolean {
  return a.length === b.length && a.every((v, i) => v === b[i]);
}
