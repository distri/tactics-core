Main = require "../main"

describe "main", ->
  it "should expose Character", ->
    assert Main.Character

  it "should init", ->
    assert Main.init({}, ->)
