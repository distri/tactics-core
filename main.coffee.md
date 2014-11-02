Tactics Core
============

Data structures that make up the core of Tactis Game.

    {applyStylesheet} = require "util"

    Threesome = require "./lib/threesome"

    module.exports =
      Character: require "./character"
      Name: require "./names"

      init: (data, update) ->
        applyStylesheet require("./style")

        Threesome.init(data, update)
