
module.exports = (camera) ->
  # TODO: Switch to websockets or something a little better that ajaxin
  setInterval ->
    $.getJSON("http://localhost:3000/orientation").then ({pitch, yaw, roll}) ->
      camera.rotation.x = pitch
      camera.rotation.y = yaw
      camera.rotation.z = roll
  , 1
