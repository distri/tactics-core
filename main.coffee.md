Tactics Core
============

Data structures that make up the core of Tactis Game.

    {applyStylesheet} = require "util"

    module.exports =
      Character: require "./character"
      Name: require "./names"
      Engine: require "./lib/engine"
      init: ->
        applyStylesheet require("./style")
