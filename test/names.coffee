Names = require "../names"
DataLoader = require "../data_loader"

DataLoader.names().then (data) ->
  NamePicker = Names(data)

  describe "Names", ->
    it "should pick at random", ->
      name = NamePicker.random()

      console.log name
      assert name

    it "should pick a scoped name", ->
      name = NamePicker.random
        culture: "Monster"

      console.log name
      assert name

    it "should pick a name scoped by culture and gender", ->
      name = NamePicker.random
        culture: "Humanoid"
        gender: "F"

      console.log name
      assert name
