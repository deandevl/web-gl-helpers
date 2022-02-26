/**
 * Created by Rick on 2022-02-05.
 */
'use strict';

// Visualize the axis on the screen
export default class Axis {

  constructor(
    dimension = 10,
    diffuse = [1, 1, 1, 1],
    wireframe = true,
    visible = true
    ) {
    this.alias = 'axis';

    this.wireframe = wireframe;
    this.visible = visible;
    this.diffuse = diffuse;
    this.indices = [0, 1, 2, 3, 4, 5];
    this.dimension = dimension;

    this.build(this.dimension)
  }
  setDiffuse(diffuse){
    this.diffuse = diffuse;
  }
  build(dimension) {
    if (dimension) {
      this.dimension = dimension;
    }

    this.vertices = [
      -dimension, 0.0, 0.0,
      dimension, 0.0, 0.0,
      0.0, -dimension / 2, 0.0,
      0.0, dimension / 2, 0.0,
      0.0, 0.0, -dimension,
      0.0, 0.0, dimension
    ];
  }
}