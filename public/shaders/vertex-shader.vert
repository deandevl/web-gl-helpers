#version 300 es

in vec4 a_position_v4;
in vec4 a_color_v4;

uniform mat4 u_matrix_m4;

out vec4 v_color_v4;

void main() {
  // Multiply the position by the matrix
  gl_Position = u_matrix_m4 * a_position_v4;

  // Pass the color to the fragment shader
  v_color_v4 = a_color_v4;
}