#version 300 es

precision highp float;

// Passed in from the vertex shader
in vec4 v_color_v4;

out vec4 outColor_v4;

void main() {
  outColor_v4 = v_color_v4;
}