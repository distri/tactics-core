Engine
======
 
    require "cornerstone"

    module.exports = (I={}, self={}) ->
      defaults I,
        dt: 1/60
        t: 0
        paused: false
        running: false

      step = ->
        unless I.paused
          self.update?(I.t, I.dt)
          I.t += I.dt

        self.render?(I.t, I.dt)

      animLoop = (timestamp) ->
        step()

        if I.running
          window.requestAnimationFrame(animLoop)

      if I.running
        window.requestAnimationFrame(animLoop)

      extend self,
        start: ->
          unless I.running
            I.running = true
            animLoop()

        stop: ->
          I.running = false
