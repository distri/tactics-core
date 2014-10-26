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

  it "should process state based actions", ->
    character.stateBasedActions()

  it "should be able to have stats modified by effects", ->
    assert.equal character.mods("strength"), 0

    character.addEffect
      attribute: "strength"
      amount: -3

    assert.equal character.mods("strength"), -3

  it "effects should be able to provide damage immunity", ->
    character.addEffect
      resistance: 1
      type: "Fire"

    assert.equal character.modifiedDamage(999, "Fire"), 0

  it "should die when taking a boatload of damage", ->
    boatload = 999

    character.damage boatload
    character.stateBasedActions()

    assert character.dead()
