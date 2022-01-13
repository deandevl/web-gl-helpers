import {toRadian as $cDsoM$toRadian} from "gl-matrix/esm/common";
import {create as $cDsoM$create, ortho as $cDsoM$ortho, perspective as $cDsoM$perspective, fromTranslation as $cDsoM$fromTranslation, fromXRotation as $cDsoM$fromXRotation, fromYRotation as $cDsoM$fromYRotation, fromZRotation as $cDsoM$fromZRotation, fromScaling as $cDsoM$fromScaling} from "gl-matrix/esm/mat4";

/**
 * Created by Rick on 2021-12-11.
 */ 'use strict';
class $a772bd1f72355166$export$2e2bcd8739ae039 {
    /**
   * Create an AttributeClass instance
   * @param {WebGLRenderingContext} gl The WebGL context
   * @param {number} type  Specifying the [data type]{@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/vertexAttribPointer}
   *   of each component in the array.
   * @param {WebGLProgram} program The WebGL program.
   * @param {string} name The name of the attribute variable.
   */ constructor(gl, type, program, name){
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
   */ bufferFormat(size, normalize, stride, offset) {
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
        // Tell the attribute how to get data out of the internal ARRAY_BUFFER
        this.gl.vertexAttribPointer(this.attributeLocation, size, this.type, normalize, stride, offset);
        this.gl.enableVertexAttribArray(this.attributeLocation);
    }
    /**
   * Initializes and creates the buffer object's data store.
   * @param {number[]} attribute_list Array containing vertex attributes, such as vertex coordinates, texture coordinate data, or vertex color data.
   * @param {number} usage Specifies the intended [usage pattern]{@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bufferData} of the data store for optimization purposes.
   */ setData(attribute_list, usage) {
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
        // Set geometry
        switch(this.type){
            case this.gl.FLOAT:
                this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(attribute_list), usage);
                break;
            case this.gl.UNSIGNED_BYTE:
                this.gl.bufferData(this.gl.ARRAY_BUFFER, new Uint8Array(attribute_list), usage);
                break;
        }
    }
}


/**
 * Created by Rick on 2021-12-20.
 */ 'use strict';
class $85c9a8abe908bb27$export$2e2bcd8739ae039 {
    /**
   * Create an ElementClass instance
   * @param {WebGLRenderingContext} gl
   * @param {number} type  Specifying the [data type]{@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/vertexAttribPointer} of each component in the array.
   * @param {WebGLProgram} program The WebGL program.
   * @param {string} name The name of the vertex position variable.
   */ constructor(gl, type, program, name){
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
   */ bufferFormat(size, normalize, stride, offset) {
        // Bind this.buffer to WebGL's internal ELEMENT_ARRAY_BUFFER
        gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        // Tell the attribute how to get data out of the internal ELEMENT_ARRAY_BUFFER
        this.gl.vertexAttribPointer(this.attributeLocation, size, this.type, normalize, stride, offset);
        this.gl.enableVertexAttribArray(this.attributeLocation);
    }
    /**
   * Initializes and creates the buffer object's data store.
   * @param {number[]} index_list Array containing vertex element indexes.
   * @param {number} usage Specifies the intended [usage pattern]{@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bufferData} of the data store for optimization purposes.
   */ setData(index_list, usage) {
        switch(this.type){
            case Uint8Array:
                this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(index_list), usage);
                break;
            case Uint16Array:
                this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(index_list), usage);
                break;
        }
    }
}


/**
 * Created by Rick on 2021-12-09.
 */ 'use strict';
class $9497f4d83afc6f16$export$2e2bcd8739ae039 {
    /**
   * A static function that downloads shader code from a list of shader files.
   * @param shader_files_list A string array of shader file/url paths
   * @param debug A boolean which if true logs diagnostic messages to the console
   * @returns {Promise<*[]>} Returns a Promise which when fulfilled returns a list of shader code
   */ static async downloadShaders(shader_files_list, debug = false) {
        try {
            const shaders_list = [];
            for(let j = 0; j < shader_files_list.length; j += 1){
                let shader_url = shader_files_list[j];
                let data = await $9497f4d83afc6f16$export$2e2bcd8739ae039.#get_data(shader_url);
                // Save the shaders in an array
                shaders_list.push(data);
                if (debug) console.log(`Downloaded shader code ${shader_url}`);
            }
            return shaders_list;
        } catch (e) {
            console.log(`downloadShaders Error: ${e}`);
        }
    }
    /**
   * A static function for the code/text of a single shader file.
   * @param url The url to the shader file from the http server
   * @returns {Promise<null>} Returns a Promise which if fulfilled returns
   *   a file's text of shader code
   */ static async #get_data(url) {
        let data = null;
        let resp = null;
        try {
            resp = await fetch(url);
            if (resp.ok) data = await resp.text();
        } catch (e) {
            throw new Error(`downloadShaders fetch error: ${e.message}`);
        }
        if (!data) throw new Error(`downloadShaders fetch status: ${resp.status}`);
        else return data;
    }
}


/**
 * Created by Rick on 2021-12-30.
 */ 'use strict';
class $d8b774673237c2e7$export$2e2bcd8739ae039 {
    /**
   * Create a Texture2DClass instance
   * @param {WebGLRenderingContext} gl
   */ constructor(gl){
        this.gl = gl;
    }
    /**
   * Create a [WebGLTexture]{@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLTexture} object
   *   and define its color.
   * @param {number[]} color_v4 A 4 element vector where the first three values are the RGB values for
   *   the canvas background. The fourth is the alpha value.
   */ setColor(color_v4) {
        // Bind to the TEXTURE_2D bind point of the unit
        const texture = this.gl.createTexture();
        this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
        // Fill the texture with a 1x1 colored pixel
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, 1, 1, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, new Uint8Array(color_v4));
    }
    /**
   * Create a [WebGLTexture]{@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLTexture} object.
   *   Activate and bind the texture then set it initially to a
   *   blue color while the image is loaded.
   * @param {string} url The file path to the image
   * @param {number} unit Specifies which texture unit to make active.
   */ setImage(url, unit) {
        try {
            const texture = this.gl.createTexture();
            this.gl.activeTexture(unit);
            this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
            // Fill the texture with a 1x1 colored pixel
            this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, 1, 1, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, new Uint8Array([
                0,
                0,
                255,
                255
            ]));
            const image = new Image();
            image.addEventListener('load', ()=>{
                this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
                this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, image);
                this.gl.generateMipmap(this.gl.TEXTURE_2D);
            });
            image.src = url;
        } catch (e) {
            throw new Error(`Texture2DClass fetch image error: ${e.message}`);
        }
    }
}




/**
 * Created by Rick on 2022-01-01.
 */ 'use strict';
class $1f047d2ded9acdb2$export$2e2bcd8739ae039 {
    /**
   * Creates a 4x4 orthogonal projection matrix with the given bounds.
   * @param {number} left
   * @param {number} right
   * @param {number} bottom
   * @param {number} top
   * @param {number} near
   * @param {number} far
   * @returns {Float32Array} A 4x4 orthogonal projection matrix
   */ static getOrthoMatrix(left, right, bottom, top, near, far) {
        const ortho_m4 = $cDsoM$create();
        $cDsoM$ortho(ortho_m4, left, right, bottom, top, near, far);
        return ortho_m4;
    }
    /**
   * Creates a 4x4 perspective matrix
   * @param {number} fov Vertical field of view in degrees.
   * @param {number} aspect Aspect ratio. typically viewport width/height.
   * @param {number} zNear Near bound of the frustum.
   * @param {number}zFar Far bound of the frustum, can be null or Infinity.
   * @returns {Float32Array} A 4x4 perspective matrix.
   */ static getPerspectiveMatrix(fov, aspect, zNear, zFar) {
        const perspective_m4 = $cDsoM$create();
        $cDsoM$perspective(perspective_m4, $cDsoM$toRadian(fov), aspect, zNear, zFar);
        return perspective_m4;
    }
    /**
   * Creates a 4x4 translation matrix
   * @param {Float32Array} translate_ar A 3 element float array of x, y, z translation.
   * @returns {Float32Array} A 4x4 translation matrix.
   */ static getTranslationMatrix(translate_ar) {
        const translate_m4 = $cDsoM$create();
        $cDsoM$fromTranslation(translate_m4, translate_ar);
        return translate_m4;
    }
    /**
   * Creates a 4x4 rotation matrix for a specific axis
   * @param {string} axis Axis of rotation "x", "Y", or "z".
   * @param {number} rotation in degrees
   * @returns {Float32Array} A 4x4 rotation matrix
   */ static getXYZRotationMatrix(axis, rotation) {
        const rotate_m4 = $cDsoM$create();
        if (axis === 'x') $cDsoM$fromXRotation(rotate_m4, $cDsoM$toRadian(rotation));
        else if (axis === 'y') $cDsoM$fromYRotation(rotate_m4, $cDsoM$toRadian(rotation));
        else if (axis === 'z') $cDsoM$fromZRotation(rotate_m4, $cDsoM$toRadian(rotation));
        return rotate_m4;
    }
    /**
   * Creates a 4x4 scaling matrix
   * @param {Float32Array} scale_ar A 3 element float array of x, y, z scaling.
   * @returns {Float32Array} A 4x4 scale matrix
   */ static getScaleMatrix(scale_ar) {
        const scale_m4 = $cDsoM$create();
        $cDsoM$fromScaling(scale_m4, scale_ar);
        return scale_m4;
    }
}


/**
 * Created by Rick on 2021-12-11.
 */ 'use strict';
class $ed7c688a3939fc36$export$2e2bcd8739ae039 {
    /**
   * Create a UninformClass instance
   * @param {WebGLRenderingContext} gl The WebGL context.
   * @param {WebGLProgram} program The WebGL program.
   * @param {string} name The name of the uniform variable.
   * @param {string} type The type of uniform variable.
   */ constructor(gl, program, name, type){
        this.gl = gl;
        this.type = type;
        // Look up where the uniform needs to go
        this.uniformLocation = gl.getUniformLocation(program, name);
    }
    /**
   * Set the value of the uniform variable.
   * @param {number[]} args Array of values for the uniform variable.
   *   The number of array elements submitted depends on the type of
   *   variable being set.
   */ setData(...args) {
        switch(this.type){
            case 'uniform1f':
                this.gl.uniform1f(this.uniformLocation, args[0]);
                break;
            case 'uniform2f':
                this.gl.uniform2f(this.uniformLocation, args[0], args[1]);
                break;
            case 'uniform4f':
                this.gl.uniform4f(this.uniformLocation, args[0], args[1], args[2], args[3]);
                break;
            case 'uniform2fv':
                this.gl.uniform2fv(this.uniformLocation, args[0]);
                break;
            case 'uniform3fv':
                this.gl.uniform3fv(this.uniformLocation, args[0]);
                break;
            case 'uniform4fv':
                this.gl.uniform4fv(this.uniformLocation, args[0]);
                break;
            case 'uniformMatrix3fv':
                this.gl.uniformMatrix3fv(this.uniformLocation, false, args[0]);
                break;
            case 'uniformMatrix4fv':
                this.gl.uniformMatrix4fv(this.uniformLocation, false, args[0]);
                break;
            default:
                throw new Error(`UniformClass: function ${this.type} has not been implemented.`);
        }
    }
}


/**
 * Created by Rick on 2022-01-11.
 */ 'use strict';
/** @function createGLcontext
 * Create a WebGLRenderingContext from a canvas id.
 *
 * @param {string} canvas_id The html dom id for the canvas.
 * @param {string} context_type The context type. Acceptable values are '2d', 'webgl', 'webgl2', 'bitmaprenderer'.
 * @param {Object} options A set of options for the context. See {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/getContext}.
 * @returns {{gl: WebGLRenderingContext, canvas: HTMLElement}}
 */ function $2ea74f91d75e9ba4$export$904a8156d3f18680(canvas_id, context_type = 'webgl2', options) {
    // One-time initialization of the scene.
    const canvas = document.getElementById(canvas_id);
    if (!canvas) throw new Error(`createGLContext: Could not locate canvas element with id ${canvas_id}`);
    // Create a WebGLRenderingContext
    const gl = canvas.getContext(context_type, options);
    return {
        gl: gl,
        canvas: canvas
    };
}
/** @function
 * Initialize the WebGLRenderingContext by clearing the canvas and giving by default a black background.
 *
 * @param {WebGLRenderingContext} gl The WebGLRenderingContext to be initialized.
 * @param {number[]} color_v4 A 4 element vector where the first three values are the RGB values for
 *   the canvas background. The fourth is the alpha value.
 */ function $2ea74f91d75e9ba4$export$881f7fb71351b304(gl, color_v4 = [
    0,
    0,
    0,
    1
]) {
    // Clear the canvas (red, gree, blue, alpha)
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.clearColor(color_v4[0], color_v4[1], color_v4[2], color_v4[3]); // clear to black, fully opaque
    gl.clearDepth(1); // clear everything
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}
/** @function
 * Check that the size of the canvas with the css values for width and height are the same.
 *
 * @param {HTMLElement} canvas The HTML canvas element whose size is to be checked.
 * @returns {boolean} Returns TRUE if the size was reassigned.
 */ function $2ea74f91d75e9ba4$export$4d986a341d0b1b6c(canvas) {
    // Lookup the size the browser is displaying the canvas in css pixels
    const displayWidth = canvas.clientWidth;
    const displayHeight = canvas.clientHeight;
    // Check if the canvas is not the same size
    const needResize = canvas.width !== displayWidth || canvas.height !== displayHeight;
    if (needResize) {
        // Make the canvas the same size
        canvas.width = displayWidth;
        canvas.height = displayHeight;
    }
    return needResize;
}
/** @function
 * Create a complete rendering program {WebGLProgram}
 *
 * @param {WebGLRenderingContext} gl The WebGL context from the canvas.
 * @param {WebGLShader} vertex_shader The program's vertex shader.
 * @param {WebGLShader} frag_shader The program's fragment shader.
 * @returns {WebGLProgram}
 */ function $2ea74f91d75e9ba4$export$327d24a04cd0dc17(gl, vertex_shader, frag_shader) {
    const program = gl.createProgram();
    // Attach the shader objects
    gl.attachShader(program, vertex_shader);
    gl.attachShader(program, frag_shader);
    // Link the WebGLProgram object
    gl.linkProgram(program);
    // Check for success
    const success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (!success) {
        const program_info = gl.getProgramInfoLog(program);
        gl.deleteProgram(program);
        throw new Error('createProgram: ' + program_info);
    } else return program;
}
/** @function
 * Creates a shader object {WebGLShader} given
 *   the source code. See [WebGLShader]{@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLShader}
 *
 * @param {WebGLRenderingContext} gl The WebGL context from the canvas
 * @param {number} type The type of shader, either gl.VERTEX_SHADER or gl.FRAGMENT_SHADER.
 * @param {string} source The code/text of the shader.
 * @returns {WebGLShader}
 */ function $2ea74f91d75e9ba4$export$1750aa77609e1fb(gl, type, source) {
    const shader = gl.createShader(type);
    // Put the source code into the gl shader object
    gl.shaderSource(shader, source);
    // Compile the shader code
    gl.compileShader(shader);
    const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (!success) {
        const shader_info = gl.getShaderInfoLog(shader);
        gl.deleteShader(shader);
        throw new Error('createShader: ' + shader_info);
    } else return shader;
}






/**
 * Created by Rick on 2022-01-12.
 */ 'use strict';


export {$a772bd1f72355166$export$2e2bcd8739ae039 as AttributeClass, $85c9a8abe908bb27$export$2e2bcd8739ae039 as ElementClass, $9497f4d83afc6f16$export$2e2bcd8739ae039 as ReadShaderCodeClass, $d8b774673237c2e7$export$2e2bcd8739ae039 as Texture2DClass, $1f047d2ded9acdb2$export$2e2bcd8739ae039 as TransformsClass, $ed7c688a3939fc36$export$2e2bcd8739ae039 as UniformClass, $2ea74f91d75e9ba4$export$904a8156d3f18680 as createGLcontext, $2ea74f91d75e9ba4$export$881f7fb71351b304 as initializeContext, $2ea74f91d75e9ba4$export$4d986a341d0b1b6c as resizeCanvasToDisplaySize, $2ea74f91d75e9ba4$export$327d24a04cd0dc17 as createProgram, $2ea74f91d75e9ba4$export$1750aa77609e1fb as createShader};
//# sourceMappingURL=web-gl-helpers.js.map
