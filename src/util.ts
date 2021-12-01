export const rand = (min: number = 0, max: number = 1) => Math.random() * (max - min) + min;
export const randInt = (min: number = 0, max: number = 10) => Math.round(rand(min, max));
export const isEven = (num: number) =>  (num & (num - 1)) === 0;

export const randPick = <T> (arr: T[]): T => arr[randInt(0, arr.length - 1)];