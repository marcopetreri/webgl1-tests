export function resizeCanvas(canvas: HTMLCanvasElement) {
  const cssToRealPixels = window.devicePixelRatio || 1;
  const displayWidth = Math.floor(canvas.clientWidth * cssToRealPixels);
  const displayHeight = Math.floor(canvas.clientHeight * cssToRealPixels);

  if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
    canvas.width = displayWidth;
    canvas.height = displayHeight;
  }
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
