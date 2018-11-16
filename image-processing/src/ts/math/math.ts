import { M_CONST } from './math.constant';

export function toRad(deg: number): number {
  return deg * M_CONST.PI_ON_180;
}

export function toDeg(rad: number): number {
  return rad / M_CONST.PI_ON_180;
}

export function clamp(n: number, min: number, max: number): number {
  return n <= min ? min : n >= max ? max : n;
}

export function isZero(n: number): boolean {
  return n > -M_CONST.EPS && n < M_CONST.EPS;
}
