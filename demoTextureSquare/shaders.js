/**
 * Created by Rick on 2022-01-17.
 */
'use strict';

const vertex_shader = `#version 300 es

in vec3 a_coords_v3;
in vec2 a_texCoords_v2;

out vec2 v_texCoords_v2;

void main() {
  // Pass the texCoords to the fragment shader
  v_texCoords_v2 = a_texCoords_v2;
  
  gl_Position = vec4(a_coords_v3, 1.0);
}
`

const fragment_shader = `#version 300 es

precision highp float;

// A sampler variable to represent the texture unit number.
uniform sampler2D u_sampler_unit;

// The texture coordinates for this pixel from the vertex shader.
in vec2 v_texCoords_v2;

// We need to declare an output for the fragment shader
out vec4 outColor_v4;

void main() {
  // Sample the texture.
  vec4 color = texture(u_sampler_unit, v_texCoords_v2);
  outColor_v4 = color;
}
`

export {
  vertex_shader,
  fragment_shader
}