Character
=========

    require "./lib/extensions"
    require "cornerstone"

Those little guys that run around.

    {sqrt, min, max} = Math

    module.exports = (I={}, self=Core(I)) ->
      defaults I,
        abilities: [
          "Move"
          "Melee"
        ]
        actions: 2
        alive: true
        cooldowns: {}
        effects: []
        health: 3
        healthMax: 3
        movement: 4
        name: "Duder"
        passives: []
        physicalAwareness: sqrt(2)
        position:
          x: 0
          y: 0
        sight: 7
        strength: 1
        stun: 0

      self.include Model

      self.attrAccessor(
        "abilities"
        "alive"
        "cooldowns"
        "debugPositions"
        "movement"
        "name"
        "physicalAwareness"
      )

      ensureNumber = (value) ->
        result = parseFloat(value)

        throw "Invalid number" if isNaN result

        return result

      [
        "actions"
        "health"
        "healthMax"
        "movement"
        "sight"
        "strength"
      ].forEach (name) ->
        self.attrData name, ensureNumber

      self.attrData "position", Point

      effectModifiable = (names...) ->
        names.forEach (name) ->
          method = self[name]

          self[name] = (args...) ->
            if args.length > 0
              method(args...)
            else
              method() + self.mods(name)

      effectModifiable(
        "sight"
        "strength"
      )

      self.extend
        damage: (amount, type) ->
          damageTotal = self.modifiedDamage(amount, type)

          I.health -= damageTotal

        dead: ->
          !self.alive()

        heal: (amount) ->
          I.health += amount

        cooldown: (ability) ->
          I.cooldowns[ability.name()] or 0

        setCooldown: (ability) ->
          I.cooldowns[ability.name()] = ability.cooldown()


        addEffect: (effect) ->
          I.effects.push effect

Sums up the modifications for an attribute from all the effects.

        mods: (attribute) ->
          I.effects.reduce (total, effect) ->
            if effect.attribute is attribute
              total + effect.amount
            else
              total
          , 0

        modifiedDamage: (amount, type="Physical") ->
          if self.immune(type)
            return 0

          # Resistances
          amount = (amount * (1 - self.resistance(type))).clamp(0, amount)

          return amount

        resistance: (type) ->
          I.effects.filter (effect) ->
            effect.type is type and effect.resistance
          .reduce (total, effect) ->
            total + effect.resistance
          , 0

        immune: (type) ->
          self.immunities().include(type)

        immunities: (type) ->
          self.passives().map (passive) ->
            passive.immune
          .compact()

        stateBasedActions: ->
          return if !I.alive

          # Clear expired effects
          I.effects = I.effects.filter (effect) ->
            effect.duration > 0

          # Cap health
          if I.health > I.healthMax
            I.health = I.healthMax

          # TODO: Move into a state based effect?
          if I.health <= 0
            # Died
            I.alive = false
            I.actions = 0

          # Clamping actions and cooldowns
          Object.keys(I.cooldowns).forEach (name) ->
            if I.cooldowns[name] < 0
              I.cooldowns[name] = 0

          if I.stun < 0
            I.stun = 0

          return

        stun: (stun) ->
          I.stun = Math.max(I.stun, stun)
          I.actions = 0

        stunned: ->
          I.stun > 0

        aware: () ->
          self.alive() and !self.stunned()

Effects to occur when this character enters a tile.

        enterEffects: ->
          self.passives().map (passive) ->
            passive.enter
          .compact()

        visionEffects: ->
          self.passives().map (passive) ->
            passive.visionEffect
          .compact()

        physicalAwareness: ->
          if !self.aware()
            0
          else
            I.physicalAwareness + self.mods(name)

        targettingAbility: Observable()
        resetTargetting: ->
          self.targettingAbility null

Ready is called at the beginning of each turn. It resets the actions and processes
any status effects.

        ready: ->
          I.stun -= 1 if I.stun > 0

          Object.keys(I.cooldowns).forEach (name) ->
            I.cooldowns[name] -= 1

          I.effects.forEach (effect) ->
            # TODO: Migrate into CharacterEffect class
            effect.update?(self)
            effect.duration -= 1

          if I.stun is 0
            I.actions = 2
          else
            I.actions = 0

        passives: ->
          I.passives.map (name) ->
            if passive = Passive.Passives[name]
              passive
            else
              console.warn "Undefined Passive: '#{name}'"
          .compact()

        visionType: ->
          type = self.passives().reduce (memo, passive) ->
            memo or passive.visionType
          , undefined

          type or "sight"

      return self

    dataTransform = (data) ->
      Object.extend data,
        healthMax: data.healthmax
        abilities: data.abilities.split(',')
        passives: (data.passives ? "").split(',')
        spriteName: data.sprite

      delete data.healthmax
      delete data.sprite

      return data

    module.exports.dataFromRemote = (data) ->
      results = {}
      data.forEach (datum) ->
        results[datum.name] = dataTransform(datum)

      return results
