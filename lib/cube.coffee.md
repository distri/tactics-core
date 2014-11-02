Cube
====

    CUBE_SIZE = 10

    geometry = new THREE.BoxGeometry(CUBE_SIZE, CUBE_SIZE, CUBE_SIZE)
    material = new THREE.MeshBasicMaterial
      color: 0xffffff
      wireframe: true

    module.exports = (x, z) ->
      cube = new THREE.Object3D()
      cube.position.set(x * CUBE_SIZE, 0, z * CUBE_SIZE)

      mesh = new THREE.Mesh geometry, material
      cube.add(mesh)

      return cube
