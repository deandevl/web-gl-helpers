/**
 * Created by Rick on 2022-01-20.
 */
'use strict';

import {vertex_shader, fragment_shader} from "./shaders.js";
import {AttributeClass} from "web-gl-helpers";
import {Texture2DClass} from "web-gl-helpers";
import {resizeCanvasToDisplaySize} from "web-gl-helpers"
import {createShader} from "web-gl-helpers";
import {createGLcontext} from "web-gl-helpers";
import {createProgram} from "web-gl-helpers";
import {initializeContext} from "web-gl-helpers";

try {
  const context = createGLcontext('my_canvas', 'webgl2');
  const gl = context.gl;
  const canvas = context.canvas;

  // Check canvas width and height
  resizeCanvasToDisplaySize(canvas);

  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  // Create shader objects
  const vShader = createShader(gl, gl.VERTEX_SHADER, vertex_shader);
  const fShader = createShader(gl, gl.FRAGMENT_SHADER, fragment_shader);

  // Create a WebGLProgram
  const program = createProgram(gl, vShader, fShader);
  // Tell it to use our program (a pair of shaders)
  gl.useProgram(program);

  // Set up the 'a_coords_v2' coordinates attribute VBO
  const coords =
    [
      -2.0, -1.0,  0.0,
      -2.0,  1.0,  0.0,
      0.0,  1.0,  0.0,

      -2.0, -1.0,  0.0,
      0.0,  1.0,  0.0,
      0.0, -1.0,  0.0
    ];
  const coordsAttrib = new AttributeClass(gl, gl.FLOAT, program, 'a_coords_v3');
  coordsAttrib.setData(coords, gl.STATIC_DRAW);

  // Set up the 'a_texCoords_v2' coordinates attribute VBO
  const  texCoords = [
    0.0, 0.0,
    0.0, 1.0,
    1.0, 1.0,

    0.0, 0.0,
    1.0, 1.0,
    1.0, 0.0
  ];
  const texCoordsAttrib = new AttributeClass(gl, gl.FLOAT, program, 'a_texCoords_v2');
  texCoordsAttrib.setData(texCoords, gl.STATIC_DRAW);

  // Associate shader attributes with corresponding data buffers
  const vao = gl.createVertexArray();
  // Make vao the one we're currently working with
  gl.bindVertexArray(vao);

  // Specify how to pull the coordinate data out set it
  {
    const size = 3; // 3 components per iteration
    const normalize = false; // don't normalize the data
    const stride = 0; // 0 = move forward size * sizeof(type) each
    //  iteration to get the next position
    const offset = 0; // start at the beginning of the buffer
    coordsAttrib.bufferFormat(size, normalize, stride, offset);
  }

  {
    const size = 2 // 2 components per iteration
    const normalize = false; // normalize the data
    const stride = 0; // 0 = move forward size * sizeof(type) each
    //  iteration to get the next position
    const offset = 0; // start at the beginning of the buffer
    texCoordsAttrib.bufferFormat(size, normalize, stride, offset);
  }

  //Tell shader to use texture unit 0
  const u_texture_unit_location = gl.getUniformLocation(program, "u_sampler_unit");
  gl.uniform1i( u_texture_unit_location, 0);

  // Create an instance of Texture2D
  // Initialize a Texture2DClass and read/set an image
  const texture2D = new Texture2DClass(gl);

  /*texture2D.setColor([0, 0, 255, 255]);
  initializeContext(gl);
  gl.drawArrays(gl.TRIANGLES, 0, 6);*/

  texture2D.loadTexture("brick.jpg").then(() => {
    // Draw the triangle
    initializeContext(gl);
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    gl.bindTexture(this.gl.TEXTURE_2D, null);
  })
}catch (e) {
  console.log(e);
}