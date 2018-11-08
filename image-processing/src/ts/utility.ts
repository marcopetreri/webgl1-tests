export function resizeCanvas(canvas: HTMLCanvasElement) {
  const cssToRealPixels = window.devicePixelRatio || 1;
  const displayWidth = Math.floor(canvas.clientWidth * cssToRealPixels);
  const displayHeight = Math.floor(canvas.clientHeight * cssToRealPixels);

  if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
    canvas.width = displayWidth;
    canvas.height = displayHeight;
  }
}

export function kernelWeight(kernel: number[]) {
  const weight = kernel.reduce((x, y) => x + y);
  return weight > 0 ? weight : 1;
}

export function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function setRectangle(
  gl: WebGLRenderingContext,
  x: number,
  y: number,
  w: number,
  h: number
) {
  const x1 = x;
  const y1 = y;
  const x2 = x + w;
  const y2 = y + h;

  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([x1, y1, x2, y1, x1, y2, x1, y2, x2, y1, x2, y2]),
    gl.STATIC_DRAW
  );
}

export function createAndSetupTexture(gl: WebGLRenderingContext): WebGLTexture {
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Set up texture so we can render any size image and so we are
  // working with pixels.
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  return texture as WebGLTexture;
}
