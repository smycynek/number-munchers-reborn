


export function isPerfectSquare(value: number): boolean {
  return (Math.sqrt(value) === Math.floor(Math.sqrt(value)));
}



export function isFactor(candidateFactor: number, target: number): boolean {
  return ((target % candidateFactor) === 0);
}

export function isMultiple(target: number, base: number) {
  return ((target % base) === 0);
}
