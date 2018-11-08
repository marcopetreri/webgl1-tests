import {
  randInt,
  setRectangle,
  kernelWeight,
  createAndSetupTexture
} from './utility';
import RenderParams from './render-params.interface';
import RenderToTexture from './render-to-texture';
import Vec3 from './vec3';

export default class Render {
  private _gl: WebGLRenderingContext | null;
  private _program: WebGLProgram | null;
  private _vs: WebGLShader | null;
  private _fs: WebGLShader | null;
  private _renderToTexture: RenderToTexture | null;

  private _uniformLocations: {
    [key: string]: WebGLUniformLocation | null;
  } = {};
  private _attributeLocations: { [key: string]: number } = {};
  private _buffers: { [key: string]: WebGLBuffer | null } = {};

  constructor(canvas: HTMLCanvasElement) {
    this._gl = canvas.getContext('webgl');
    if (this._gl === null) {
      throw new Error('No webgl context available');
    }
    this._program = null;
    this._vs = null;
    this._fs = null;
    this._renderToTexture = null;
  }

  public init(vertexShaderSource: string, fragmentShaderSource: string) {
    if (!this._gl) {
      throw new Error('WebGL context is null');
    }
    this._vs = this._createShader(this._gl.VERTEX_SHADER, vertexShaderSource);
    this._fs = this._createShader(
      this._gl.FRAGMENT_SHADER,
      fragmentShaderSource
    );
    this._program = this._createProgram(this._vs, this._fs);
  }

  public render(renderParams: RenderParams) {
    if (!this._gl || !this._program) {
      throw new Error('Render error: Program or WebGL context is null');
    }

    // Lookup locations
    this._initUniformsLocations();
    this._initAttributesLocations();

    // create and fill positionBuffer with imagePlane rectangle
    this._buffers.position = this._gl.createBuffer();
    this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._buffers.position);
    setRectangle(
      this._gl,
      0,
      0,
      renderParams.image.naturalWidth,
      renderParams.image.naturalHeight
    );

    // create and fill texCoordBuffer with imagePlane texture coordinates
    this._buffers.texCoord = this._gl.createBuffer();
    this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._buffers.texCoord);
    this._gl.bufferData(
      this._gl.ARRAY_BUFFER,
      new Float32Array([
        0.0,
        0.0,
        1.0,
        0.0,
        0.0,
        1.0,
        0.0,
        1.0,
        1.0,
        0.0,
        1.0,
        1.0
      ]),
      this._gl.STATIC_DRAW
    );

    // create and fill originalImageTexture
    const originalImageTexture = createAndSetupTexture(this._gl);

    this._gl.texImage2D(
      this._gl.TEXTURE_2D,
      0,
      this._gl.RGBA,
      this._gl.RGBA,
      this._gl.UNSIGNED_BYTE,
      renderParams.image
    );

    // create renderToTexture object
    this._renderToTexture = new RenderToTexture(
      this._gl,
      renderParams.image.naturalWidth,
      renderParams.image.naturalHeight
    );

    // Rendering

    this._clearCanvas(0, 0, 0, 0);

    this._gl.useProgram(this._program);

    this._gl.enableVertexAttribArray(this._attributeLocations.position);
    this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._buffers.position);

    const positionBufferOptions: [number, number, boolean, number, number] = [
      2, // size
      this._gl.FLOAT, // type
      false, // normalize
      0, // stride
      0 // offset
    ];

    this._gl.vertexAttribPointer(
      this._attributeLocations.position,
      ...positionBufferOptions
    );

    const texCoordBufferOptions: [number, number, boolean, number, number] = [
      2, // size
      this._gl.FLOAT, // type
      false, // normalize
      0, // stride
      0 // offset
    ];

    this._gl.enableVertexAttribArray(this._attributeLocations.texCoord);
    this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._buffers.texCoord);
    this._gl.vertexAttribPointer(
      this._attributeLocations.texCoord,
      ...texCoordBufferOptions
    );

    this._gl.uniform1f(this._uniformLocations.flipY, 1.0);

    this._gl.uniform2f(
      this._uniformLocations.textureSize,
      renderParams.image.naturalWidth,
      renderParams.image.naturalHeight
    );

    this._gl.bindTexture(this._gl.TEXTURE_2D, originalImageTexture);

    for (const kernel of renderParams.kernels) {
      this._setFramebuffer(
        this._renderToTexture.activeCouple.framebuffer,
        renderParams.image.naturalWidth,
        renderParams.image.naturalHeight
      );

      this._gl.uniform1fv(this._uniformLocations.kernel, kernel);
      this._gl.uniform1f(
        this._uniformLocations.kernelWeight,
        kernelWeight(kernel)
      );

      this._gl.drawArrays(this._gl.TRIANGLES, 0, 6);

      this._gl.bindTexture(
        this._gl.TEXTURE_2D,
        this._renderToTexture.activeCouple.texture
      );

      this._renderToTexture.switchCouple();
    }

    this._setFramebuffer(null, this._gl.canvas.width, this._gl.canvas.height);

    this._gl.uniform1f(this._uniformLocations.flipY, -1.0);

    this._gl.uniform1fv(this._uniformLocations.kernel, [
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0
    ]);
    this._gl.uniform1f(this._uniformLocations.kernelWeight, 1);

    this._gl.drawArrays(this._gl.TRIANGLES, 0, 6);
  }

  private _initUniformsLocations() {
    if (!this._gl || !this._program) {
      throw new Error('Render error: Program or WebGL context is null');
    }

    this._uniformLocations.resolution = this._gl.getUniformLocation(
      this._program,
      'u_resolution'
    );
    this._uniformLocations.flipY = this._gl.getUniformLocation(
      this._program,
      'u_flipY'
    );
    this._uniformLocations.image = this._gl.getUniformLocation(
      this._program,
      'u_image'
    );
    this._uniformLocations.textureSize = this._gl.getUniformLocation(
      this._program,
      'u_texSize'
    );
    this._uniformLocations.kernel = this._gl.getUniformLocation(
      this._program,
      'u_kernel[0]'
    );
    this._uniformLocations.kernelWeight = this._gl.getUniformLocation(
      this._program,
      'u_kernelWeight'
    );
  }

  private _initAttributesLocations() {
    if (!this._gl || !this._program) {
      throw new Error('Render error: Program or WebGL context is null');
    }

    this._attributeLocations.position = this._gl.getAttribLocation(
      this._program,
      'a_position'
    );
    this._attributeLocations.texCoord = this._gl.getAttribLocation(
      this._program,
      'a_texCoord'
    );
  }

  private _clearCanvas(r: number, g: number, b: number, a: number) {
    if (!this._gl) {
      throw new Error('WebGL context not present');
    }
    this._gl.clearColor(r, g, b, a);
    this._gl.clear(this._gl.COLOR_BUFFER_BIT);
  }

  private _drawFramebuffer() {}

  private _setFramebuffer(
    fbo: WebGLFramebuffer | null,
    width: number,
    height: number
  ) {
    if (!this._gl) {
      throw new Error('WebGL context not present');
    }
    // make this the framebuffer we are rendering to.
    this._gl.bindFramebuffer(this._gl.FRAMEBUFFER, fbo);

    // Tell the shader the resolution of the framebuffer.
    this._gl.uniform2f(this._uniformLocations.resolution, width, height);

    // Tell webgl the viewport setting needed for framebuffer.
    this._gl.viewport(0, 0, width, height);
  }

  private _createShader(type: number, source: string) {
    if (!this._gl) {
      throw new Error('WebGL context not present');
    }
    const shader = this._gl.createShader(type) as WebGLShader;
    this._gl.shaderSource(shader, source);
    this._gl.compileShader(shader);
    const success = this._gl.getShaderParameter(
      shader,
      this._gl.COMPILE_STATUS
    );
    if (!success) {
      this._gl.deleteShader(shader);
      throw new Error('Shader Error: ' + this._gl.getShaderInfoLog(shader));
    }
    return shader;
  }

  private _createProgram(
    vertexShader: WebGLShader,
    fragmentShader: WebGLShader
  ) {
    if (!this._gl) {
      throw new Error('WebGL context not present');
    }
    const program = this._gl.createProgram() as WebGLProgram;
    this._gl.attachShader(program, vertexShader);
    this._gl.attachShader(program, fragmentShader);
    this._gl.linkProgram(program);
    const success = this._gl.getProgramParameter(program, this._gl.LINK_STATUS);
    if (!success) {
      this._gl.deleteProgram(program);
      throw new Error('Program Error: ' + this._gl.getProgramInfoLog(program));
    }
    return program;
  }
}
