Character = require "../character"

describe "Character", ->
  character = Character()

  it "should have health", ->
    assert character.health()

  it "should have actions", ->
    assert character.actions()

  it "should serialize position to JSON", ->
    character.position Point(5, 2)
    
    assert character.I.position
    assert.equal character.I.position.x, 5

    assert.equal character.toJSON().position.x, 5
