export function sortByBits(arr: number[]): number[] {
  const sorted = arr.sort((a, b) => a - b);
  const bits: number[] = [];

  for (const n of sorted) {
    let local = n;
    let ones = 0;
    while (local != 0) {
      const one = Math.abs(local % 2);
      ones += one;
      if (one == 1) {
        local = local - 1;
      }
      local = local / 2;
    }
    bits.push(ones);
  }

  const sortedByBits = sorted.map((e, i) => ({ e, bits: bits[i] }));
  sortedByBits.sort((a, b) => a.bits - b.bits);
  return sortedByBits.map((e) => e.e);
}
