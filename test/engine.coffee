Engine = require "../lib/engine"

describe "engine", ->
  it "should start and stop", (done) ->
    engine = Engine({},
      update: ->
        engine.stop()
        done()
    )

    engine.start()
