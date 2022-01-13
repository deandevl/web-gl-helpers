/**
 * Created by Rick on 2022-01-01.
 */
'use strict';

import {toRadian as m4_toRadian} from "gl-matrix/esm/common";
import {
  create as m4_create,
  fromScaling as m4_fromScaling,
  fromTranslation as m4_fromTranslation,
  fromXRotation as m4_fromXRotation,
  fromYRotation as m4_fromYRotation,
  fromZRotation as m4_fromZRotation,
  ortho as m4_ortho,
  perspective as m4_perspective
} from "gl-matrix/esm/mat4";

/**
 * TransformsClass provides convenience functions for
 *   creating transform related matrices from the
 *   [gl-matrix library]{@link https://glmatrix.net/}
 */
export default class TransformsClass {
  /**
   * Creates a 4x4 orthogonal projection matrix with the given bounds.
   * @param {number} left
   * @param {number} right
   * @param {number} bottom
   * @param {number} top
   * @param {number} near
   * @param {number} far
   * @returns {Float32Array} A 4x4 orthogonal projection matrix
   */
  static getOrthoMatrix(left, right, bottom, top, near, far){
    const ortho_m4 = m4_create();
    m4_ortho(ortho_m4, left, right, bottom, top, near, far);
    return ortho_m4;
  }

  /**
   * Creates a 4x4 perspective matrix
   * @param {number} fov Vertical field of view in degrees.
   * @param {number} aspect Aspect ratio. typically viewport width/height.
   * @param {number} zNear Near bound of the frustum.
   * @param {number}zFar Far bound of the frustum, can be null or Infinity.
   * @returns {Float32Array} A 4x4 perspective matrix.
   */
  static getPerspectiveMatrix(fov, aspect, zNear, zFar){
    const perspective_m4 = m4_create();
    m4_perspective(perspective_m4, m4_toRadian(fov), aspect, zNear, zFar);
    return perspective_m4;
  }

  /**
   * Creates a 4x4 translation matrix
   * @param {Float32Array} translate_ar A 3 element float array of x, y, z translation.
   * @returns {Float32Array} A 4x4 translation matrix.
   */
  static getTranslationMatrix(translate_ar){
    const translate_m4 = m4_create();
    m4_fromTranslation(translate_m4, translate_ar);
    return translate_m4
  }

  /**
   * Creates a 4x4 rotation matrix for a specific axis
   * @param {string} axis Axis of rotation "x", "Y", or "z".
   * @param {number} rotation in degrees
   * @returns {Float32Array} A 4x4 rotation matrix
   */
  static getXYZRotationMatrix(axis, rotation){
    const rotate_m4 = m4_create();
    if(axis === 'x'){
      m4_fromXRotation(rotate_m4, m4_toRadian(rotation));
    }else if(axis === 'y'){
      m4_fromYRotation(rotate_m4, m4_toRadian(rotation));
    }else if(axis === 'z'){
      m4_fromZRotation(rotate_m4, m4_toRadian(rotation));
    }
    return rotate_m4;
  }

  /**
   * Creates a 4x4 scaling matrix
   * @param {Float32Array} scale_ar A 3 element float array of x, y, z scaling.
   * @returns {Float32Array} A 4x4 scale matrix
   */
  static getScaleMatrix(scale_ar){
    const scale_m4 = m4_create();
    m4_fromScaling(scale_m4, scale_ar);
    return scale_m4;
  }
}