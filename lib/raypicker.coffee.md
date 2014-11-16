Raypicker
=========

Select an object using raycasting in THREE.js

    raycaster = new THREE.Raycaster()

    mouseEventToVector = (event) ->
      {clientX:x, clientY:y} = event

      {
        clientWidth:width
        clientHeight:height
        clientLeft:left
        clientTop:top
      } = event.currentTarget

      x = x - left
      y = y - top

      vector = new THREE.Vector3()
      vector.set(
        ( x / width ) * 2 - 1,
        - ( y / height ) * 2 + 1,
        0
      )

      return vector

    pick = (vector, objects, camera) ->
      vector.unproject camera
      vector.sub camera.position
      vector.normalize()

      raycaster.set camera.position, vector

      intersects = raycaster.intersectObjects(objects, true)

    module.exports = (camera, objectsFn, handler) ->
      (event) ->
        event.preventDefault()

        vector = mouseEventToVector(event)

        handler pick(vector, objectsFn(), camera)
