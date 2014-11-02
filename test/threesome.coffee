Three = require "../lib/threesome"

describe "menage a trois", ->
  it "should have a scene, a camera, and a renderer", ->
    Three.init({}, ->)
