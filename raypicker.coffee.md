Raypicker
=========

Select an object using raycasting in THREE.js

    raycaster = new THREE.Raycaster()

    mouseEventToVector = (event) ->

      vector = new THREE.Vector3()
      vector.set( 
        ( event.clientX / window.innerWidth ) * 2 - 1, 
        - ( event.clientY / window.innerHeight ) * 2 + 1, 
        0.5
      )

      return vector

    pick = (vector, objects, camera) ->
      vector.unproject( camera )

      raycaster.ray.set( camera.position, vector.sub( camera.position ).normalize() )

      intersects = raycaster.intersectObjects( objects )

    module.exports = (objects, camera) ->
      (event) ->
        event.preventDefault()

        vector = mouseEventToVector(event)

        pick(vector, objects, camera)
