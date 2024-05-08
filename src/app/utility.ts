export function hasTouch(): boolean {
  return ('ontouchstart' in window);
}

export function wrapUp(value: number, max: number): number {
  if (value === max - 1) {
    return 0;
  }
  return value + 1;
}

export function wrapDown(value: number, max: number): number {
  if (value === 0) {
    return max - 1;
  }
  return value - 1;
}

export function parseId(cellId: string): number[] {
  cellId = cellId.replace("i", "");
  const parsed = [Number(cellId[0]), Number(cellId[1])];
  if (parsed.length != 2 || isNaN(parsed[0]) || isNaN(parsed[1])) {
    throw new Error("Not a cell id");
  }
  return parsed;
}

let LOG = false;
export function toggleLog(): void {
  LOG = !LOG;
}

export function debug(message: string) {
  if (LOG) {
  console.log(message)
  }
}