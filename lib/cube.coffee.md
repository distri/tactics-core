Cube
====

    CUBE_SIZE = 1

    geometry = new THREE.BoxGeometry(CUBE_SIZE, CUBE_SIZE, CUBE_SIZE)

    module.exports = (x, y, z) ->
      material = new THREE.MeshBasicMaterial

      grayness = rand() * 0.5 + 0.25
      material.color.setRGB grayness, grayness, grayness

      cube = new THREE.Mesh geometry, material
      cube.position.set(x * CUBE_SIZE, (y - 0.5) * CUBE_SIZE, z * CUBE_SIZE)

      return cube
