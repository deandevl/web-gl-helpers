/**
 * Created by Rick on 2022-01-12.
 */
'use strict';

// From HelperFunctions.js
import {createGLcontext} from "./src/HelperFunctions.js";
import {initializeContext} from "./src/HelperFunctions.js";
import {resizeCanvasToDisplaySize} from "./src/HelperFunctions.js";
import {autoResizeCanvas} from "./src/HelperFunctions.js";
import {createProgram} from "./src/HelperFunctions.js";
import {createShader} from "./src/HelperFunctions.js";
import {cleanBuffers} from "./src/HelperFunctions.js";
import {calculateNormals} from "./src/HelperFunctions.js";
import {hexToRGB} from "./src/HelperFunctions.js";
import {rgbToHex} from "./src/HelperFunctions.js";
import {denormalizeColor} from "./src/HelperFunctions.js";
import {normalizeColor} from "./src/HelperFunctions.js";

import ArrayBufferClass from "./src/ArrayBufferClass.js";
import ElementArrayBufferClass from "./src/ElementArrayBufferClass.js";
import ReadShaderCodeClass from "./src/ReadShaderCodeClass.js";
import Texture2DClass from "./src/Texture2DClass.js";
import TransformsClass from "./src/TransformsClass.js";
import UniformClass from "./src/UniformClass.js";
import VertexArrayObjectClass from "./src/VertexArrayObjectClass.js";

// From geometries
import AxisClass from "./src/geometries/AxisClass.js";
import ConeClass from "./src/geometries/ConeClass.js";
import FloorClass from "./src/geometries/FloorClass.js"

export {
  createGLcontext,
  initializeContext,
  resizeCanvasToDisplaySize,
  autoResizeCanvas,
  createProgram,
  createShader,
  cleanBuffers,
  calculateNormals,
  hexToRGB,
  rgbToHex,
  denormalizeColor,
  normalizeColor,

  ArrayBufferClass,
  ElementArrayBufferClass,
  ReadShaderCodeClass,
  Texture2DClass,
  TransformsClass,
  UniformClass,
  VertexArrayObjectClass,

  AxisClass,
  ConeClass,
  FloorClass
};