/**
 * Created by Rick on 2022-01-15.
 */
'use strict';

const vertex_shader = `#version 300 es

in vec4 a_position_v4;
in vec4 a_color_v4;

uniform mat4 u_modelview_m4;
uniform mat4 u_projection_m4;

// A varying the color to fragment shader
out vec4 v_color_v4;

void main(void) {
  gl_Position = u_projection_m4 * u_modelview_m4 * a_position_v4;
  // Pass the color to the fragment shader
  v_color_v4 = a_color_v4;
}
`

const fragment_shader = `#version 300 es

precision highp float;

// Passed in from the vertex shader
in vec4 v_color_v4;

// We need to declare an output for the fragment shader
out vec4 outColor_v4;

void main() {
  outColor_v4 = v_color_v4;
}`

export {
  vertex_shader,
  fragment_shader
}