export default class Vec3 {
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

  public static len(u: Vec3): number {
    return Math.sqrt(Vec3.dot(u, u));
  }

  private _x: number;
  private _y: number;
  private _z: number;

  constructor();
  constructor(x: number);
  constructor(x: number, y: number, z: number);
  constructor(x?: number, y?: number, z?: number) {
    if (x != null && y != null && z != null) {
      this._x = x;
      this._y = y;
      this._z = z;
    } else if (x != null) {
      this._x = this._y = this._z = x;
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

  public add(v: Vec3) {
    return this;
  }

  public sub(v: Vec3) {}

  public mul() {}

  public div() {}

  public asArray(): number[] {
    return [this._x, this._y, this._z];
  }

  public toString() {
    return `(${this._x.toFixed(2)}, ${this._y.toFixed(2)}, ${this._z.toFixed(
      2
    )})`;
  }
}
