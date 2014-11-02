mocha.globals ['jQuery*']

DataLoader = require "../data_loader"

describe "Character loading", ->
  it "should load data from remote spreadsheets", (done) ->
    DataLoader.characters().then (characters) ->
      console.log characters
      done()
    .done()

describe "Name loading", ->
  it "should load name data from remote spreadsheets", (done) ->
    DataLoader.names().then (names) ->
      console.log names
      done()
    .done()
