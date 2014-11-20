Tactics Core
============

Data structures that make up the core of Tactis Game.

    {applyStylesheet} = require "util"

    Threesome = require "./lib/threesome"

    module.exports =
      Character: require "./character"
      Name: require "./names"
      Loader: require "./data_loader"
      init: (options={}) ->
        applyStylesheet require("./style", "tactics-core")

        Threesome(options)

    if PACKAGE.name is "ROOT"
      module.exports.init
        data: {}
        update: ->
        click: (results) ->
          if results[0]
            {object} = results[0]

            object.material.color.setRGB rand(), rand(), rand()
