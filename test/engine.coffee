Engine = require "../lib/engine"

equalEnough = (a, b) ->
  assert (b - a) < 0.0001
  assert (a - b) < 0.0001

describe "engine", ->
  it "should start and stop", (done) ->
    engine = Engine({},
      update: ->
        engine.stop()
        done()
    )

    engine.start()

  it "should update about 60 times a second", (done) ->
    c = 0

    engine = Engine {},
      update: (t, dt) ->
        equalEnough(t, c * 1/60)
        c += 1

        assert.equal dt, 1/60

    engine.start()

    setTimeout ->
      console.log c
      assert c > 58
      assert c < 62
      engine.stop()
      done()
    , 1000
