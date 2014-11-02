describe "keyValues", ->
  it "should iterate keys and values of an object", (done) ->
    o = 
      test: "value"

    keyValues o, (key, value) ->
      assert.equal key, "test"
      assert.equal value, "value"

      done()
