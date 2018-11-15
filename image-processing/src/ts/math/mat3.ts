import { Vec3 } from './vec3';
import { IVec3Array, IVec3Object } from './vec3.interface';

export class Mat3 {
  private _v: number[];

  constructor(
    v1?: Vec3 | IVec3Array | Mat3,
    v2?: Vec3 | IVec3Array,
    v3?: Vec3 | IVec3Array
  ) {
    if (v1 != null) {
      if (v2 != null && v3 != null) {
        this._v = new Array(9);
        if (v1 instanceof Array && v2 instanceof Array && v3 instanceof Array) {
          this._v.push(...v1, ...v2, ...v3);
        } else {
          this._v.push(
            ...(v1 as Vec3).asArray(),
            ...(v2 as Vec3).asArray(),
            ...(v3 as Vec3).asArray()
          );
        }
      } else {
        this._v = (v1 as Mat3).asArray();
      }
    } else {
      this._v = new Array(9);
      this._v.fill(0);
      this._v[0] = this._v[4] = this._v[8] = 1.0;
    }
  }

  public asArray() {
    return this._v.slice(0);
  }

  public toString() {
    return `
      \n| ${this._v[0]}, ${this._v[3]}, ${this._v[6]}|\n
      \n| ${this._v[1]}, ${this._v[4]}, ${this._v[7]}|\n
      \n| ${this._v[2]}, ${this._v[5]}, ${this._v[8]}|\n
    `;
  }
}
