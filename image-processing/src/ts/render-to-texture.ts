import { createAndSetupTexture } from './utility';

export interface FramebufferTextureCouple {
  framebuffer: WebGLFramebuffer | null;
  texture: WebGLTexture;
}

export default class RenderToTexture {
  private static readonly numCouples: number = 2;
  private _fbtxCouples: FramebufferTextureCouple[] = [];
  private _activeCoupleIdx: number = 0;

  constructor(
    private _gl: WebGLRenderingContext,
    private _w: number,
    private _h: number
  ) {
    for (let i = 0; i < RenderToTexture.numCouples; i++) {
      const texture = createAndSetupTexture(this._gl);
      this._gl.texImage2D(
        this._gl.TEXTURE_2D,
        0,
        this._gl.RGBA,
        this._w,
        this._h,
        0,
        this._gl.RGBA,
        this._gl.UNSIGNED_BYTE,
        null
      );

      const framebuffer = this._gl.createFramebuffer();
      this._gl.bindFramebuffer(this._gl.FRAMEBUFFER, framebuffer);

      this._gl.framebufferTexture2D(
        this._gl.FRAMEBUFFER,
        this._gl.COLOR_ATTACHMENT0,
        this._gl.TEXTURE_2D,
        texture,
        0
      );

      this._fbtxCouples.push({
        framebuffer,
        texture
      });
    }
  }

  private get _prevCoupleIdx(): number {
    const prevIdx = this._activeCoupleIdx - 1;
    return prevIdx > 0 ? prevIdx : RenderToTexture.numCouples;
  }

  private get _nextCoupleIdx(): number {
    const nextIdx = this._activeCoupleIdx + 1;
    return nextIdx % RenderToTexture.numCouples;
  }

  public get prevCouple(): FramebufferTextureCouple {
    return this._fbtxCouples[this._prevCoupleIdx];
  }

  public get nextCouple(): FramebufferTextureCouple {
    return this._fbtxCouples[this._nextCoupleIdx];
  }

  public get activeCouple(): FramebufferTextureCouple {
    return this._fbtxCouples[this._activeCoupleIdx];
  }

  public switchCouple() {
    this._activeCoupleIdx = this._nextCoupleIdx;
    return this.activeCouple;
  }
}
