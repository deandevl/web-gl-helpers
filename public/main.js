/**
 * Created by Rick on 2021-12-11.
 */
'use strict';

import {F_3D_positions_list, F_3D_colors_list} from "./F-3D.js";
import {AttributeClass} from "../dist/web-gl-helpers";
import {UniformClass} from "../dist/web-gl-helpers";
import {ReadShaderCodeClass} from "../dist/web-gl-helpers";
import {TransformsClass} from "../dist/web-gl-helpers";
import {createGLcontext} from "../dist/web-gl-helpers";
import {resizeCanvasToDisplaySize} from "../dist/web-gl-helpers";
import {createShader} from "../dist/web-gl-helpers";
import {createProgram} from "../dist/web-gl-helpers";
import {initializeContext} from "../dist/web-gl-helpers";

import {
  create as m4_create,
  multiply as m4_multiply
} from "gl-matrix/esm/mat4";

const shader_file_list = [
  './shaders/vertex-shader.vert',
  './shaders/fragment-shader.frag'
]

// Read in shader text
ReadShaderCodeClass.downloadShaders(shader_file_list, true).then((shaders_code_list) => {
  try {
    const context = createGLcontext('my_canvas');
    const gl = context.gl;
    const canvas = context.canvas;

    // Turn on culling. By default backfacing triangles
    //   will be culled.
    gl.enable(gl.DEPTH_TEST); // enable depth testing
    gl.enable(gl.CULL_FACE);  // enable culling of backfacing triangles
    gl.depthFunc(gl.LEQUAL); // near things obscure far things

    // Check canvas width and height
    resizeCanvasToDisplaySize(canvas);

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    // Create shader objects
    const vShader = createShader(gl, gl.VERTEX_SHADER, shaders_code_list[0]);
    const fShader = createShader(gl, gl.FRAGMENT_SHADER, shaders_code_list[1]);

    // Create a WebGLProgram
    const program = createProgram(gl, vShader, fShader);
    // Tell context to use our program (a pair of shaders)
    gl.useProgram(program);

    // Set up position attribute for 'a_position'
    // Create and set the attribute position data (a_position)
    const position_type = gl.FLOAT; // the data is 32bit floats
    const positionAttrib = new AttributeClass(gl, position_type, program,'a_position_v4');
    positionAttrib.setData(F_3D_positions_list, gl.STATIC_DRAW);

    // Set up varying color attribute for 'a_color'
    const color_type = gl.UNSIGNED_BYTE; // the data is UNSIGNED_BYTE
    const colorAttrib = new AttributeClass(gl, color_type, program,'a_color_v4');
    colorAttrib.setData(F_3D_colors_list, gl.STATIC_DRAW);

    // Associate shader attributes with corresponding data buffers
    const vao = gl.createVertexArray();
    // Make vao the one we're currently working with
    gl.bindVertexArray(vao);

    // Specify how to pull the position data out
    {
      const size = 3; // 3 components per iteration
      const normalize = false; // don't normalize the data
      const stride = 0; // 0 = move forward size * sizeof(type) each
      //  iteration to get the next position
      const offset = 0; // start at the beginning of the buffer
      positionAttrib.bufferFormat(size, normalize, stride, offset);
    }

    // Specify how to pull the color data out
    {
      const size = 3; // 3 components per iteration
      const normalize = true; // don't normalize the data
      const stride = 0; // 0 = move forward size * sizeof(type) each
      //  iteration to get the next position
      const offset = 0; // start at the beginning of the buffer
      colorAttrib.bufferFormat(size, normalize, stride, offset);
    }

    // Set up the uniforms
    // Set up matrix uniform 'u_matrix'
    const matrixUniform = new UniformClass(gl, program, 'u_matrix_m4', 'uniformMatrix4fv')

    // Define drawing parameters
    const primitiveType = gl.TRIANGLES;
    const prim_offset = 0;
    const triangle_count = 16 * 6;

    // define the initial values for the transform parameters
    let translation = [-150, 120, -380];
    let rotation  = [180, 0, 0];
    let scale = [1, 1, 1];


    // Define perspective parameters
    let fov = 60;
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const zNear = 1;
    const zFar = 2000;

    // define a function for drawing the scene
    function drawScene(){
      initializeContext(gl);

      // Compute the perspective matrix
      const perspective_m4 = TransformsClass.getPerspectiveMatrix(
        fov,
        aspect,
        zNear,
        zFar
      )

      // Define the transform matrices
      const translate_m4 = TransformsClass.getTranslationMatrix(translation);
      const x_rotate_m4 = TransformsClass.getXYZRotationMatrix('x',rotation[0]);
      const y_rotate_m4 = TransformsClass.getXYZRotationMatrix('y',rotation[1]);
      const z_rotate_m4 = TransformsClass.getXYZRotationMatrix('z',rotation[2]);
      const scale_m4 = TransformsClass.getScaleMatrix(scale);

      // Create transform_m4 by multiplying the matrices
      const transform_m4 = m4_create();
      m4_multiply(transform_m4, perspective_m4, translate_m4);
      m4_multiply(transform_m4, transform_m4, x_rotate_m4);
      m4_multiply(transform_m4, transform_m4, y_rotate_m4);
      m4_multiply(transform_m4, transform_m4, z_rotate_m4);
      m4_multiply(transform_m4, transform_m4, scale_m4);

      // Set the new transform by assigning the uniform 'u_matrix'
      matrixUniform.setData(transform_m4);

      // draw the scene
      gl.drawArrays(primitiveType, prim_offset, triangle_count);
    }

    // update functions called by user interface updates to parameters
    function updateFieldOfView(value){
      fov = value;
      drawScene();
    }

    function updateTranslation(index, value){
      translation[index] = value;
      drawScene();
    }

    function updateRotation(index, value){
      rotation[index] = value;
      drawScene();
    }

    function updateScale(index, value){
      scale[index] = value;
      drawScene();
    }

    // set up the user interface for changes to the parameters
    // define the z fudge factor value ui
    const fieldOfView_slider = document.getElementById('fieldOfView');
    const fieldOfView_output = document.getElementById('fieldOfView_output');
    fieldOfView_slider.step = 0.2;
    fieldOfView_slider.min = 1;
    fieldOfView_slider.max = 179;

    fieldOfView_slider.value = fov;
    fieldOfView_output.textContent = fov;

    fieldOfView_slider.addEventListener('input', ()=> {
      const fieldOfView = +fieldOfView_slider.value;
      fieldOfView_output.textContent = fieldOfView_slider.value;
      updateFieldOfView(fieldOfView);
    });

    // define x, y, z translation slider attributes and event callbacks
    const x_translate_slider = document.getElementById('x_translate');
    const y_translate_slider = document.getElementById('y_translate');
    const z_translate_slider = document.getElementById('z_translate');

    const x_translate_output = document.getElementById('x_translate_output');
    const y_translate_output = document.getElementById('y_translate_output');
    const z_translate_output = document.getElementById('z_translate_output');

    x_translate_slider.min = -200;
    x_translate_slider.max = 200;
    x_translate_slider.step = 2;
    x_translate_slider.value = translation[0];
    x_translate_output.textContent = translation[0];

    y_translate_slider.min = -200;
    y_translate_slider.max = 200;
    y_translate_slider.step = 2;
    y_translate_slider.value = translation[1];
    y_translate_output.textContent = translation[1];

    z_translate_slider.min = -1000;
    z_translate_slider.max = 0;
    z_translate_slider.step = 5;
    z_translate_slider.value = translation[2];
    z_translate_output.textContent = translation[2];
    
    x_translate_slider.addEventListener('input', () => {
      const x_translate = +x_translate_slider.value;
      x_translate_output.textContent = x_translate;
      updateTranslation(0, x_translate);
    });
    y_translate_slider.addEventListener('input', () => {
      const y_translate =  +y_translate_slider.value;
      y_translate_output.textContent = y_translate;
      updateTranslation(1, y_translate);
    })
    z_translate_slider.addEventListener('input', () => {
      const z_translate =  +z_translate_slider.value;
      z_translate_output.textContent = z_translate;
      updateTranslation(2, z_translate);
    })

    // define rotate sliders and its event callback
    const x_rotate_slider = document.getElementById('x_rotate');
    const y_rotate_slider = document.getElementById('y_rotate');
    const z_rotate_slider = document.getElementById('z_rotate');

    const x_rotate_slider_output = document.getElementById('x_rotate_output');
    const y_rotate_slider_output = document.getElementById('y_rotate_output');
    const z_rotate_slider_output = document.getElementById('z_rotate_output');

    x_rotate_slider.step = y_rotate_slider.step = z_rotate_slider.step = 5.0;
    x_rotate_slider.min = y_rotate_slider.min = z_rotate_slider.min = 0.0;
    x_rotate_slider.max = y_rotate_slider.max = z_rotate_slider.max = 360.0;

    x_rotate_slider.value = x_rotate_slider_output.textContent = rotation[0];
    y_rotate_slider.value = y_rotate_slider_output.textContent = rotation[1];
    z_rotate_slider.value = z_rotate_slider_output.textContent = rotation[2];

    x_rotate_slider.addEventListener('input', () => {
      const rotate = +x_rotate_slider.value;
      x_rotate_slider_output.textContent = rotate;
      updateRotation(0, rotate);
    })
    y_rotate_slider.addEventListener('input', () => {
      const rotate = +y_rotate_slider.value;
      y_rotate_slider_output.textContent = rotate;
      updateRotation(1, rotate);
    })
    z_rotate_slider.addEventListener('input', () => {
      const rotate = +z_rotate_slider.value;
      z_rotate_slider_output.textContent = rotate;
      updateRotation(2, rotate);
    })

    // define x, y scale slider attributes and event callbacks
    const x_scale_slider = document.getElementById('x_scale');
    const y_scale_slider = document.getElementById('y_scale');
    const z_scale_slider = document.getElementById('z_scale');

    const x_scale_output = document.getElementById('x_scale_output');
    const y_scale_output = document.getElementById('y_scale_output');
    const z_scale_output = document.getElementById('z_scale_output');

    x_scale_slider.step = y_scale_slider.step = z_scale_slider.step = 0.1;
    x_scale_slider.min = y_scale_slider.min = z_scale_slider.min = -5.0;
    x_scale_slider.max = y_scale_slider.max = z_scale_slider.max = 5.0;

    x_scale_slider.value = x_scale_output.textContent = scale[0];
    y_scale_slider.value = y_scale_output.textContent = scale[1];
    z_scale_slider.value = z_scale_output.textContent = scale[2];

    x_scale_slider.addEventListener('input', () => {
      const x_scale = +x_scale_slider.value;
      x_scale_output.textContent = x_scale;
      updateScale(0,x_scale);
    });
    y_scale_slider.addEventListener('input', () => {
      const y_scale = +y_scale_slider.value;
      y_scale_output.textContent = y_scale
      updateScale(1,y_scale);
    });
    z_scale_slider.addEventListener('input', () => {
      const z_scale = +z_scale_slider.value;
      z_scale_output.textContent = z_scale
      updateScale(2,z_scale);
    });

    // draw the initial scene
    drawScene();
  }catch (e) {
    console.log(e);
  }
});


