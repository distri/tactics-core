
module.exports = (camera) ->
  setInterval ->
    $.getJSON("http://localhost:3000/orientation").then ({roll, pitch, yaw}) ->
      # euler = new THREE.Euler(roll, pitch, yaw)

      camera.rotation.x = pitch
      camera.rotation.y = yaw
      camera.rotation.z = roll
  , 1
