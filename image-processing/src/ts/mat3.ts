import Vec3 from './vec3';

export default class Mat3 extends Array {
  constructor(data?: Mat3 | Vec3 | number[], v2?: Vec3, v3?: Vec3) {
    if (data != null && v2 != null && v3 != null) {
      super();
    } else if (data != null) {
      super();
    } else {
      super(9);
      this.fill(0);
    }
  }

  public asArray() {
    return [];
  }

  public asObject() {
    return {};
  }

  public toString() {
    return ``;
  }
}
