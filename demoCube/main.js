/**
 * Created by Rick on 2021-12-19.
 */
'use strict';

import {vertex_shader, fragment_shader} from "./shaders.js";
import {AttributeClass} from "web-gl-helpers";
import {UniformClass} from "web-gl-helpers";
import {ElementClass} from "web-gl-helpers";
import {resizeCanvasToDisplaySize} from "web-gl-helpers"
import {createShader} from "web-gl-helpers";
import {createGLcontext} from "web-gl-helpers";
import {createProgram} from "web-gl-helpers";
import {initializeContext} from "web-gl-helpers";

import {toRadian} from "gl-matrix/esm/common";

import {
  create as m4_create,
  perspective as m4_perspective,
  translate as m4_translate,
  rotate as m4_rotate} from "gl-matrix/esm/mat4";

let cubeRotation = 0;
try {
  const context = createGLcontext('my_canvas');
  const gl = context.gl;
  const canvas = context.canvas;

  // Check canvas width and height
  resizeCanvasToDisplaySize(canvas);

  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  // Create shader objects
  const vShader = createShader(gl, gl.VERTEX_SHADER, vertex_shader);
  const fShader = createShader(gl, gl.FRAGMENT_SHADER, fragment_shader);

  // Create the shader program
  const shaderProgram = createProgram(gl,vShader,fShader);
  gl.useProgram(shaderProgram);

  //Initialize 'a_position_v4' attribute buffer and set data
  const positions = [
    // Front face
    -1.0, -1.0,  1.0,
    1.0, -1.0,  1.0,
    1.0,  1.0,  1.0,
    -1.0,  1.0,  1.0,

    // Back face
    -1.0, -1.0, -1.0,
    -1.0,  1.0, -1.0,
    1.0,  1.0, -1.0,
    1.0, -1.0, -1.0,

    // Top face
    -1.0,  1.0, -1.0,
    -1.0,  1.0,  1.0,
    1.0,  1.0,  1.0,
    1.0,  1.0, -1.0,

    // Bottom face
    -1.0, -1.0, -1.0,
    1.0, -1.0, -1.0,
    1.0, -1.0,  1.0,
    -1.0, -1.0,  1.0,

    // Right face
    1.0, -1.0, -1.0,
    1.0,  1.0, -1.0,
    1.0,  1.0,  1.0,
    1.0, -1.0,  1.0,

    // Left face
    -1.0, -1.0, -1.0,
    -1.0, -1.0,  1.0,
    -1.0,  1.0,  1.0,
    -1.0,  1.0, -1.0,
  ];
  const type = gl.FLOAT; // the data is 32bit floats
  const positionAttrib = new AttributeClass(gl, type, shaderProgram, 'a_position_v4');
  positionAttrib.setData(positions, gl.STATIC_DRAW);

  // Initialize 'a_color_v4' attribute buffer and set data
  // define a color for each face
  const faceColors = [
    [1.0,  1.0,  1.0,  1.0],    // Front face: white
    [1.0,  0.0,  0.0,  1.0],    // Back face: red
    [0.0,  1.0,  0.0,  1.0],    // Top face: green
    [0.0,  0.0,  1.0,  1.0],    // Bottom face: blue
    [1.0,  1.0,  0.0,  1.0],    // Right face: yellow
    [1.0,  0.0,  1.0,  1.0],    // Left face: purple
  ];
  // convert the array of colors into a table for all the vertices
  let colors = [];
  for(let j=0; j < faceColors.length; ++j){
    const c = faceColors[j];
    //repeat each color four times for the four vertices of the cube's side
    colors = colors.concat(c, c, c, c);
  }
  const colorAttrib = new AttributeClass(gl, type, shaderProgram, 'a_color_v4');
  colorAttrib.setData(colors, gl.STATIC_DRAW);

  // Associate shader attributes with corresponding data buffers
  const vao = gl.createVertexArray();
  // Make vao the one we're currently working with
  gl.bindVertexArray(vao);

  // Format the attribute buffers
  {
    const size = 3;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    positionAttrib.bufferFormat(size, normalize, stride, offset);
  }
  {
    const size = 4;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    colorAttrib.bufferFormat(size, normalize, stride, offset);
  }

  // Define the element array
  const indices = [
    0,  1,  2,      0,  2,  3,    // front
    4,  5,  6,      4,  6,  7,    // back
    8,  9,  10,     8,  10, 11,   // top
    12, 13, 14,     12, 14, 15,   // bottom
    16, 17, 18,     16, 18, 19,   // right
    20, 21, 22,     20, 22, 23,   // left
  ];
  const elementClass = new ElementClass(gl, "Uint16Array");
  elementClass.setData(indices, gl.STATIC_DRAW);

  // Set the uniforms
  // Set up 'u_modelview_m4'
  const modelview_u = new UniformClass(gl, shaderProgram, 'u_modelview_m4', 'uniformMatrix4fv')

  // projection matrix and uniform 'u_projection_m4' data set
  // perspective matrix
  const fov = toRadian(45);   // in radians
  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  const zNear = 0.1;
  const zFar = 100.0;
  const projection_m4 = m4_create();
  m4_perspective(projection_m4, fov, aspect, zNear, zFar);
  const projection_u = new UniformClass(gl, shaderProgram, 'u_projection_m4', 'uniformMatrix4fv');
  projection_u.setData(projection_m4);

  // Draw the scene repeatedly
  let then = 0;
  function render(now){
    now *= 0.001    // convert to seconds
    const deltaTime = now - then;
    then = now;
    drawScene(gl, shaderProgram, modelview_u, deltaTime);
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render)

}catch (e) {
  console.log(e);
}

function drawScene(gl, program, model_view, deltaTime){
  initializeContext(gl);

  // set the uniforms
  // model-view matrix and uniform 'uModelView'
  const modelview_m4 = m4_create();
  // translate the square -6 along the z axis
  m4_translate(
    modelview_m4,       // destination matrix
    modelview_m4,       // matrix to translate
    [0.0, 0.0, -6.0]);  // amount to translate
  // z axis rotate the cube based on the value of 'cubeRotation'
  m4_rotate(
    modelview_m4,         // destination matrix
    modelview_m4,         // matrix to rotate
    cubeRotation * 0.1,   // amount to rotate
    [0, 0, 1]             // z axis to rotate around
  );
  // x axis rotate the cube based on cubeRotation
  m4_rotate(
    modelview_m4,
    modelview_m4,
    cubeRotation * 0.1,
    [0, 1, 0]
  );
  // set the uniform 'uModelView' to the new translate/rotate matrix
  model_view.setData(modelview_m4);

  // update squareRotation
  cubeRotation += deltaTime;

  // draw the scene
  const offset = 0;
  const vertexCount = 36;
  const type = gl.UNSIGNED_SHORT;
  gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
}


