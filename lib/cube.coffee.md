Cube
====

    CUBE_SIZE = 1

    geometry = new THREE.BoxGeometry(CUBE_SIZE, CUBE_SIZE, CUBE_SIZE)

    module.exports = (x, y, z) ->
      material = new THREE.MeshLambertMaterial

      grayness = (y * 0.1) + 0.5 + rand() * 0.05
      material.color.setRGB grayness, grayness, grayness

      cube = new THREE.Mesh geometry, material
      cube.position.set(x * CUBE_SIZE, (y - 0.5) * CUBE_SIZE, z * CUBE_SIZE)

      return cube
