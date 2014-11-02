mocha.globals ['jQuery*']

Character = require "../character"

describe "Character loading", ->
  it "should load data from remote spreadsheets", (done) ->
    Character.loadData().then (characters) ->
      console.log characters
      done()
