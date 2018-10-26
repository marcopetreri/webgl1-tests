import { randInt, setRectangle } from './utility';

export default class Render {
  private _gl: WebGLRenderingContext | null;
  private _program: WebGLProgram | null;
  private _vs: WebGLShader | null;
  private _fs: WebGLShader | null;

  constructor(canvas: HTMLCanvasElement) {
    this._gl = canvas.getContext('webgl');
    if (this._gl === null) {
      throw new Error('No webgl context available');
    }
    this._program = null;
    this._vs = null;
    this._fs = null;
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

  public render(image: HTMLImageElement) {
    if (!this._gl || !this._program) {
      throw new Error('Render error: Program or WebGL context is null');
    }
    const resolutionUniformLocation = this._gl.getUniformLocation(
      this._program,
      'u_resolution'
    );
    const imageUniformLocation = this._gl.getUniformLocation(
      this._program,
      'u_image'
    );
    const positionAttributeLocation = this._gl.getAttribLocation(
      this._program,
      'a_position'
    );
    const texCoordAttributeLocation = this._gl.getAttribLocation(
      this._program,
      'a_texCoord'
    );

    const positionBuffer = this._gl.createBuffer();
    this._gl.bindBuffer(this._gl.ARRAY_BUFFER, positionBuffer);
    setRectangle(this._gl, 0, 0, this._gl.canvas.width, this._gl.canvas.height);

    const texCoordBuffer = this._gl.createBuffer();
    this._gl.bindBuffer(this._gl.ARRAY_BUFFER, texCoordBuffer);
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

    const imageTexture = this._gl.createTexture();
    this._gl.bindTexture(this._gl.TEXTURE_2D, imageTexture);

    this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_WRAP_S, this._gl.CLAMP_TO_EDGE);
    this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_WRAP_T, this._gl.CLAMP_TO_EDGE);
    this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_MIN_FILTER, this._gl.NEAREST);
    this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_MAG_FILTER, this._gl.NEAREST);

    this._gl.texImage2D(this._gl.TEXTURE_2D, 0, this._gl.RGBA, this._gl.RGBA, this._gl.UNSIGNED_BYTE, image);

    // Rendering

    this._gl.viewport(0, 0, this._gl.canvas.width, this._gl.canvas.height);
    this._gl.clearColor(0, 0, 0, 0);
    this._gl.clear(this._gl.COLOR_BUFFER_BIT);

    this._gl.useProgram(this._program);

    this._gl.uniform2f(resolutionUniformLocation, this._gl.canvas.width, this._gl.canvas.height);

    this._gl.enableVertexAttribArray(positionAttributeLocation);
    this._gl.bindBuffer(this._gl.ARRAY_BUFFER, positionBuffer);

    const size = 2;
    const type = this._gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    this._gl.vertexAttribPointer(
      positionAttributeLocation,
      size,
      type,
      normalize,
      stride,
      offset
    );

    this._gl.enableVertexAttribArray(texCoordAttributeLocation);
    this._gl.bindBuffer(this._gl.ARRAY_BUFFER, texCoordBuffer);
    this._gl.vertexAttribPointer(
      texCoordAttributeLocation,
      size,
      type,
      normalize,
      stride,
      offset
    );

    const primitiveType = this._gl.TRIANGLES;
    const primitiveOffset = 0;
    const primitiveCount = 6;
    this._gl.drawArrays(primitiveType, primitiveOffset, primitiveCount);
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
