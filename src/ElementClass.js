/**
 * Created by Rick on 2022-01-15.
 */
'use strict';
/**
 * ElementClass provides a way of defining vertex indices
 *   and using gl.drawElements for drawing the geometry.
 *   See [WebGL2 Indexed Vertices]{@link https://webgl2fundamentals.org/webgl/lessons/webgl-indexed-vertices.html}.
 */
export default class ElementClass {
  /**
   *
   * @param gl {WebGLRenderingContext} gl The WebGL context
   * @param type {string} The numeric type for the indices.
   *   Acceptable values are "Uint8Array" or "Uint16Array".
   */
  constructor(gl, type) {
    this.gl = gl;
    this.type = type;
    // Create a buffer to put the element index values
    this.indexBuffer = gl.createBuffer();
  }

  /**
   *
   * @param {number[]} indices A numeric matrix of vertex indices.
   * @param {number} usage Specifies the intended [usage pattern]{@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bufferData} of the data store for optimization purposes.
   */
  setData(indices, usage) {
    // Bind this.buffer to WebGL's internal ELEMENT_ARRAY_BUFFER
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    switch(this.type){
      case "Uint8Array":
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER,
          new Uint8Array(indices), usage);
        break;
      case "Uint16Array":
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER,
          new Uint16Array(indices), usage);
        break;
    }
  }
}