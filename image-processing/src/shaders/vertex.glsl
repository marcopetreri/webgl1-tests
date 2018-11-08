attribute vec2 a_position;
attribute vec2 a_texCoord;
uniform vec2 u_resolution;
uniform float u_flipY;
varying vec2 v_texCoord;

void main() {


  vec2 csPos = ((a_position / u_resolution) * 2.0) - 1.0;

  gl_Position = vec4(csPos * vec2(1.0, u_flipY), 0, 1);
  v_texCoord = a_texCoord;
}