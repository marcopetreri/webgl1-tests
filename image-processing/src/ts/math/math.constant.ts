import { IVec3Array } from './vec3.interface';

export const enum M_CONST {
  PI = 3.141592653589793,
  INV_PI = 0.3183098861837907,
  TWO_PI = 6.283185307179586,
  INV_TWO_PI = 0.15915494309189535,
  PI_ON_180 = 0.017453292519943295,
  EPS = 1e-6
}

export const AXIS: { [key: string]: IVec3Array } = {
  X: [1, 0, 0],
  Y: [0, 1, 0],
  Z: [0, 0, 1],
  XY: [1, 1, 0],
  YZ: [0, 1, 1],
  ZX: [0, 1, 1],
  XYZ: [1, 1, 1]
};

export const COLOR: { [key: string]: IVec3Array } = {
  BLACK: [0, 0, 0],
  WHITE: [1, 0, 0],
  GREY: [0.5, 0.5, 0.5],
  RED: [1, 0, 0],
  MATTE_RED: [1, 0.25, 0.25],
  GREEN: [0, 1, 0],
  MATTE_GREEN: [0, 1, 0.25],
  BLUE: [0, 0, 1],
  MATTE_BLUE: [0.25, 0.25, 1],
  YELLOW: [1, 1, 0],
  MATTE_YELLOW: [1, 1, 0.25],
  MAGENTA: [1, 0, 1],
  MATTE_MAGENTA: [1, 0.25, 1],
  CYAN: [0, 1, 1],
  MATTE_CYAN: [0.25, 1, 1],
  ORANGE: [1, 0.5, 0],
  MATTE_ORANGE: [1, 0.5, 0.25]
};
