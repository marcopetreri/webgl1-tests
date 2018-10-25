import { resizeCanvas, createProgram, createShader } from 'utility.js';

function render(image) {
  let c = document.getElementById('canvas');
  resizeCanvas(c);
  let vsSource = document.getElementById('vs-source').text;
  let fsSource = document.getElementById('fs-source').text;

  let gl = c.getContext('webgl');
  if (gl) {
    // Initialization

    let vs = createShader(gl, gl.VERTEX_SHADER, vsSource);
    let fs = createShader(gl, gl.FRAGMENT_SHADER, fsSource);
    let program = createProgram(gl, vs, fs);

    let resolutionUniformLocation = gl.getUniformLocation(
      program,
      'u_resolution'
    );
    let imageUniformLocation = gl.getUniformLocation(program, 'u_image');
    let positionAttributeLocation = gl.getAttribLocation(program, 'a_position');
    let texCoordAttributeLocation = gl.getAttribLocation(program, 'a_texCoord');

    var positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    setRectangle(gl, 0, 0, gl.canvas.width, gl.canvas.height);

    var texCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
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
        1.0,
      ]),
      gl.STATIC_DRAW
    );

    var imageTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, imageTexture);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

    // Rendering

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(program);

    gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);

    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    let size = 2;
    let type = gl.FLOAT;
    let normalize = false;
    let stride = 0;
    let offset = 0;
    gl.vertexAttribPointer(
      positionAttributeLocation,
      size,
      type,
      normalize,
      stride,
      offset
    );

    gl.enableVertexAttribArray(texCoordAttributeLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
    gl.vertexAttribPointer(
      texCoordAttributeLocation,
      size,
      type,
      normalize,
      stride,
      offset
    );

    let primitiveType = gl.TRIANGLES;
    let primitiveOffset = 0;
    let primitiveCount = 6;
  }
}

function main() {
  var image = new Image();
  image.src = 'http://via.placeholder.com/300x200?text=Ciao';
  image.onload = function() {
    render(image);
  };
}
