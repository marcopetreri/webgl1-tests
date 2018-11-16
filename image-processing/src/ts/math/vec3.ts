import { IVec3Object, IVec3Array } from './vec3.interface';

export class Vec3 implements IVec3Object {
  public static neg(u: Vec3): Vec3 {
    return new Vec3(-u.x, -u.y, -u.z);
  }
  public static add(u: Vec3, v: Vec3): Vec3 {
    return new Vec3(u.x + v.x, u.y + v.y, u.z + v.z);
  }

  public static sub(u: Vec3, v: Vec3): Vec3 {
    return new Vec3(u.x - v.x, u.y - v.y, u.z - v.z);
  }

  public static mul(u: Vec3, s: number): Vec3 {
    return new Vec3(u.x * s, u.y * s, u.z * s);
  }

  public static div(u: Vec3, s: number): Vec3 {
    return Vec3.mul(u, 1.0 / s);
  }

  public static dot(u: Vec3, v: Vec3): number {
    return u.x * v.x + u.y * v.y + u.z * v.z;
  }

  public static cross(u: Vec3, v: Vec3): Vec3 {
    return new Vec3(
      u.y * v.z - u.z * v.y,
      u.z * v.x - u.x * v.z,
      u.x * v.y - u.y * v.x
    );
  }

  public static sqlen(u: Vec3): number {
    return Vec3.dot(u, u);
  }

  public static len(u: Vec3): number {
    return Math.sqrt(Vec3.sqlen(u));
  }

  private _x: number;
  private _y: number;
  private _z: number;

  constructor(x?: Vec3 | number, y?: number, z?: number) {
    if (x != null) {
      if (y != null && z != null) {
        this._x = x as number;
        this._y = y;
        this._z = z;
      } else {
        if (typeof x === 'number') {
          this._x = this._y = this._z = x;
        } else {
          this._x = x.x;
          this._y = x.y;
          this._z = x.z;
        }
      }
    } else {
      this._x = this._y = this._z = 0;
    }
  }

  public get x(): number {
    return this._x;
  }

  public get y(): number {
    return this._y;
  }

  public get z(): number {
    return this._z;
  }

  public get r(): number {
    return this._x;
  }

  public get g(): number {
    return this._y;
  }

  public get b(): number {
    return this._z;
  }

  public neg(): this {
    this._x = -this._x;
    this._y = -this._y;
    this._z = -this._z;
    return this;
  }

  public add(v: Vec3): this {
    this._x += v.x;
    this._y += v.y;
    this._z += v.z;
    return this;
  }

  public sub(v: Vec3): this {
    this._x -= v.x;
    this._y -= v.y;
    this._z -= v.z;
    return this;
  }

  public mul(s: number): this {
    this._x *= s;
    this._y *= s;
    this._z *= s;
    return this;
  }

  public div(s: number): this {
    return this.mul(1.0 / s);
  }

  public sqlen(): number {
    return Vec3.dot(this, this);
  }

  public len(): number {
    return Math.sqrt(this.sqlen());
  }

  public asArray(): IVec3Array {
    return [this._x, this._y, this._z];
  }

  public asObject(): IVec3Object {
    return { x: this._x, y: this._y, z: this._z };
  }

  public toString(): string {
    return `(${this._x.toFixed(2)}, ${this._y.toFixed(2)}, ${this._z.toFixed(
      2
    )})`;
  }
}
