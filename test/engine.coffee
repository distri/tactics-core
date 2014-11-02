Engine = require "../lib/engine"

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
      update: ->
        c += 1

    engine.start()

    setTimeout ->
      console.log c
      assert c > 58
      assert c < 62
      engine.stop()
      done()
    , 1000
