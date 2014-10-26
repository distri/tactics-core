Character = require "../character"

describe "Character", ->
  character = Character()

  it "should have health", ->
    assert character.health()

  it "should have actions", ->
    assert character.actions()
