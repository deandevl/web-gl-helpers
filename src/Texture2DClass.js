/**
 * Created by Rick on 2021-12-30.
 */
'use strict';

/**
 * Texture2DClass provides functions for setting and
 *   binding color or image
 *   [WebGLTexture object]{@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLTexture}
 */
export default class Texture2DClass {
  /**
   * Create a Texture2DClass instance
   * @param {WebGLRenderingContext} gl
   */
  constructor(gl) {
    this.gl = gl;
  }

  /**
   * Create a [WebGLTexture]{@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLTexture} object
   *   and define its color.
   * @param {number[]} color_v4 A 4 element vector where the first three values are the RGB values for
   *   the canvas background. The fourth is the alpha value.
   */
  setColor(color_v4){
    // Bind to the TEXTURE_2D bind point of the unit
    const texture = this.gl.createTexture();
    this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
    // Fill the texture with a 1x1 colored pixel
    this.gl.texImage2D(
      this.gl.TEXTURE_2D,
      0,
      this.gl.RGBA,
      1,
      1,
      0,
      this.gl.RGBA,
      this.gl.UNSIGNED_BYTE,
      new Uint8Array(color_v4)
    )
  }

  /**
   * Create a [WebGLTexture]{@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLTexture} object.
   *   Activate and bind the texture then set it initially to a
   *   blue color while the image is loaded.
   * @param {string} url The file path to the image
   * @param {number} unit Specifies which texture unit to make active.
   */
  setImage(url, unit){
    try{
      const texture = this.gl.createTexture();
      this.gl.activeTexture(unit);
      this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
      // Fill the texture with a 1x1 colored pixel
      this.gl.texImage2D(
        this.gl.TEXTURE_2D,
        0,
        this.gl.RGBA,
        1,
        1,
        0,
        this.gl.RGBA,
        this.gl.UNSIGNED_BYTE,
        new Uint8Array([0, 0, 255, 255])
      )
      const image = new Image();
      image.addEventListener('load', () => {
        this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, image);
        this.gl.generateMipmap(this.gl.TEXTURE_2D);
      });
      image.src = url;
    }catch(e){
      throw new Error(`Texture2DClass fetch image error: ${e.message}`);
    }
  }
}