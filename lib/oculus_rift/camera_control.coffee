
module.exports = (camera) ->
  # TODO: Switch to websockets or something a little better that ajaxin
  setInterval ->
    $.getJSON("http://localhost:3000/").then ({position, quat}) ->
      {x, y, z, w} = quat
      camera.quaternion.set(x, y, z, w)
      {x, y, z} = position
      camera.position.set(x, y + 100, z + 200)
  , 10
