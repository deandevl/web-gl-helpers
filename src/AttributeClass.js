/**
 * Created by Rick on 2021-12-11.
 */
'use strict';

/**
 * AttributeClass provides functions for working with a WebGLProgram's attribute variable.
 *   The class establishes a data buffer for sending vertex attributes, such as vertex coordinates,
 *   texture coordinate data, or vertex color data through the graphics hardware pipeline.
 *   See [WebGL Fundamentals](https://webgl2fundamentals.org/webgl/lessons/webgl-fundamentals.html) for
 *   an explanation on data buffers.
 *
 */
export default class AttributeClass {
  /**
   * Create an AttributeClass instance
   * @param {WebGLRenderingContext} gl The WebGL context
   * @param {number} type  Specifying the [data type]{@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/vertexAttribPointer}
   *   of each component in the array.
   * @param {WebGLProgram} program The WebGL program.
   * @param {string} name The name of the attribute variable.
   */
  constructor(gl, type, program, name) {
    this.gl = gl;
    this.type = type;
    // Look up where the attribute needs to go
    this.attributeLocation = this.gl.getAttribLocation(program, name);
    this.buffer = this.gl.createBuffer();
  }

  /**
   * Describes how the attribute is read from the buffer pipeline.
   * @param {number} size  The number of components per vertex attribute. Must be 1, 2, 3, or 4.
   * @param {boolean} normalize Specifying whether integer data values should be normalized.
   * @param {number} stride Specifying the offset in bytes between the beginning of consecutive vertex attributes.
   * @param {number} offset Specifying an offset in bytes of the first component in the vertex attribute array.
   */
  bufferFormat(size, normalize, stride, offset) {
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
    // Tell the attribute how to get data out of the internal ARRAY_BUFFER
    this.gl.vertexAttribPointer(
      this.attributeLocation,
      size,
      this.type,
      normalize,
      stride,
      offset
    );
    this.gl.enableVertexAttribArray(this.attributeLocation);
  }

  /**
   * Initializes and creates the buffer object's data store.
   * @param {number[]} attribute_list Array containing vertex attributes, such as vertex coordinates, texture coordinate data, or vertex color data.
   * @param {number} usage Specifies the intended [usage pattern]{@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bufferData} of the data store for optimization purposes.
   */
  setData(attribute_list, usage){
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
    // Set geometry
    switch(this.type){
      case this.gl.FLOAT:
        this.gl.bufferData(
          this.gl.ARRAY_BUFFER,
          new Float32Array(attribute_list),
          usage
        );
      break;
      case this.gl.UNSIGNED_BYTE:
        this.gl.bufferData(
          this.gl.ARRAY_BUFFER,
          new Uint8Array(attribute_list),
          usage
        );
        break;
    }
  }
}