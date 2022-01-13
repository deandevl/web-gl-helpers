/**
 * Created by Rick on 2022-01-12.
 */
'use strict';

import AttributeClass from "./src/AttributeClass.js";
import ElementClass from "./src/ElementClass.js";
import ReadShaderCodeClass from "./src/ReadShaderCodeClass.js";
import Texture2DClass from "./src/Texture2DClass.js";
import TransformsClass from "./src/TransformsClass.js";
import UniformClass from "./src/UniformClass.js";
import {createGLcontext} from "./src/HelperFunctions.js";
import {initializeContext} from "./src/HelperFunctions";
import {resizeCanvasToDisplaySize} from "./src/HelperFunctions.js";
import {createProgram} from "./src/HelperFunctions.js";
import {createShader} from "./src/HelperFunctions.js";

export {
  AttributeClass,
  ElementClass,
  ReadShaderCodeClass,
  Texture2DClass,
  TransformsClass,
  UniformClass,
  createGLcontext,
  initializeContext,
  resizeCanvasToDisplaySize,
  createProgram,
  createShader
};