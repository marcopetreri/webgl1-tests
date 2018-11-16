attribute vec2 a_position;
attribute vec2 a_texCoord;
uniform vec2 u_resolution;
uniform float u_flipY;
uniform mat3 u_matrix;

varying vec2 v_texCoord;

void main() {

  vec3 transformedPosition = u_matrix * vec3(a_position, 1.0);

  vec2 csPos = ((transformedPosition.xy / u_resolution) * 2.0) - 1.0;

  gl_Position = vec4(csPos * vec2(1.0, u_flipY), 0, 1.0);

  v_texCoord = a_texCoord;
}