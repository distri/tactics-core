Data Loader
===========

    Spreadsheet = require "spreadsheet"
    sheetData = null

    loader = null
    get = ->
      return loader if loader

      loader = Spreadsheet.load("0ArtCBkZR37MmdFJqbjloVEp1OFZLWDJ6M29OcXQ1WkE")

      return loader

    groupBy = (array, attribute) ->
      array.reduce (grouping, value) ->
        grouping[value[attribute]] ?= []

        grouping[value[attribute]].push value

        return grouping
      , {}

    module.exports =
      characters: ->
        get().then (data) ->
          characterFromRemote(data.Characters)
      names: ->
        get().then (data) ->
          names = data.Names.map (row) ->
            name: row.name.trim()
            gender: row.gender.trim()
            culture: row.culture.trim()

          cultures = groupBy(names, "culture")

          Object.keys(cultures).forEach (culture) ->
            cultures[culture] = groupBy(cultures[culture], "gender")
          , cultures

          return cultures

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
