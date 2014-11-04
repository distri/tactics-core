Data Loader
===========

    Spreadsheet = require "spreadsheet"
    sheetData = null

    loader = null
    get = ->
      return loader if loader

      loader = Spreadsheet.load("0ArtCBkZR37MmdFJqbjloVEp1OFZLWDJ6M29OcXQ1WkE")

      return loader

    module.exports =
      characters: ->
        get().then (data) ->
          characterFromRemote(data.characters)
      names: ->
        get().then (data) ->
          data.names.map (row) ->
            name: row.name.trim()
            gender: row.gender.trim()
            culture: row.culture.trim()
      get: get

    characterDataTransform = (data) ->
      extend data,
        healthMax: data.healthmax
        abilities: data.abilities.split(',')
        passives: (data.passives ? "").split(',')
        spriteName: data.sprite

      delete data.healthmax
      delete data.sprite

      return data

    characterFromRemote = (data) ->
      console.log data
      results = {}
      data.forEach (datum) ->
        results[datum.name] = characterDataTransform(datum)

      return results
