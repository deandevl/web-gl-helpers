/**
 * Created by Rick on 2021-12-20.
 */
'use strict';

/**
 * ElementClass provides functions for developing 3D objects using an
 *   array of vertex locations.  The class establishes an index buffer
 *   along with a function for setting the buffer's data. See
 *   [Creating 3D objects using WebGL]{@link https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Tutorial/Creating_3D_objects_using_WebGL}
 *   for an example.
 */
export default class ElementClass {
  /**
   * Create an ElementClass instance
   * @param {WebGLRenderingContext} gl
   * @param {number} type  Specifying the [data type]{@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/vertexAttribPointer} of each component in the array.
   * @param {WebGLProgram} program The WebGL program.
   * @param {string} name The name of the vertex position variable.
   */
  constructor(gl, type, program, name) {
    this.gl = gl;
    this.type = type;
    // Look up where the attribute needs to go
    this.attributeLocation = this.gl.getAttribLocation(program, name);
    // Create a buffer to put the element index values
    this.indexBuffer = gl.createBuffer();
  }
  /**
   * Describes how the attribute is read from the buffer pipeline.
   * @param {number} size  The number of components per vertex attribute. Must be 1, 2, 3, or 4.
   * @param {boolean} normalize Specifying whether integer data values should be normalized.
   * @param {number} stride Specifying the offset in bytes between the beginning of consecutive vertex attributes.
   * @param {number} offset Specifying an offset in bytes of the first component in the vertex attribute array.
   */
  bufferFormat(size, normalize, stride, offset) {
    // Bind this.buffer to WebGL's internal ELEMENT_ARRAY_BUFFER
    gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    // Tell the attribute how to get data out of the internal ELEMENT_ARRAY_BUFFER
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
   * @param {number[]} index_list Array containing vertex element indexes.
   * @param {number} usage Specifies the intended [usage pattern]{@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bufferData} of the data store for optimization purposes.
   */
  setData(index_list, usage){
    switch(this.type){
      case Uint8Array:
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER,
          new Uint8Array(index_list), usage);
        break;
      case Uint16Array:
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER,
          new Uint16Array(index_list), usage);
        break;
    }
  }
}