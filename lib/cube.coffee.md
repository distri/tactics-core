Cube
====

    CUBE_SIZE = 10

    geometry = new THREE.BoxGeometry(CUBE_SIZE, CUBE_SIZE, CUBE_SIZE)

    module.exports = (x, z) ->
      material = new THREE.MeshBasicMaterial
        color: 0xffffff

      cube = new THREE.Mesh geometry, material
      cube.position.set(x * CUBE_SIZE, -CUBE_SIZE/2, z * CUBE_SIZE)

      return cube
