import { Vec3 } from './vec3';
import { IVec3Array, IVec3Object } from './vec3.interface';
import { toRad } from './math';

export class Mat3 {
  public static translation(x: number, y?: number): Mat3 {
    const _y = y != null ? y : x;
    return new Mat3([1, 0, x, 0, 1, _y, 0, 0, 1]);
  }

  public static scaling(x: number, y?: number): Mat3 {
    const _y = y != null ? y : x;
    return new Mat3([x, 0, 0, 0, _y, 0, 0, 0, 1]);
  }

  public static rotation(deg: number): Mat3 {
    const rad = toRad(deg);
    const s = Math.sin(rad);
    const c = Math.cos(rad);
    return new Mat3([c, -s, 0, s, c, 0, 0, 0, 1]);
  }

  public static compose(m: Mat3, n: Mat3): Mat3 {
    return new Mat3(m).compose(n);
  }

  public static mul(m: Mat3, v: Vec3): Vec3 {
    return new Vec3(
      m._v[0] * v.x + m._v[1] * v.y + m._v[2] * v.z,
      m._v[3] * v.x + m._v[4] * v.y + m._v[5] * v.z,
      m._v[6] * v.x + m._v[7] * v.y + m._v[8] * v.z
    );
  }

  public static transpose(m: Mat3): Mat3 {
    return new Mat3([
      m._v[0],
      m._v[3],
      m._v[6],
      m._v[1],
      m._v[4],
      m._v[7],
      m._v[2],
      m._v[5],
      m._v[8]
    ]);
  }

  private _v: number[];

  constructor(
    v1?: Vec3 | IVec3Array | Mat3 | number[],
    v2?: Vec3 | IVec3Array,
    v3?: Vec3 | IVec3Array
  ) {
    if (v1 != null) {
      if (v2 != null && v3 != null) {
        this._v = new Array();
        [
          v1 as IVec3Array | Vec3,
          v2 as IVec3Array | Vec3,
          v3 as IVec3Array | Vec3
        ].forEach((v) => {
          const a = v instanceof Vec3 ? v.asArray() : v;
          this._v.push(...a);
        });
      } else {
        this._v =
          v1 instanceof Mat3 ? v1.asArray() : (v1 as number[]).slice(0, 9);
      }
    } else {
      this._v = new Array(9);
      this._v.fill(0);
      this._v[0] = this._v[4] = this._v[8] = 1.0;
    }
  }

  public at(r: number, c: number): number {
    return this._v[c * 3 + r];
  }

  public compose(m: Mat3): this {
    const n = new Array(9);
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        n[r * 3 + c] =
          this._v[r * 3] * m._v[c] +
          this._v[r * 3 + 1] * m._v[3 + c] +
          this._v[r * 3 + 2] * m._v[6 + c];
      }
    }
    this._v = n;
    return this;
  }

  public transpose(): this {
    this._v = [
      this._v[0],
      this._v[3],
      this._v[6],
      this._v[1],
      this._v[4],
      this._v[7],
      this._v[2],
      this._v[5],
      this._v[8]
    ];
    return this;
  }

  public asArray() {
    return this._v.slice(0);
  }

  public asGLArray() {
    return Mat3.transpose(this).asArray();
  }

  public toString() {
    return `
      \n| ${this._v[0].toFixed(2)}, ${this._v[1].toFixed(
      2
    )}, ${this._v[2].toFixed(2)}|\n
      \n| ${this._v[3].toFixed(2)}, ${this._v[4].toFixed(
      2
    )}, ${this._v[5].toFixed(2)}|\n
      \n| ${this._v[6].toFixed(2)}, ${this._v[7].toFixed(
      2
    )}, ${this._v[8].toFixed(2)}|\n
    `;
  }
}
