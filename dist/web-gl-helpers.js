import {toRadian as $bdjGp$toRadian} from "gl-matrix/esm/common";
import {create as $bdjGp$create, ortho as $bdjGp$ortho, perspective as $bdjGp$perspective, fromTranslation as $bdjGp$fromTranslation, fromRotation as $bdjGp$fromRotation, fromXRotation as $bdjGp$fromXRotation, fromYRotation as $bdjGp$fromYRotation, fromZRotation as $bdjGp$fromZRotation, fromScaling as $bdjGp$fromScaling} from "gl-matrix/esm/mat4";

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
 */ function $30e336cde2eb38f0$export$904a8156d3f18680(canvas_id, context_type = 'webgl2', options) {
    // One-time initialization of the scene.
    const canvas = document.getElementById(canvas_id);
    if (!canvas) throw new Error(`HelperFunctions-createGLContext-Error: Could not locate canvas element with id ${canvas_id}`);
    // Create a WebGLRenderingContext
    const gl = canvas.getContext(context_type, options);
    return {
        gl: gl,
        canvas: canvas
    };
}
/** @function
 * Initialize the WebGLRenderingContext by clearing the canvas and giving by default a white background.
 *
 * @param {WebGLRenderingContext} gl The WebGLRenderingContext to be initialized.
 * @param {number[]} color_v4 A 4 element array where the first three values are the normalized RGB values for
 *   the canvas background. The fourth is the alpha value.
 */ function $30e336cde2eb38f0$export$881f7fb71351b304(gl, color_v4 = [
    0.9,
    0.9,
    0.9,
    1
]) {
    // Clear the canvas (red, gree, blue, alpha)
    gl.clearColor(color_v4[0], color_v4[1], color_v4[2], color_v4[3]); // clear to black, fully opaque
    gl.clearDepth(1); // clear everything
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
}
/** @function
 * Check that the size of the canvas with the css values for width and height are the same.
 *
 * @param {HTMLElement} canvas The HTML canvas element whose size is to be checked.
 * @returns {boolean} Returns TRUE if the size was reassigned.
 */ function $30e336cde2eb38f0$export$4d986a341d0b1b6c(canvas) {
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
/**
 * // Given a canvas element, expand it to the size of the window
 // and ensure that it automatically resizes as the window changes
 * @param {HTMLElement} canvas The HTML canvas element whose size is to be resized.
 */ function $30e336cde2eb38f0$export$8973f7b152f64303(canvas) {
    const expandFullScreen = ()=>{
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };
    expandFullScreen();
    // Resize screen when the browser has triggered the resize event
    window.addEventListener('resize', expandFullScreen);
}
/** @function
 * Create a complete rendering program {WebGLProgram}
 *
 * @param {WebGLRenderingContext} gl The WebGL context from the canvas.
 * @param {WebGLShader} vertex_shader The program's vertex shader.
 * @param {WebGLShader} frag_shader The program's fragment shader.
 * @returns {WebGLProgram}
 */ function $30e336cde2eb38f0$export$327d24a04cd0dc17(gl, vertex_shader, frag_shader) {
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
        throw new Error(`HelperFunctions-createProgram-Error: ${program_info}`);
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
 */ function $30e336cde2eb38f0$export$1750aa77609e1fb(gl, type, source) {
    const shader = gl.createShader(type);
    // Put the source code into the gl shader object
    gl.shaderSource(shader, source);
    // Compile the shader code
    gl.compileShader(shader);
    const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (!success) {
        const shader_info = gl.getShaderInfoLog(shader);
        gl.deleteShader(shader);
        throw new Error(`HelperFunctions-createShader-Error: ${shader_info}`);
    } else return shader;
}
/**
 * Clean the Vertex Array Object(vbo) buffer, the
 *   vertex buffer, and the element array buffer.
 *
 * @param {WebGLRenderingContext} gl The WebGL context from the canvas
 */ function $30e336cde2eb38f0$export$725bae51f68867ff(gl) {
    if (gl !== undefined) {
        gl.bindVertexArray(null);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    }
}
// Returns computed normals for provided vertices.
// Note: Indices have to be completely defined--NO TRIANGLE_STRIP only TRIANGLES.
function $30e336cde2eb38f0$export$af7a3158426821e0(vs, ind) {
    const x = 0, y = 1, z = 2, ns = [];
    // For each vertex, initialize normal x, normal y, normal z
    for(let i = 0; i < vs.length; i += 3){
        ns[i + x] = 0;
        ns[i + y] = 0;
        ns[i + z] = 0;
    }
    // We work on triads of vertices to calculate
    for(let i1 = 0; i1 < ind.length; i1 += 3){
        // Normals so i = i+3 (i = indices index)
        const v1 = [], v2 = [], normal = [];
        // p2 - p1
        v1[x] = vs[3 * ind[i1 + 2] + x] - vs[3 * ind[i1 + 1] + x];
        v1[y] = vs[3 * ind[i1 + 2] + y] - vs[3 * ind[i1 + 1] + y];
        v1[z] = vs[3 * ind[i1 + 2] + z] - vs[3 * ind[i1 + 1] + z];
        // p0 - p1
        v2[x] = vs[3 * ind[i1] + x] - vs[3 * ind[i1 + 1] + x];
        v2[y] = vs[3 * ind[i1] + y] - vs[3 * ind[i1 + 1] + y];
        v2[z] = vs[3 * ind[i1] + z] - vs[3 * ind[i1 + 1] + z];
        // Cross product by Sarrus Rule
        normal[x] = v1[y] * v2[z] - v1[z] * v2[y];
        normal[y] = v1[z] * v2[x] - v1[x] * v2[z];
        normal[z] = v1[x] * v2[y] - v1[y] * v2[x];
        // Update the normals of that triangle: sum of vectors
        for(let j = 0; j < 3; j++){
            ns[3 * ind[i1 + j] + x] = ns[3 * ind[i1 + j] + x] + normal[x];
            ns[3 * ind[i1 + j] + y] = ns[3 * ind[i1 + j] + y] + normal[y];
            ns[3 * ind[i1 + j] + z] = ns[3 * ind[i1 + j] + z] + normal[z];
        }
    }
    // Normalize the result.
    // The increment here is because each vertex occurs.
    for(let i2 = 0; i2 < vs.length; i2 += 3){
        // With an offset of 3 in the array (due to x, y, z contiguous values)
        const nn = [];
        nn[x] = ns[i2 + x];
        nn[y] = ns[i2 + y];
        nn[z] = ns[i2 + z];
        let len = Math.sqrt(nn[x] * nn[x] + nn[y] * nn[y] + nn[z] * nn[z]);
        if (len === 0) len = 1;
        nn[x] = nn[x] / len;
        nn[y] = nn[y] / len;
        nn[z] = nn[z] / len;
        ns[i2 + x] = nn[x];
        ns[i2 + y] = nn[y];
        ns[i2 + z] = nn[z];
    }
    return ns;
}
/**
 * Convert hex string color to rgb array
 *
 * @param hex_str A hex string in form '#_____'
 * @returns {number[]} An 3 element array of integers for RGB color
 */ function $30e336cde2eb38f0$export$848d71df1f759bc(hex_str) {
    const hex = parseInt(hex_str.replace(/^#/, ''), 16);
    const red = hex >> 16 & 255;
    const green = hex >> 8 & 255;
    const blue = hex & 255;
    return [
        red,
        green,
        blue
    ];
}
/**
 * Convert rgb array to hex string
 *
 * @param {number[]} rgb A integer array for RGB color
 * @returns {string} A hex string of the RGB color
 */ function $30e336cde2eb38f0$export$34d09c4a771c46ef(rgb) {
    const red = rgb[0] << 16;
    const green = rgb[1] << 8;
    const blue = rgb[2];
    return "#" + (16777216 + red + green + blue).toString(16).slice(1, 7);
}
/**
 * De-normalize colors from 0-1 to 0-255
 *
 * @param {number[]} color A normalized color array with values from 0-1
 * @returns {number[]} An integer color array with values from 0-255
 */ function $30e336cde2eb38f0$export$66dee46263f04994(color) {
    return color.map((c)=>c * 255
    );
}
// Normalize colors from 0-255 to 0-1
/**
 *
 * @param color An integer RGB color array with values from 0-255
 * @returns {number[]} A normalized RGB color array with values from 0-1
 */ function $30e336cde2eb38f0$export$4cde5df63f53f473(color) {
    return color.map((c)=>c / 255
    );
}













/**
 * Created by Rick on 2021-12-11.
 */ 'use strict';
class $741435e70dd17b15$export$2e2bcd8739ae039 {
    /**
   * Create an AttributeClass instance
   * @param {WebGLRenderingContext} gl The WebGL context
   * @param {number} type  Specifying the [data type]{@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/vertexAttribPointer}
   *   of each element in the array.
   * @param {WebGLProgram} program The WebGL program.
   * @param {string} name The name of the attribute variable used in the vertex shader code.
   */ constructor(gl, type, program, name){
        this.gl = gl;
        this.buffer_type = 'ARRAY';
        this.data_type = type;
        // Look up where the attribute needs to go
        this.attributeLocation = this.gl.getAttribLocation(program, name);
        this.arrayBuffer = this.gl.createBuffer();
    }
    /**
   * Describes how the attribute is read from the buffer pipeline.
   * @param {number} size  The number of components per vertex attribute. Must be 1, 2, 3, or 4.
   * @param {boolean} normalize Specifying whether integer data values should be normalized.
   * @param {number} stride Specifying the offset in bytes between the beginning of consecutive vertex attributes.
   * @param {number} offset Specifying an offset in bytes of the first component in the vertex attribute array.
   */ bufferFormat(size, normalize, stride, offset) {
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.arrayBuffer);
        // Tell the attribute how to get data out of the internal ARRAY_BUFFER
        this.gl.vertexAttribPointer(this.attributeLocation, size, this.data_type, normalize, stride, offset);
        this.gl.enableVertexAttribArray(this.attributeLocation);
    }
    /**
   * Initializes and creates the buffer object's data store.
   * @param {Array} attributes Array containing
   *   vertex attributes, such as vertex coordinates, texture coordinate data, or vertex color data.
   * @param {number} usage Specifies the intended [usage pattern]{@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bufferData} of the data store for optimization purposes.
   */ setData(attributes, usage) {
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.arrayBuffer);
        // Check if we need to flatten 'attributes'
        let values;
        values = attributes;
        if (typeof attributes[0] == 'number') {
            values = new Array(attributes.length);
            for(let i = 0; i < attributes.length; i++)values[i] = attributes[i];
        } else if (Array.isArray(attributes)) {
            values = new Array(attributes.length * attributes[0].length);
            for(let i = 0; i < attributes.length; i++)for(let j = 0; j < attributes[0].length; j++)values[i * attributes[0].length + j] = attributes[i][j];
        }
        // Set geometry
        switch(this.data_type){
            case this.gl.FLOAT:
                this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(values), usage);
                break;
            case this.gl.UNSIGNED_BYTE:
                this.gl.bufferData(this.gl.ARRAY_BUFFER, new Uint8Array(values), usage);
                break;
        }
    }
    /**
   * Delete this classes array buffer instance
   */ delete() {
        this.gl.deleteBuffer(this.arrayBuffer);
    }
}


/**
 * Created by Rick on 2022-01-15.
 */ 'use strict';
class $2106eb82ee0eb0d1$export$2e2bcd8739ae039 {
    /**
   * Create an instance of ElementArrayBufferClass
   * @param gl {WebGLRenderingContext} gl The WebGL context
   * @param type {string} The numeric type for the indices.
   *   Acceptable values are "Uint8Array" or "Uint16Array".
   */ constructor(gl, type){
        this.gl = gl;
        this.buffer_type = 'ELEMENT';
        this.data_type = type;
        this.buffer_length = 0;
        // Create a buffer to put the element index values
        this.indexBuffer = gl.createBuffer();
    }
    /**
   * Set the indices of the geometry's vertices
   * @param {number[]} indices A numeric array of vertex indices.
   * @param {number} usage Specifies the intended [usage pattern]{@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bufferData} of the data store for optimization purposes.
   */ setData(indices, usage) {
        this.buffer_length = indices.length;
        // Bind this.buffer to WebGL's internal ELEMENT_ARRAY_BUFFER
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        switch(this.data_type){
            case "Uint8Array":
                this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(indices), usage);
                break;
            case "Uint16Array":
                this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), usage);
                break;
        }
    }
    /**
   * Rebind the index buffer
   */ rebind() {
        // Bind this.buffer to WebGL's internal ELEMENT_ARRAY_BUFFER
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    }
    /**
   * Delete this classes index buffer instance
   */ delete() {
        this.gl.deleteBuffer(this.indexBuffer);
    }
}


/**
 * Created by Rick on 2021-12-09.
 */ 'use strict';
class $919d16e3edb93c48$export$2e2bcd8739ae039 {
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
                let data = await $919d16e3edb93c48$export$2e2bcd8739ae039.#get_data(shader_url);
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
class $2ef498567da6e11d$export$2e2bcd8739ae039 {
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
   *   blue color while the image is loaded. The function is async
   *   and returns a javascript Promise.
   * @param {string} url The file path to the image to be used as a texture
   */ async loadTexture(url) {
        // Fill the texture with a 1x1 colored pixel
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, 1, 1, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, new Uint8Array([
            0,
            0,
            255,
            255
        ]) //pixel source
        );
        let response = await fetch(url);
        let blob = await response.blob();
        let image = await createImageBitmap(blob, {
            imageOrientation: 'flipY'
        });
        const texture = this.gl.createTexture();
        this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.REPEAT);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.REPEAT);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, image);
    }
}




/**
 * Created by Rick on 2022-01-01.
 */ 'use strict';
class $85b93eff61a3c0d2$export$2e2bcd8739ae039 {
    /**
   * Creates a flattened 4x4 orthogonal projection matrix with the given bounds.
   * @param {number} left
   * @param {number} right
   * @param {number} bottom
   * @param {number} top
   * @param {number} near
   * @param {number} far
   * @returns {Float32Array} A flattened 4x4 orthogonal projection matrix
   */ static getOrthoMatrix(left, right, bottom, top, near, far) {
        const ortho_m4 = $bdjGp$create();
        $bdjGp$ortho(ortho_m4, left, right, bottom, top, near, far);
        return ortho_m4;
    }
    /**
   * Creates a flattened 4x4 perspective matrix
   * @param {number} fov Vertical field of view in degrees.
   * @param {number} aspect Aspect ratio. typically viewport width/height.
   * @param {number} zNear Near bound of the frustum.
   * @param {number}zFar Far bound of the frustum, can be null or Infinity.
   * @returns {Float32Array} A flattened 4x4 perspective matrix.
   */ static getPerspectiveMatrix(fov, aspect, zNear, zFar) {
        const perspective_m4 = $bdjGp$create();
        $bdjGp$perspective(perspective_m4, $bdjGp$toRadian(fov), aspect, zNear, zFar);
        return perspective_m4;
    }
    /**
   * Creates a 4x4 flattened translation matrix
   * @param {Float32Array} translate_v A 3 element float array of x, y, z translation.
   * @returns {Float32Array} A flattened 4x4 translation matrix.
   */ static getTranslationMatrix(translate_v) {
        const translate_m4 = $bdjGp$create();
        $bdjGp$fromTranslation(translate_m4, translate_v);
        return translate_m4;
    }
    /**
   * Creates a flattened 4x4 matrix from a given angle around a given axis.
   * @param {number} rotation_deg The angle to rotate the matrix by
   * @param {number[]} axis_v The three element vector that defines
   *   the line of rotation from [0,0,0] to axis[dx,dy,dz].
   * @returns {Float32Array} A flattened 4x4 rotation matrix
   */ static getRotationMatrix(rotation_deg, axis_v) {
        const rotate_m4 = $bdjGp$create();
        $bdjGp$fromRotation(rotate_m4, $bdjGp$toRadian(rotation_deg), axis_v);
        return rotate_m4;
    }
    /**
   * Creates a flattened 4x4 rotation matrix for a specific axis.
   * @param {string} axis Axis of rotation "x", "Y", or "z".
   * @param {number} rotation_deg in degrees
   * @returns {Float32Array} A flattened 4x4 rotation matrix
   */ static getXYZRotationMatrix(axis, rotation_deg) {
        const rotate_m4 = $bdjGp$create();
        if (axis === 'x') $bdjGp$fromXRotation(rotate_m4, $bdjGp$toRadian(rotation_deg));
        else if (axis === 'y') $bdjGp$fromYRotation(rotate_m4, $bdjGp$toRadian(rotation_deg));
        else if (axis === 'z') $bdjGp$fromZRotation(rotate_m4, $bdjGp$toRadian(rotation_deg));
        return rotate_m4;
    }
    /**
   * Creates a flattened 4x4 scaling matrix
   * @param {Float32Array} scale_v A 3 element float array of x, y, z scaling.
   * @returns {Float32Array} A flattened 4x4 scale matrix
   */ static getScaleMatrix(scale_v) {
        const scale_m4 = $bdjGp$create();
        $bdjGp$fromScaling(scale_m4, scale_v);
        return scale_m4;
    }
}


/**
 * Created by Rick on 2021-12-11.
 */ 'use strict';
class $f27088d7fc79e3e7$export$2e2bcd8739ae039 {
    /**
   * Create a UninformClass instance
   * @param {WebGLRenderingContext} gl The WebGL context.
   * @param {WebGLProgram} program The WebGL program.
   * @param {string} name The name of the uniform variable used in the shader code.
   * @param {string} type The type of uniform variable.
   */ constructor(gl, program, name, type){
        this.gl = gl;
        this.data_type = type;
        this.data = null;
        // Look up where the uniform needs to go
        this.uniformLocation = gl.getUniformLocation(program, name);
    }
    /**
   * Set the value of the uniform variable.
   * @param {number[]} args Array of values for the uniform variable.
   *   The number of array elements submitted depends on the type of
   *   variable being set.
   */ setData(...args) {
        switch(this.data_type){
            case 'uniform1i':
                this.gl.uniform1i(this.uniformLocation, args[0]);
                this.data = args[0];
                break;
            case 'uniform1f':
                this.gl.uniform1f(this.uniformLocation, args[0]);
                this.data = args[0];
                break;
            case 'uniform2f':
                this.gl.uniform2f(this.uniformLocation, args[0], args[1]);
                this.data = [
                    args[0],
                    args[1]
                ];
                break;
            case 'uniform4f':
                this.gl.uniform4f(this.uniformLocation, args[0], args[1], args[2], args[3]);
                this.data = [
                    args[0],
                    args[1],
                    args[2],
                    args[3]
                ];
                break;
            case 'uniform2fv':
                this.gl.uniform2fv(this.uniformLocation, args[0]);
                this.data = args[0];
                break;
            case 'uniform3fv':
                this.gl.uniform3fv(this.uniformLocation, args[0]);
                this.data = args[0];
                break;
            case 'uniform4fv':
                this.gl.uniform4fv(this.uniformLocation, args[0]);
                this.data = args[0];
                break;
            case 'uniformMatrix3fv':
                this.gl.uniformMatrix3fv(this.uniformLocation, false, args[0]);
                this.data = args[0];
                break;
            case 'uniformMatrix4fv':
                this.gl.uniformMatrix4fv(this.uniformLocation, false, args[0]);
                this.data = args[0];
                break;
            default:
                throw new Error(`UniformClass: function ${this.type} has not been implemented.`);
        }
    }
}


/**
 * Created by Rick on 2022-01-25.
 */ 'use strict';
class $77a07b50ef9c1a91$export$2e2bcd8739ae039 {
    /**
   * Create an instance of VertexArrayObject
   * @param {WebGLRenderingContext} gl The WebGL context
   */ constructor(gl){
        this.gl = gl;
        this.vao = gl.createVertexArray();
        // Make vao the one we're currently working with
        gl.bindVertexArray(this.vao);
    }
    /**
   * Rebind the Vertex Array Object
   */ rebind() {
        this.gl.bindVertexArray(this.vao);
    }
    /**
   * Clean the buffer reference from the graphics hardware
   */ clean() {
        this.gl.bindVertexArray(null);
    }
    /**
   * Deletes this classes Vertex Array Object instance
   */ delete() {
        this.gl.deleteVertexArray(this.vao);
    }
}


/**
 * Created by Rick on 2022-02-05.
 */ 'use strict';
class $93632113ce59bc3a$export$2e2bcd8739ae039 {
    constructor(dimension = 10, diffuse = [
        1,
        1,
        1,
        1
    ], wireframe = true, visible = true){
        this.alias = 'axis';
        this.wireframe = wireframe;
        this.visible = visible;
        this.diffuse = diffuse;
        this.indices = [
            0,
            1,
            2,
            3,
            4,
            5
        ];
        this.dimension = dimension;
        this.build(this.dimension);
    }
    setDiffuse(diffuse) {
        this.diffuse = diffuse;
    }
    build(dimension) {
        if (dimension) this.dimension = dimension;
        this.vertices = [
            -dimension,
            0,
            0,
            dimension,
            0,
            0,
            0,
            -dimension / 2,
            0,
            0,
            dimension / 2,
            0,
            0,
            0,
            -dimension,
            0,
            0,
            dimension
        ];
    }
}


/**
 * Created by Rick on 2022-02-26.
 */ 'use strict';
class $b923e572fa61b16f$export$2e2bcd8739ae039 {
    constructor(diffuse = [
        1,
        0.664,
        0,
        1
    ], wireframe = true, visible = true){
        this.alias = 'cone';
        this.diffuse = diffuse;
        this.wireframe = wireframe;
        this.visible = visible;
        this.vertices = [
            0,
            6,
            -0.000000000000000259787,
            3,
            0.000000000000000888178,
            0.000000000000000519574,
            2.79742,
            0.000000000000000888178,
            -1.08372,
            2.21703,
            0.000000000000000888178,
            -2.02109,
            1.33722,
            0.000000000000000444089,
            -2.68549,
            0.276805,
            0.000000000000000444089,
            -2.9872,
            -0.820989,
            0.000000000000000444089,
            -2.88548,
            -1.8079,
            0.000000000000000888178,
            -2.39405,
            -2.55065,
            0.000000000000000888178,
            -1.5793,
            -2.94892,
            0.000000000000000888178,
            -0.551249,
            -2.94892,
            0.000000000000000888178,
            0.551249,
            -2.55065,
            0.000000000000000888178,
            1.5793,
            -1.8079,
            0.000000000000000888178,
            2.39405,
            -0.820989,
            0.00000000000000133227,
            2.88548,
            0.276805,
            0.00000000000000133227,
            2.9872,
            1.33722,
            0.00000000000000133227,
            2.68549,
            2.21703,
            0.000000000000000888178,
            2.02109,
            2.79742,
            0.000000000000000888178,
            1.08372,
            3,
            0.000000000000000888178,
            -0.00000000246124
        ];
        this.indices = [
            0,
            1,
            2,
            0,
            2,
            3,
            0,
            3,
            4,
            0,
            4,
            5,
            0,
            5,
            6,
            0,
            6,
            7,
            0,
            7,
            8,
            0,
            8,
            9,
            0,
            9,
            10,
            0,
            10,
            11,
            0,
            11,
            12,
            0,
            12,
            13,
            0,
            13,
            14,
            0,
            14,
            15,
            0,
            15,
            16,
            0,
            16,
            17,
            0,
            17,
            18
        ];
    }
}


/**
 * Created by Rick on 2022-02-05.
 */ 'use strict';
class $8a9792eb9d8d8de1$export$2e2bcd8739ae039 {
    constructor(dimension = 50, lines = 5, diffuse = [
        1,
        1,
        1,
        1
    ], wireframe = true, visible = true){
        this.alias = 'floor';
        this.dimension = dimension;
        this.lines = lines;
        this.diffuse = diffuse;
        this.vertices = [];
        this.indices = [];
        this.wireframe = wireframe;
        this.visible = visible;
        this.build(this.dimension, this.lines);
    }
    setDiffuse(diffuse) {
        this.diffuse = diffuse;
    }
    build(dimension, lines) {
        if (dimension) this.dimension = dimension;
        if (lines) this.lines = 2 * this.dimension / lines;
        const inc = 2 * this.dimension / this.lines;
        const v = [];
        const i = [];
        for(let l = 0; l <= this.lines; l++){
            v[6 * l] = -this.dimension;
            v[6 * l + 1] = 0;
            v[6 * l + 2] = -this.dimension + l * inc;
            v[6 * l + 3] = this.dimension;
            v[6 * l + 4] = 0;
            v[6 * l + 5] = -this.dimension + l * inc;
            v[6 * (this.lines + 1) + 6 * l] = -this.dimension + l * inc;
            v[6 * (this.lines + 1) + 6 * l + 1] = 0;
            v[6 * (this.lines + 1) + 6 * l + 2] = -this.dimension;
            v[6 * (this.lines + 1) + 6 * l + 3] = -this.dimension + l * inc;
            v[6 * (this.lines + 1) + 6 * l + 4] = 0;
            v[6 * (this.lines + 1) + 6 * l + 5] = this.dimension;
            i[2 * l] = 2 * l;
            i[2 * l + 1] = 2 * l + 1;
            i[2 * (this.lines + 1) + 2 * l] = 2 * (this.lines + 1) + 2 * l;
            i[2 * (this.lines + 1) + 2 * l + 1] = 2 * (this.lines + 1) + 2 * l + 1;
        }
        this.vertices = v;
        this.indices = i;
    }
}


/**
 * Created by Rick on 2022-01-12.
 */ 'use strict';


export {$30e336cde2eb38f0$export$904a8156d3f18680 as createGLcontext, $30e336cde2eb38f0$export$881f7fb71351b304 as initializeContext, $30e336cde2eb38f0$export$4d986a341d0b1b6c as resizeCanvasToDisplaySize, $30e336cde2eb38f0$export$8973f7b152f64303 as autoResizeCanvas, $30e336cde2eb38f0$export$327d24a04cd0dc17 as createProgram, $30e336cde2eb38f0$export$1750aa77609e1fb as createShader, $30e336cde2eb38f0$export$725bae51f68867ff as cleanBuffers, $30e336cde2eb38f0$export$af7a3158426821e0 as calculateNormals, $30e336cde2eb38f0$export$848d71df1f759bc as hexToRGB, $30e336cde2eb38f0$export$34d09c4a771c46ef as rgbToHex, $30e336cde2eb38f0$export$66dee46263f04994 as denormalizeColor, $30e336cde2eb38f0$export$4cde5df63f53f473 as normalizeColor, $741435e70dd17b15$export$2e2bcd8739ae039 as ArrayBufferClass, $2106eb82ee0eb0d1$export$2e2bcd8739ae039 as ElementArrayBufferClass, $919d16e3edb93c48$export$2e2bcd8739ae039 as ReadShaderCodeClass, $2ef498567da6e11d$export$2e2bcd8739ae039 as Texture2DClass, $85b93eff61a3c0d2$export$2e2bcd8739ae039 as TransformsClass, $f27088d7fc79e3e7$export$2e2bcd8739ae039 as UniformClass, $77a07b50ef9c1a91$export$2e2bcd8739ae039 as VertexArrayObjectClass, $93632113ce59bc3a$export$2e2bcd8739ae039 as AxisClass, $b923e572fa61b16f$export$2e2bcd8739ae039 as ConeClass, $8a9792eb9d8d8de1$export$2e2bcd8739ae039 as FloorClass};
//# sourceMappingURL=web-gl-helpers.js.map
