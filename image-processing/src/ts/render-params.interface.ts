import { Mat3 } from './math';

export default interface RenderParams {
  image: HTMLImageElement;
  kernels: number[][];
  transformMatrix: Mat3;
}
