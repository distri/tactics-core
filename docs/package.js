(function(pkg) {
  (function() {
  var annotateSourceURL, cacheFor, circularGuard, defaultEntryPoint, fileSeparator, generateRequireFn, global, isPackage, loadModule, loadPackage, loadPath, normalizePath, rootModule, startsWith,
    __slice = [].slice;

  fileSeparator = '/';

  global = window;

  defaultEntryPoint = "main";

  circularGuard = {};

  rootModule = {
    path: ""
  };

  loadPath = function(parentModule, pkg, path) {
    var cache, localPath, module, normalizedPath;
    if (startsWith(path, '/')) {
      localPath = [];
    } else {
      localPath = parentModule.path.split(fileSeparator);
    }
    normalizedPath = normalizePath(path, localPath);
    cache = cacheFor(pkg);
    if (module = cache[normalizedPath]) {
      if (module === circularGuard) {
        throw "Circular dependency detected when requiring " + normalizedPath;
      }
    } else {
      cache[normalizedPath] = circularGuard;
      try {
        cache[normalizedPath] = module = loadModule(pkg, normalizedPath);
      } finally {
        if (cache[normalizedPath] === circularGuard) {
          delete cache[normalizedPath];
        }
      }
    }
    return module.exports;
  };

  normalizePath = function(path, base) {
    var piece, result;
    if (base == null) {
      base = [];
    }
    base = base.concat(path.split(fileSeparator));
    result = [];
    while (base.length) {
      switch (piece = base.shift()) {
        case "..":
          result.pop();
          break;
        case "":
        case ".":
          break;
        default:
          result.push(piece);
      }
    }
    return result.join(fileSeparator);
  };

  loadPackage = function(pkg) {
    var path;
    path = pkg.entryPoint || defaultEntryPoint;
    return loadPath(rootModule, pkg, path);
  };

  loadModule = function(pkg, path) {
    var args, context, dirname, file, module, program, values;
    if (!(file = pkg.distribution[path])) {
      throw "Could not find file at " + path + " in " + pkg.name;
    }
    program = annotateSourceURL(file.content, pkg, path);
    dirname = path.split(fileSeparator).slice(0, -1).join(fileSeparator);
    module = {
      path: dirname,
      exports: {}
    };
    context = {
      require: generateRequireFn(pkg, module),
      global: global,
      module: module,
      exports: module.exports,
      PACKAGE: pkg,
      __filename: path,
      __dirname: dirname
    };
    args = Object.keys(context);
    values = args.map(function(name) {
      return context[name];
    });
    Function.apply(null, __slice.call(args).concat([program])).apply(module, values);
    return module;
  };

  isPackage = function(path) {
    if (!(startsWith(path, fileSeparator) || startsWith(path, "." + fileSeparator) || startsWith(path, ".." + fileSeparator))) {
      return path.split(fileSeparator)[0];
    } else {
      return false;
    }
  };

  generateRequireFn = function(pkg, module) {
    if (module == null) {
      module = rootModule;
    }
    if (pkg.name == null) {
      pkg.name = "ROOT";
    }
    if (pkg.scopedName == null) {
      pkg.scopedName = "ROOT";
    }
    return function(path) {
      var otherPackage;
      if (isPackage(path)) {
        if (!(otherPackage = pkg.dependencies[path])) {
          throw "Package: " + path + " not found.";
        }
        if (otherPackage.name == null) {
          otherPackage.name = path;
        }
        if (otherPackage.scopedName == null) {
          otherPackage.scopedName = "" + pkg.scopedName + ":" + path;
        }
        return loadPackage(otherPackage);
      } else {
        return loadPath(module, pkg, path);
      }
    };
  };

  if (typeof exports !== "undefined" && exports !== null) {
    exports.generateFor = generateRequireFn;
  } else {
    global.Require = {
      generateFor: generateRequireFn
    };
  }

  startsWith = function(string, prefix) {
    return string.lastIndexOf(prefix, 0) === 0;
  };

  cacheFor = function(pkg) {
    if (pkg.cache) {
      return pkg.cache;
    }
    Object.defineProperty(pkg, "cache", {
      value: {}
    });
    return pkg.cache;
  };

  annotateSourceURL = function(program, pkg, path) {
    return "" + program + "\n//# sourceURL=" + pkg.scopedName + "/" + path;
  };

}).call(this);

//# sourceURL=main.coffee
  window.require = Require.generateFor(pkg);
})({
  "source": {
    "LICENSE": {
      "path": "LICENSE",
      "content": "The MIT License (MIT)\n\nCopyright (c) 2014 \n\nPermission is hereby granted, free of charge, to any person obtaining a copy\nof this software and associated documentation files (the \"Software\"), to deal\nin the Software without restriction, including without limitation the rights\nto use, copy, modify, merge, publish, distribute, sublicense, and/or sell\ncopies of the Software, and to permit persons to whom the Software is\nfurnished to do so, subject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\nFITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\nAUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\nLIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\nOUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE\nSOFTWARE.\n\n",
      "mode": "100644",
      "type": "blob"
    },
    "README.md": {
      "path": "README.md",
      "content": "tactics-core\n============\n\nData models for the tactics game\n",
      "mode": "100644",
      "type": "blob"
    },
    "character.coffee.md": {
      "path": "character.coffee.md",
      "content": "Character\n=========\n\n    require \"./lib/extensions\"\n    require \"cornerstone\"\n\nThose little guys that run around.\n\n    {sqrt, min, max} = Math\n\n    module.exports = (I={}, self=Core(I)) ->\n      defaults I,\n        abilities: [\n          \"Move\"\n          \"Melee\"\n        ]\n        actions: 2\n        alive: true\n        cooldowns: {}\n        effects: []\n        health: 3\n        healthMax: 3\n        movement: 4\n        name: \"Duder\"\n        passives: []\n        physicalAwareness: sqrt(2)\n        position:\n          x: 0\n          y: 0\n        sight: 7\n        strength: 1\n        stun: 0\n        type: \"Grunt\"\n\n      self.include Model\n\n      self.attrAccessor(\n        \"abilities\"\n        \"actions\"\n        \"alive\"\n        \"cooldowns\"\n        \"debugPositions\"\n        \"health\"\n        \"healthMax\"\n        \"movement\"\n        \"name\"\n        \"physicalAwareness\"\n        \"sight\"\n        \"strength\"\n        \"type\"\n      )\n\n      self.attrData \"position\", Point\n\n      effectModifiable = (names...) ->\n        names.forEach (name) ->\n          method = self[name]\n\n          self[name] = (args...) ->\n            if args.length > 0\n              method(args...)\n            else\n              method() + self.mods(name)\n\n      effectModifiable(\n        \"sight\"\n        \"strength\"\n      )\n\n      self.extend\n        damage: (amount, type) ->\n          damageTotal = self.modifiedDamage(amount, type)\n\n          I.health -= damageTotal\n\n        dead: ->\n          !self.alive()\n\n        heal: (amount) ->\n          I.health += amount\n\n        cooldown: (ability) ->\n          I.cooldowns[ability.name()] or 0\n\n        setCooldown: (ability) ->\n          I.cooldowns[ability.name()] = ability.cooldown()\n\n\n        addEffect: (effect) ->\n          I.effects.push effect\n\nSums up the modifications for an attribute from all the effects.\n\n        mods: (attribute) ->\n          I.effects.reduce (total, effect) ->\n            if effect.attribute is attribute\n              total + effect.amount\n            else\n              total\n          , 0\n\n        modifiedDamage: (amount, type=\"Physical\") ->\n          if self.immune(type)\n            return 0\n\n          # Resistances\n          amount = (amount * (1 - self.resistance(type))).clamp(0, amount)\n\n          return amount\n\n        resistance: (type) ->\n          I.effects.filter (effect) ->\n            effect.type is type and effect.resistance\n          .reduce (total, effect) ->\n            total + effect.resistance\n          , 0\n\n        immune: (type) ->\n          self.immunities().include(type)\n\n        immunities: (type) ->\n          self.passives().map (passive) ->\n            passive.immune\n          .compact()\n\n        stateBasedActions: ->\n          return if !I.alive\n\n          # Clear expired effects\n          I.effects = I.effects.filter (effect) ->\n            effect.duration > 0\n\n          # Cap health\n          if I.health > I.healthMax\n            I.health = I.healthMax\n\n          # TODO: Move into a state based effect?\n          if I.health <= 0\n            # Died\n            I.alive = false\n            I.actions = 0\n\n          # Clamping actions and cooldowns\n          Object.keys(I.cooldowns).forEach (name) ->\n            if I.cooldowns[name] < 0\n              I.cooldowns[name] = 0\n\n          if I.stun < 0\n            I.stun = 0\n\n          return\n\n        stun: (stun) ->\n          I.stun = Math.max(I.stun, stun)\n          I.actions = 0\n\n        stunned: ->\n          I.stun > 0\n\n        aware: () ->\n          self.alive() and !self.stunned()\n\nEffects to occur when this character enters a tile.\n\n        enterEffects: ->\n          self.passives().map (passive) ->\n            passive.enter\n          .compact()\n\n        visionEffects: ->\n          self.passives().map (passive) ->\n            passive.visionEffect\n          .compact()\n\n        physicalAwareness: ->\n          if !self.aware()\n            0\n          else\n            I.physicalAwareness + self.mods(name)\n\n        targettingAbility: Observable()\n        resetTargetting: ->\n          self.targettingAbility null\n\nReady is called at the beginning of each turn. It resets the actions and processes\nany status effects.\n\n        ready: ->\n          I.stun -= 1 if I.stun > 0\n\n          Object.keys(I.cooldowns).forEach (name) ->\n            I.cooldowns[name] -= 1\n\n          I.effects.forEach (effect) ->\n            # TODO: Migrate into CharacterEffect class\n            effect.update?(self)\n            effect.duration -= 1\n\n          if I.stun is 0\n            I.actions = 2\n          else\n            I.actions = 0\n\n        passives: ->\n          I.passives.map (name) ->\n            if passive = Passive.Passives[name]\n              passive\n            else\n              console.warn \"Undefined Passive: '#{name}'\"\n          .compact()\n\n        visionType: ->\n          type = self.passives().reduce (memo, passive) ->\n            memo or passive.visionType\n          , undefined\n\n          type or \"sight\"\n\n      return self\n\n    dataTransform = (data) ->\n      Object.extend data,\n        healthMax: data.healthmax\n        abilities: data.abilities.split(',')\n        passives: (data.passives ? \"\").split(',')\n        spriteName: data.sprite\n\n      # TODO: May want to move these into the class constructor\n      #\n      [\n        \"actions\"\n        \"healthMax\"\n        \"movement\"\n        \"sight\"\n      ].forEach (name) ->\n        data[name] = parseFloat(data[name])\n\n      delete data.healthmax\n      delete data.sprite\n\n      return data\n\n    module.exports.dataFromRemote = (data) ->\n      results = {}\n      data.forEach (datum) ->\n        results[datum.name] = dataTransform(datum)\n\n      return results\n",
      "mode": "100644",
      "type": "blob"
    },
    "lib/extensions.coffee.md": {
      "path": "lib/extensions.coffee.md",
      "content": "Extensions\n==========\n\n    require \"cornerstone\"\n\nTemporary home for extending cornerstone builtins.\n\n    extend global,\n\nAdding an attrData method to the Model module.\n\n      Model: do (oldModel=Model) ->\n        (I, self) ->\n          self = oldModel(I, self)\n\n          extend self,\n\n`attrData` models an attribute as a data object. For example if our object has\na position attribute with x and y values we can do\n\n>     self.attrData(\"position\", Point)\n\nto promote the raw data into a Point data model available through a public\nmethod named position.\n\n            attrData: (name, DataModel) ->\n              I[name] = DataModel(I[name])\n\n              self[name] = (newValue) ->\n                if arguments.length > 0\n                  I[name] = DataModel(newValue)\n                else\n                  I[name]\n\n          return self\n",
      "mode": "100644",
      "type": "blob"
    },
    "pixie.cson": {
      "path": "pixie.cson",
      "content": "version: \"0.1.0\"\ndependencies:\n  cornerstone: \"distri/cornerstone:v0.2.4\"\n",
      "mode": "100644",
      "type": "blob"
    },
    "test/character.coffee": {
      "path": "test/character.coffee",
      "content": "Character = require \"../character\"\n\ndescribe \"Character\", ->\n  character = Character()\n\n  it \"should have health\", ->\n    assert character.health()\n\n  it \"should have actions\", ->\n    assert character.actions()\n\n  it \"should serialize position to JSON\", ->\n    character.position Point(5, 2)\n\n    assert character.I.position\n    assert.equal character.I.position.x, 5\n\n    assert.equal character.toJSON().position.x, 5\n\n  it \"should process state based actions\", ->\n    character.stateBasedActions()\n\n  it \"should be able to have stats modified by effects\", ->\n    assert.equal character.mods(\"strength\"), 0\n\n    character.addEffect\n      attribute: \"strength\"\n      amount: -3\n\n    assert.equal character.mods(\"strength\"), -3\n\n  it \"effects should be able to provide damage immunity\", ->\n    character.addEffect\n      resistance: 1\n      type: \"Fire\"\n\n    assert.equal character.modifiedDamage(999, \"Fire\"), 0\n\n  it \"should die when taking a boatload of damage\", ->\n    boatload = 999\n\n    character.damage boatload\n    character.stateBasedActions()\n\n    assert character.dead()\n",
      "mode": "100644",
      "type": "blob"
    }
  },
  "distribution": {
    "character": {
      "path": "character",
      "content": "(function() {\n  var dataTransform, max, min, sqrt,\n    __slice = [].slice;\n\n  require(\"./lib/extensions\");\n\n  require(\"cornerstone\");\n\n  sqrt = Math.sqrt, min = Math.min, max = Math.max;\n\n  module.exports = function(I, self) {\n    var effectModifiable;\n    if (I == null) {\n      I = {};\n    }\n    if (self == null) {\n      self = Core(I);\n    }\n    defaults(I, {\n      abilities: [\"Move\", \"Melee\"],\n      actions: 2,\n      alive: true,\n      cooldowns: {},\n      effects: [],\n      health: 3,\n      healthMax: 3,\n      movement: 4,\n      name: \"Duder\",\n      passives: [],\n      physicalAwareness: sqrt(2),\n      position: {\n        x: 0,\n        y: 0\n      },\n      sight: 7,\n      strength: 1,\n      stun: 0,\n      type: \"Grunt\"\n    });\n    self.include(Model);\n    self.attrAccessor(\"abilities\", \"actions\", \"alive\", \"cooldowns\", \"debugPositions\", \"health\", \"healthMax\", \"movement\", \"name\", \"physicalAwareness\", \"sight\", \"strength\", \"type\");\n    self.attrData(\"position\", Point);\n    effectModifiable = function() {\n      var names;\n      names = 1 <= arguments.length ? __slice.call(arguments, 0) : [];\n      return names.forEach(function(name) {\n        var method;\n        method = self[name];\n        return self[name] = function() {\n          var args;\n          args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];\n          if (args.length > 0) {\n            return method.apply(null, args);\n          } else {\n            return method() + self.mods(name);\n          }\n        };\n      });\n    };\n    effectModifiable(\"sight\", \"strength\");\n    self.extend({\n      damage: function(amount, type) {\n        var damageTotal;\n        damageTotal = self.modifiedDamage(amount, type);\n        return I.health -= damageTotal;\n      },\n      dead: function() {\n        return !self.alive();\n      },\n      heal: function(amount) {\n        return I.health += amount;\n      },\n      cooldown: function(ability) {\n        return I.cooldowns[ability.name()] || 0;\n      },\n      setCooldown: function(ability) {\n        return I.cooldowns[ability.name()] = ability.cooldown();\n      },\n      addEffect: function(effect) {\n        return I.effects.push(effect);\n      },\n      mods: function(attribute) {\n        return I.effects.reduce(function(total, effect) {\n          if (effect.attribute === attribute) {\n            return total + effect.amount;\n          } else {\n            return total;\n          }\n        }, 0);\n      },\n      modifiedDamage: function(amount, type) {\n        if (type == null) {\n          type = \"Physical\";\n        }\n        if (self.immune(type)) {\n          return 0;\n        }\n        amount = (amount * (1 - self.resistance(type))).clamp(0, amount);\n        return amount;\n      },\n      resistance: function(type) {\n        return I.effects.filter(function(effect) {\n          return effect.type === type && effect.resistance;\n        }).reduce(function(total, effect) {\n          return total + effect.resistance;\n        }, 0);\n      },\n      immune: function(type) {\n        return self.immunities().include(type);\n      },\n      immunities: function(type) {\n        return self.passives().map(function(passive) {\n          return passive.immune;\n        }).compact();\n      },\n      stateBasedActions: function() {\n        if (!I.alive) {\n          return;\n        }\n        I.effects = I.effects.filter(function(effect) {\n          return effect.duration > 0;\n        });\n        if (I.health > I.healthMax) {\n          I.health = I.healthMax;\n        }\n        if (I.health <= 0) {\n          I.alive = false;\n          I.actions = 0;\n        }\n        Object.keys(I.cooldowns).forEach(function(name) {\n          if (I.cooldowns[name] < 0) {\n            return I.cooldowns[name] = 0;\n          }\n        });\n        if (I.stun < 0) {\n          I.stun = 0;\n        }\n      },\n      stun: function(stun) {\n        I.stun = Math.max(I.stun, stun);\n        return I.actions = 0;\n      },\n      stunned: function() {\n        return I.stun > 0;\n      },\n      aware: function() {\n        return self.alive() && !self.stunned();\n      },\n      enterEffects: function() {\n        return self.passives().map(function(passive) {\n          return passive.enter;\n        }).compact();\n      },\n      visionEffects: function() {\n        return self.passives().map(function(passive) {\n          return passive.visionEffect;\n        }).compact();\n      },\n      physicalAwareness: function() {\n        if (!self.aware()) {\n          return 0;\n        } else {\n          return I.physicalAwareness + self.mods(name);\n        }\n      },\n      targettingAbility: Observable(),\n      resetTargetting: function() {\n        return self.targettingAbility(null);\n      },\n      ready: function() {\n        if (I.stun > 0) {\n          I.stun -= 1;\n        }\n        Object.keys(I.cooldowns).forEach(function(name) {\n          return I.cooldowns[name] -= 1;\n        });\n        I.effects.forEach(function(effect) {\n          if (typeof effect.update === \"function\") {\n            effect.update(self);\n          }\n          return effect.duration -= 1;\n        });\n        if (I.stun === 0) {\n          return I.actions = 2;\n        } else {\n          return I.actions = 0;\n        }\n      },\n      passives: function() {\n        return I.passives.map(function(name) {\n          var passive;\n          if (passive = Passive.Passives[name]) {\n            return passive;\n          } else {\n            return console.warn(\"Undefined Passive: '\" + name + \"'\");\n          }\n        }).compact();\n      },\n      visionType: function() {\n        var type;\n        type = self.passives().reduce(function(memo, passive) {\n          return memo || passive.visionType;\n        }, void 0);\n        return type || \"sight\";\n      }\n    });\n    return self;\n  };\n\n  dataTransform = function(data) {\n    var _ref;\n    Object.extend(data, {\n      healthMax: data.healthmax,\n      abilities: data.abilities.split(','),\n      passives: ((_ref = data.passives) != null ? _ref : \"\").split(','),\n      spriteName: data.sprite\n    });\n    [\"actions\", \"healthMax\", \"movement\", \"sight\"].forEach(function(name) {\n      return data[name] = parseFloat(data[name]);\n    });\n    delete data.healthmax;\n    delete data.sprite;\n    return data;\n  };\n\n  module.exports.dataFromRemote = function(data) {\n    var results;\n    results = {};\n    data.forEach(function(datum) {\n      return results[datum.name] = dataTransform(datum);\n    });\n    return results;\n  };\n\n}).call(this);\n",
      "type": "blob"
    },
    "lib/extensions": {
      "path": "lib/extensions",
      "content": "(function() {\n  require(\"cornerstone\");\n\n  extend(global, {\n    Model: (function(oldModel) {\n      return function(I, self) {\n        self = oldModel(I, self);\n        extend(self, {\n          attrData: function(name, DataModel) {\n            I[name] = DataModel(I[name]);\n            return self[name] = function(newValue) {\n              if (arguments.length > 0) {\n                return I[name] = DataModel(newValue);\n              } else {\n                return I[name];\n              }\n            };\n          }\n        });\n        return self;\n      };\n    })(Model)\n  });\n\n}).call(this);\n",
      "type": "blob"
    },
    "pixie": {
      "path": "pixie",
      "content": "module.exports = {\"version\":\"0.1.0\",\"dependencies\":{\"cornerstone\":\"distri/cornerstone:v0.2.4\"}};",
      "type": "blob"
    },
    "test/character": {
      "path": "test/character",
      "content": "(function() {\n  var Character;\n\n  Character = require(\"../character\");\n\n  describe(\"Character\", function() {\n    var character;\n    character = Character();\n    it(\"should have health\", function() {\n      return assert(character.health());\n    });\n    it(\"should have actions\", function() {\n      return assert(character.actions());\n    });\n    it(\"should serialize position to JSON\", function() {\n      character.position(Point(5, 2));\n      assert(character.I.position);\n      assert.equal(character.I.position.x, 5);\n      return assert.equal(character.toJSON().position.x, 5);\n    });\n    it(\"should process state based actions\", function() {\n      return character.stateBasedActions();\n    });\n    it(\"should be able to have stats modified by effects\", function() {\n      assert.equal(character.mods(\"strength\"), 0);\n      character.addEffect({\n        attribute: \"strength\",\n        amount: -3\n      });\n      return assert.equal(character.mods(\"strength\"), -3);\n    });\n    it(\"effects should be able to provide damage immunity\", function() {\n      character.addEffect({\n        resistance: 1,\n        type: \"Fire\"\n      });\n      return assert.equal(character.modifiedDamage(999, \"Fire\"), 0);\n    });\n    return it(\"should die when taking a boatload of damage\", function() {\n      var boatload;\n      boatload = 999;\n      character.damage(boatload);\n      character.stateBasedActions();\n      return assert(character.dead());\n    });\n  });\n\n}).call(this);\n",
      "type": "blob"
    }
  },
  "progenitor": {
    "url": "http://www.danielx.net/editor/"
  },
  "version": "0.1.0",
  "entryPoint": "main",
  "repository": {
    "branch": "master",
    "default_branch": "master",
    "full_name": "distri/tactics-core",
    "homepage": null,
    "description": "Data models for the tactics game",
    "html_url": "https://github.com/distri/tactics-core",
    "url": "https://api.github.com/repos/distri/tactics-core",
    "publishBranch": "gh-pages"
  },
  "dependencies": {
    "cornerstone": {
      "source": {
        "LICENSE": {
          "path": "LICENSE",
          "content": "The MIT License (MIT)\n\nCopyright (c) 2013 Daniel X Moore\n\nPermission is hereby granted, free of charge, to any person obtaining a copy of\nthis software and associated documentation files (the \"Software\"), to deal in\nthe Software without restriction, including without limitation the rights to\nuse, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of\nthe Software, and to permit persons to whom the Software is furnished to do so,\nsubject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS\nFOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR\nCOPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER\nIN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN\nCONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.\n",
          "mode": "100644",
          "type": "blob"
        },
        "README.md": {
          "path": "README.md",
          "content": "cornerstone\n===========\n\nCore JavaScript Extensions.\n",
          "mode": "100644",
          "type": "blob"
        },
        "cornerstone.coffee.md": {
          "path": "cornerstone.coffee.md",
          "content": "Cornerstone\n===========\n\nRequire and pollute.\n\n    require \"extensions\"\n\n    {extend, defaults} = require \"util\"\n\n    extend global,\n      Bindable: require \"bindable\"\n      Core: require \"core\"\n      defaults: defaults\n      extend: extend\n      Model: require \"model\"\n      Observable: require \"observable\"\n\n    require(\"math\").pollute()\n\n    require \"./point\"\n",
          "mode": "100644",
          "type": "blob"
        },
        "pixie.cson": {
          "path": "pixie.cson",
          "content": "version: \"0.2.4\"\nentryPoint: \"cornerstone\"\ndependencies:\n  bindable: \"distri/bindable:v0.1.0\"\n  core: \"distri/core:v0.6.0\"\n  extensions: \"distri/extensions:v0.2.0\"\n  math: \"distri/math:v0.2.0\"\n  model: \"distri/model:v0.1.3\"\n  observable: \"distri/observable:v0.3.1\"\n  util: \"distri/util:v0.1.0\"\n",
          "mode": "100644",
          "type": "blob"
        },
        "point.coffee.md": {
          "path": "point.coffee.md",
          "content": "Extend Point With Math Magic\n============================\n\n    [\n      \"abs\"\n      \"ceil\"\n      \"floor\"\n    ].forEach (method) ->\n      Point.prototype[method] = ->\n        Point(@x[method](), @y[method]())\n",
          "mode": "100644",
          "type": "blob"
        },
        "test/cornerstone.coffee": {
          "path": "test/cornerstone.coffee",
          "content": "require \"../cornerstone\"\n\ndescribe \"Cornerstone\", ->\n  it \"should provide Bindable\", ->\n    assert Bindable()\n\n  it \"should provide Core\", ->\n    assert Core()\n\n  it \"should provide Matrix\", ->\n    assert Matrix()\n\n  it \"should provide Model\", ->\n    assert Model()\n\n  it \"should provide Observable\", ->\n    assert Observable()\n\n  describe \"Point\", ->\n\n    it \"should provide Point\", ->\n      assert Point()\n\n    [\n      \"abs\"\n      \"ceil\"\n      \"floor\"\n    ].forEach (method) ->\n      it \"should have Point::#{method}\", ->\n        assert Point()[method]\n\n  it \"should provide Random\", ->\n    assert Random\n\n  it \"should provide rand\", ->\n    assert rand\n\n  it \"should provide Function#debounce\", ->\n    assert (->).debounce\n\n  it \"should provide extend\", ->\n    assert extend\n\n  it \"should provied defaults\", ->\n    assert defaults\n",
          "mode": "100644",
          "type": "blob"
        }
      },
      "distribution": {
        "cornerstone": {
          "path": "cornerstone",
          "content": "(function() {\n  var defaults, extend, _ref;\n\n  require(\"extensions\");\n\n  _ref = require(\"util\"), extend = _ref.extend, defaults = _ref.defaults;\n\n  extend(global, {\n    Bindable: require(\"bindable\"),\n    Core: require(\"core\"),\n    defaults: defaults,\n    extend: extend,\n    Model: require(\"model\"),\n    Observable: require(\"observable\")\n  });\n\n  require(\"math\").pollute();\n\n  require(\"./point\");\n\n}).call(this);\n",
          "type": "blob"
        },
        "pixie": {
          "path": "pixie",
          "content": "module.exports = {\"version\":\"0.2.4\",\"entryPoint\":\"cornerstone\",\"dependencies\":{\"bindable\":\"distri/bindable:v0.1.0\",\"core\":\"distri/core:v0.6.0\",\"extensions\":\"distri/extensions:v0.2.0\",\"math\":\"distri/math:v0.2.0\",\"model\":\"distri/model:v0.1.3\",\"observable\":\"distri/observable:v0.3.1\",\"util\":\"distri/util:v0.1.0\"}};",
          "type": "blob"
        },
        "point": {
          "path": "point",
          "content": "(function() {\n  [\"abs\", \"ceil\", \"floor\"].forEach(function(method) {\n    return Point.prototype[method] = function() {\n      return Point(this.x[method](), this.y[method]());\n    };\n  });\n\n}).call(this);\n",
          "type": "blob"
        },
        "test/cornerstone": {
          "path": "test/cornerstone",
          "content": "(function() {\n  require(\"../cornerstone\");\n\n  describe(\"Cornerstone\", function() {\n    it(\"should provide Bindable\", function() {\n      return assert(Bindable());\n    });\n    it(\"should provide Core\", function() {\n      return assert(Core());\n    });\n    it(\"should provide Matrix\", function() {\n      return assert(Matrix());\n    });\n    it(\"should provide Model\", function() {\n      return assert(Model());\n    });\n    it(\"should provide Observable\", function() {\n      return assert(Observable());\n    });\n    describe(\"Point\", function() {\n      it(\"should provide Point\", function() {\n        return assert(Point());\n      });\n      return [\"abs\", \"ceil\", \"floor\"].forEach(function(method) {\n        return it(\"should have Point::\" + method, function() {\n          return assert(Point()[method]);\n        });\n      });\n    });\n    it(\"should provide Random\", function() {\n      return assert(Random);\n    });\n    it(\"should provide rand\", function() {\n      return assert(rand);\n    });\n    it(\"should provide Function#debounce\", function() {\n      return assert((function() {}).debounce);\n    });\n    it(\"should provide extend\", function() {\n      return assert(extend);\n    });\n    return it(\"should provied defaults\", function() {\n      return assert(defaults);\n    });\n  });\n\n}).call(this);\n",
          "type": "blob"
        }
      },
      "progenitor": {
        "url": "http://www.danielx.net/editor/"
      },
      "version": "0.2.4",
      "entryPoint": "cornerstone",
      "repository": {
        "branch": "v0.2.4",
        "default_branch": "master",
        "full_name": "distri/cornerstone",
        "homepage": null,
        "description": "Core JavaScript Extensions.",
        "html_url": "https://github.com/distri/cornerstone",
        "url": "https://api.github.com/repos/distri/cornerstone",
        "publishBranch": "gh-pages"
      },
      "dependencies": {
        "bindable": {
          "source": {
            "LICENSE": {
              "path": "LICENSE",
              "mode": "100644",
              "content": "The MIT License (MIT)\n\nCopyright (c) 2014 distri\n\nPermission is hereby granted, free of charge, to any person obtaining a copy of\nthis software and associated documentation files (the \"Software\"), to deal in\nthe Software without restriction, including without limitation the rights to\nuse, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of\nthe Software, and to permit persons to whom the Software is furnished to do so,\nsubject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS\nFOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR\nCOPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER\nIN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN\nCONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.\n",
              "type": "blob"
            },
            "README.coffee.md": {
              "path": "README.coffee.md",
              "mode": "100644",
              "content": "Bindable\n========\n\n    Core = require \"core\"\n\nAdd event binding to objects.\n\n>     bindable = Bindable()\n>     bindable.on \"greet\", ->\n>       console.log \"yo!\"\n>     bindable.trigger \"greet\"\n>     #=> \"yo!\" is printed to log\n\nUse as a mixin.\n\n>    self.include Bindable\n\n    module.exports = (I={}, self=Core(I)) ->\n      eventCallbacks = {}\n\n      self.extend\n\nAdds a function as an event listener.\n\nThis will call `coolEventHandler` after `yourObject.trigger \"someCustomEvent\"`\nis called.\n\n>     yourObject.on \"someCustomEvent\", coolEventHandler\n\nHandlers can be attached to namespaces as well. The namespaces are only used\nfor finer control of targeting event removal. For example if you are making a\ncustom drawing system you could unbind `\".Drawable\"` events and add your own.\n\n>     yourObject.on \"\"\n\n        on: (namespacedEvent, callback) ->\n          [event, namespace] = namespacedEvent.split(\".\")\n\n          # HACK: Here we annotate the callback function with namespace metadata\n          # This will probably lead to some strange edge cases, but should work fine\n          # for simple cases.\n          if namespace\n            callback.__PIXIE ||= {}\n            callback.__PIXIE[namespace] = true\n\n          eventCallbacks[event] ||= []\n          eventCallbacks[event].push(callback)\n\n          return self\n\nRemoves a specific event listener, or all event listeners if\nno specific listener is given.\n\nRemoves the handler coolEventHandler from the event `\"someCustomEvent\"` while\nleaving the other events intact.\n\n>     yourObject.off \"someCustomEvent\", coolEventHandler\n\nRemoves all handlers attached to `\"anotherCustomEvent\"`\n\n>     yourObject.off \"anotherCustomEvent\"\n\nRemove all handlers from the `\".Drawable\" namespace`\n\n>     yourObject.off \".Drawable\"\n\n        off: (namespacedEvent, callback) ->\n          [event, namespace] = namespacedEvent.split(\".\")\n\n          if event\n            eventCallbacks[event] ||= []\n\n            if namespace\n              # Select only the callbacks that do not have this namespace metadata\n              eventCallbacks[event] = eventCallbacks.filter (callback) ->\n                !callback.__PIXIE?[namespace]?\n\n            else\n              if callback\n                remove eventCallbacks[event], callback\n              else\n                eventCallbacks[event] = []\n          else if namespace\n            # No event given\n            # Select only the callbacks that do not have this namespace metadata\n            # for any events bound\n            for key, callbacks of eventCallbacks\n              eventCallbacks[key] = callbacks.filter (callback) ->\n                !callback.__PIXIE?[namespace]?\n\n          return self\n\nCalls all listeners attached to the specified event.\n\n>     # calls each event handler bound to \"someCustomEvent\"\n>     yourObject.trigger \"someCustomEvent\"\n\nAdditional parameters can be passed to the handlers.\n\n>     yourObject.trigger \"someEvent\", \"hello\", \"anotherParameter\"\n\n        trigger: (event, parameters...) ->\n          callbacks = eventCallbacks[event]\n\n          if callbacks\n            callbacks.forEach (callback) ->\n              callback.apply(self, parameters)\n\n          return self\n\nLegacy method aliases.\n\n      self.extend\n        bind: self.on\n        unbind: self.off\n\nHelpers\n-------\n\nRemove a value from an array.\n\n    remove = (array, value) ->\n      index = array.indexOf(value)\n\n      if index >= 0\n        array.splice(index, 1)[0]\n",
              "type": "blob"
            },
            "pixie.cson": {
              "path": "pixie.cson",
              "mode": "100644",
              "content": "entryPoint: \"README\"\nversion: \"0.1.0\"\ndependencies:\n  core: \"distri/core:v0.6.0\"\n",
              "type": "blob"
            },
            "test/bindable.coffee": {
              "path": "test/bindable.coffee",
              "mode": "100644",
              "content": "test = it\nok = assert\nequal = assert.equal\n\nBindable = require \"../README\"\n\ndescribe \"Bindable\", ->\n\n  test \"#bind and #trigger\", ->\n    o = Bindable()\n\n    o.bind(\"test\", -> ok true)\n\n    o.trigger(\"test\")\n\n  test \"Multiple bindings\", ->\n    o = Bindable()\n\n    o.bind(\"test\", -> ok true)\n    o.bind(\"test\", -> ok true)\n\n    o.trigger(\"test\")\n\n  test \"#trigger arguments\", ->\n    o = Bindable()\n\n    param1 = \"the message\"\n    param2 = 3\n\n    o.bind \"test\", (p1, p2) ->\n      equal(p1, param1)\n      equal(p2, param2)\n\n    o.trigger \"test\", param1, param2\n\n  test \"#unbind\", ->\n    o = Bindable()\n\n    callback = ->\n      ok false\n\n    o.bind \"test\", callback\n    # Unbind specific event\n    o.unbind \"test\", callback\n    o.trigger \"test\"\n\n    o.bind \"test\", callback\n    # Unbind all events\n    o.unbind \"test\"\n    o.trigger \"test\"\n\n  test \"#trigger namespace\", ->\n    o = Bindable()\n    o.bind \"test.TestNamespace\", ->\n      ok true\n\n    o.trigger \"test\"\n\n    o.unbind \".TestNamespace\"\n    o.trigger \"test\"\n\n  test \"#unbind namespaced\", ->\n    o = Bindable()\n\n    o.bind \"test.TestNamespace\", ->\n      ok true\n\n    o.trigger \"test\"\n\n    o.unbind \".TestNamespace\", ->\n    o.trigger \"test\"\n",
              "type": "blob"
            }
          },
          "distribution": {
            "README": {
              "path": "README",
              "content": "(function() {\n  var Core, remove,\n    __slice = [].slice;\n\n  Core = require(\"core\");\n\n  module.exports = function(I, self) {\n    var eventCallbacks;\n    if (I == null) {\n      I = {};\n    }\n    if (self == null) {\n      self = Core(I);\n    }\n    eventCallbacks = {};\n    self.extend({\n      on: function(namespacedEvent, callback) {\n        var event, namespace, _ref;\n        _ref = namespacedEvent.split(\".\"), event = _ref[0], namespace = _ref[1];\n        if (namespace) {\n          callback.__PIXIE || (callback.__PIXIE = {});\n          callback.__PIXIE[namespace] = true;\n        }\n        eventCallbacks[event] || (eventCallbacks[event] = []);\n        eventCallbacks[event].push(callback);\n        return self;\n      },\n      off: function(namespacedEvent, callback) {\n        var callbacks, event, key, namespace, _ref;\n        _ref = namespacedEvent.split(\".\"), event = _ref[0], namespace = _ref[1];\n        if (event) {\n          eventCallbacks[event] || (eventCallbacks[event] = []);\n          if (namespace) {\n            eventCallbacks[event] = eventCallbacks.filter(function(callback) {\n              var _ref1;\n              return ((_ref1 = callback.__PIXIE) != null ? _ref1[namespace] : void 0) == null;\n            });\n          } else {\n            if (callback) {\n              remove(eventCallbacks[event], callback);\n            } else {\n              eventCallbacks[event] = [];\n            }\n          }\n        } else if (namespace) {\n          for (key in eventCallbacks) {\n            callbacks = eventCallbacks[key];\n            eventCallbacks[key] = callbacks.filter(function(callback) {\n              var _ref1;\n              return ((_ref1 = callback.__PIXIE) != null ? _ref1[namespace] : void 0) == null;\n            });\n          }\n        }\n        return self;\n      },\n      trigger: function() {\n        var callbacks, event, parameters;\n        event = arguments[0], parameters = 2 <= arguments.length ? __slice.call(arguments, 1) : [];\n        callbacks = eventCallbacks[event];\n        if (callbacks) {\n          callbacks.forEach(function(callback) {\n            return callback.apply(self, parameters);\n          });\n        }\n        return self;\n      }\n    });\n    return self.extend({\n      bind: self.on,\n      unbind: self.off\n    });\n  };\n\n  remove = function(array, value) {\n    var index;\n    index = array.indexOf(value);\n    if (index >= 0) {\n      return array.splice(index, 1)[0];\n    }\n  };\n\n}).call(this);\n\n//# sourceURL=README.coffee",
              "type": "blob"
            },
            "pixie": {
              "path": "pixie",
              "content": "module.exports = {\"entryPoint\":\"README\",\"version\":\"0.1.0\",\"dependencies\":{\"core\":\"distri/core:v0.6.0\"}};",
              "type": "blob"
            },
            "test/bindable": {
              "path": "test/bindable",
              "content": "(function() {\n  var Bindable, equal, ok, test;\n\n  test = it;\n\n  ok = assert;\n\n  equal = assert.equal;\n\n  Bindable = require(\"../README\");\n\n  describe(\"Bindable\", function() {\n    test(\"#bind and #trigger\", function() {\n      var o;\n      o = Bindable();\n      o.bind(\"test\", function() {\n        return ok(true);\n      });\n      return o.trigger(\"test\");\n    });\n    test(\"Multiple bindings\", function() {\n      var o;\n      o = Bindable();\n      o.bind(\"test\", function() {\n        return ok(true);\n      });\n      o.bind(\"test\", function() {\n        return ok(true);\n      });\n      return o.trigger(\"test\");\n    });\n    test(\"#trigger arguments\", function() {\n      var o, param1, param2;\n      o = Bindable();\n      param1 = \"the message\";\n      param2 = 3;\n      o.bind(\"test\", function(p1, p2) {\n        equal(p1, param1);\n        return equal(p2, param2);\n      });\n      return o.trigger(\"test\", param1, param2);\n    });\n    test(\"#unbind\", function() {\n      var callback, o;\n      o = Bindable();\n      callback = function() {\n        return ok(false);\n      };\n      o.bind(\"test\", callback);\n      o.unbind(\"test\", callback);\n      o.trigger(\"test\");\n      o.bind(\"test\", callback);\n      o.unbind(\"test\");\n      return o.trigger(\"test\");\n    });\n    test(\"#trigger namespace\", function() {\n      var o;\n      o = Bindable();\n      o.bind(\"test.TestNamespace\", function() {\n        return ok(true);\n      });\n      o.trigger(\"test\");\n      o.unbind(\".TestNamespace\");\n      return o.trigger(\"test\");\n    });\n    return test(\"#unbind namespaced\", function() {\n      var o;\n      o = Bindable();\n      o.bind(\"test.TestNamespace\", function() {\n        return ok(true);\n      });\n      o.trigger(\"test\");\n      o.unbind(\".TestNamespace\", function() {});\n      return o.trigger(\"test\");\n    });\n  });\n\n}).call(this);\n\n//# sourceURL=test/bindable.coffee",
              "type": "blob"
            }
          },
          "progenitor": {
            "url": "http://strd6.github.io/editor/"
          },
          "version": "0.1.0",
          "entryPoint": "README",
          "repository": {
            "id": 17189431,
            "name": "bindable",
            "full_name": "distri/bindable",
            "owner": {
              "login": "distri",
              "id": 6005125,
              "avatar_url": "https://identicons.github.com/f90c81ffc1498e260c820082f2e7ca5f.png",
              "gravatar_id": null,
              "url": "https://api.github.com/users/distri",
              "html_url": "https://github.com/distri",
              "followers_url": "https://api.github.com/users/distri/followers",
              "following_url": "https://api.github.com/users/distri/following{/other_user}",
              "gists_url": "https://api.github.com/users/distri/gists{/gist_id}",
              "starred_url": "https://api.github.com/users/distri/starred{/owner}{/repo}",
              "subscriptions_url": "https://api.github.com/users/distri/subscriptions",
              "organizations_url": "https://api.github.com/users/distri/orgs",
              "repos_url": "https://api.github.com/users/distri/repos",
              "events_url": "https://api.github.com/users/distri/events{/privacy}",
              "received_events_url": "https://api.github.com/users/distri/received_events",
              "type": "Organization",
              "site_admin": false
            },
            "private": false,
            "html_url": "https://github.com/distri/bindable",
            "description": "Event binding",
            "fork": false,
            "url": "https://api.github.com/repos/distri/bindable",
            "forks_url": "https://api.github.com/repos/distri/bindable/forks",
            "keys_url": "https://api.github.com/repos/distri/bindable/keys{/key_id}",
            "collaborators_url": "https://api.github.com/repos/distri/bindable/collaborators{/collaborator}",
            "teams_url": "https://api.github.com/repos/distri/bindable/teams",
            "hooks_url": "https://api.github.com/repos/distri/bindable/hooks",
            "issue_events_url": "https://api.github.com/repos/distri/bindable/issues/events{/number}",
            "events_url": "https://api.github.com/repos/distri/bindable/events",
            "assignees_url": "https://api.github.com/repos/distri/bindable/assignees{/user}",
            "branches_url": "https://api.github.com/repos/distri/bindable/branches{/branch}",
            "tags_url": "https://api.github.com/repos/distri/bindable/tags",
            "blobs_url": "https://api.github.com/repos/distri/bindable/git/blobs{/sha}",
            "git_tags_url": "https://api.github.com/repos/distri/bindable/git/tags{/sha}",
            "git_refs_url": "https://api.github.com/repos/distri/bindable/git/refs{/sha}",
            "trees_url": "https://api.github.com/repos/distri/bindable/git/trees{/sha}",
            "statuses_url": "https://api.github.com/repos/distri/bindable/statuses/{sha}",
            "languages_url": "https://api.github.com/repos/distri/bindable/languages",
            "stargazers_url": "https://api.github.com/repos/distri/bindable/stargazers",
            "contributors_url": "https://api.github.com/repos/distri/bindable/contributors",
            "subscribers_url": "https://api.github.com/repos/distri/bindable/subscribers",
            "subscription_url": "https://api.github.com/repos/distri/bindable/subscription",
            "commits_url": "https://api.github.com/repos/distri/bindable/commits{/sha}",
            "git_commits_url": "https://api.github.com/repos/distri/bindable/git/commits{/sha}",
            "comments_url": "https://api.github.com/repos/distri/bindable/comments{/number}",
            "issue_comment_url": "https://api.github.com/repos/distri/bindable/issues/comments/{number}",
            "contents_url": "https://api.github.com/repos/distri/bindable/contents/{+path}",
            "compare_url": "https://api.github.com/repos/distri/bindable/compare/{base}...{head}",
            "merges_url": "https://api.github.com/repos/distri/bindable/merges",
            "archive_url": "https://api.github.com/repos/distri/bindable/{archive_format}{/ref}",
            "downloads_url": "https://api.github.com/repos/distri/bindable/downloads",
            "issues_url": "https://api.github.com/repos/distri/bindable/issues{/number}",
            "pulls_url": "https://api.github.com/repos/distri/bindable/pulls{/number}",
            "milestones_url": "https://api.github.com/repos/distri/bindable/milestones{/number}",
            "notifications_url": "https://api.github.com/repos/distri/bindable/notifications{?since,all,participating}",
            "labels_url": "https://api.github.com/repos/distri/bindable/labels{/name}",
            "releases_url": "https://api.github.com/repos/distri/bindable/releases{/id}",
            "created_at": "2014-02-25T21:50:35Z",
            "updated_at": "2014-02-25T21:50:35Z",
            "pushed_at": "2014-02-25T21:50:35Z",
            "git_url": "git://github.com/distri/bindable.git",
            "ssh_url": "git@github.com:distri/bindable.git",
            "clone_url": "https://github.com/distri/bindable.git",
            "svn_url": "https://github.com/distri/bindable",
            "homepage": null,
            "size": 0,
            "stargazers_count": 0,
            "watchers_count": 0,
            "language": null,
            "has_issues": true,
            "has_downloads": true,
            "has_wiki": true,
            "forks_count": 0,
            "mirror_url": null,
            "open_issues_count": 0,
            "forks": 0,
            "open_issues": 0,
            "watchers": 0,
            "default_branch": "master",
            "master_branch": "master",
            "permissions": {
              "admin": true,
              "push": true,
              "pull": true
            },
            "organization": {
              "login": "distri",
              "id": 6005125,
              "avatar_url": "https://identicons.github.com/f90c81ffc1498e260c820082f2e7ca5f.png",
              "gravatar_id": null,
              "url": "https://api.github.com/users/distri",
              "html_url": "https://github.com/distri",
              "followers_url": "https://api.github.com/users/distri/followers",
              "following_url": "https://api.github.com/users/distri/following{/other_user}",
              "gists_url": "https://api.github.com/users/distri/gists{/gist_id}",
              "starred_url": "https://api.github.com/users/distri/starred{/owner}{/repo}",
              "subscriptions_url": "https://api.github.com/users/distri/subscriptions",
              "organizations_url": "https://api.github.com/users/distri/orgs",
              "repos_url": "https://api.github.com/users/distri/repos",
              "events_url": "https://api.github.com/users/distri/events{/privacy}",
              "received_events_url": "https://api.github.com/users/distri/received_events",
              "type": "Organization",
              "site_admin": false
            },
            "network_count": 0,
            "subscribers_count": 2,
            "branch": "v0.1.0",
            "defaultBranch": "master"
          },
          "dependencies": {
            "core": {
              "source": {
                "LICENSE": {
                  "path": "LICENSE",
                  "mode": "100644",
                  "content": "The MIT License (MIT)\n\nCopyright (c) 2013 Daniel X Moore\n\nPermission is hereby granted, free of charge, to any person obtaining a copy of\nthis software and associated documentation files (the \"Software\"), to deal in\nthe Software without restriction, including without limitation the rights to\nuse, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of\nthe Software, and to permit persons to whom the Software is furnished to do so,\nsubject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS\nFOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR\nCOPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER\nIN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN\nCONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.\n",
                  "type": "blob"
                },
                "README.md": {
                  "path": "README.md",
                  "mode": "100644",
                  "content": "core\n====\n\nAn object extension system.\n",
                  "type": "blob"
                },
                "core.coffee.md": {
                  "path": "core.coffee.md",
                  "mode": "100644",
                  "content": "Core\n====\n\nThe Core module is used to add extended functionality to objects without\nextending `Object.prototype` directly.\n\n    Core = (I={}, self={}) ->\n      extend self,\n\nExternal access to instance variables. Use of this property should be avoided\nin general, but can come in handy from time to time.\n\n>     #! example\n>     I =\n>       r: 255\n>       g: 0\n>       b: 100\n>\n>     myObject = Core(I)\n>\n>     [myObject.I.r, myObject.I.g, myObject.I.b]\n\n        I: I\n\nGenerates a public jQuery style getter / setter method for each `String` argument.\n\n>     #! example\n>     myObject = Core\n>       r: 255\n>       g: 0\n>       b: 100\n>\n>     myObject.attrAccessor \"r\", \"g\", \"b\"\n>\n>     myObject.r(254)\n\n        attrAccessor: (attrNames...) ->\n          attrNames.forEach (attrName) ->\n            self[attrName] = (newValue) ->\n              if arguments.length > 0\n                I[attrName] = newValue\n\n                return self\n              else\n                I[attrName]\n\n          return self\n\nGenerates a public jQuery style getter method for each String argument.\n\n>     #! example\n>     myObject = Core\n>       r: 255\n>       g: 0\n>       b: 100\n>\n>     myObject.attrReader \"r\", \"g\", \"b\"\n>\n>     [myObject.r(), myObject.g(), myObject.b()]\n\n        attrReader: (attrNames...) ->\n          attrNames.forEach (attrName) ->\n            self[attrName] = ->\n              I[attrName]\n\n          return self\n\nExtends this object with methods from the passed in object. A shortcut for Object.extend(self, methods)\n\n>     I =\n>       x: 30\n>       y: 40\n>       maxSpeed: 5\n>\n>     # we are using extend to give player\n>     # additional methods that Core doesn't have\n>     player = Core(I).extend\n>       increaseSpeed: ->\n>         I.maxSpeed += 1\n>\n>     player.increaseSpeed()\n\n        extend: (objects...) ->\n          extend self, objects...\n\nIncludes a module in this object. A module is a constructor that takes two parameters, `I` and `self`\n\n>     myObject = Core()\n>     myObject.include(Bindable)\n\n>     # now you can bind handlers to functions\n>     myObject.bind \"someEvent\", ->\n>       alert(\"wow. that was easy.\")\n\n        include: (modules...) ->\n          for Module in modules\n            Module(I, self)\n\n          return self\n\n      return self\n\nHelpers\n-------\n\nExtend an object with the properties of other objects.\n\n    extend = (target, sources...) ->\n      for source in sources\n        for name of source\n          target[name] = source[name]\n\n      return target\n\nExport\n\n    module.exports = Core\n",
                  "type": "blob"
                },
                "pixie.cson": {
                  "path": "pixie.cson",
                  "mode": "100644",
                  "content": "entryPoint: \"core\"\nversion: \"0.6.0\"\n",
                  "type": "blob"
                },
                "test/core.coffee": {
                  "path": "test/core.coffee",
                  "mode": "100644",
                  "content": "Core = require \"../core\"\n\nok = assert\nequals = assert.equal\ntest = it\n\ndescribe \"Core\", ->\n\n  test \"#extend\", ->\n    o = Core()\n  \n    o.extend\n      test: \"jawsome\"\n  \n    equals o.test, \"jawsome\"\n  \n  test \"#attrAccessor\", ->\n    o = Core\n      test: \"my_val\"\n  \n    o.attrAccessor(\"test\")\n  \n    equals o.test(), \"my_val\"\n    equals o.test(\"new_val\"), o\n    equals o.test(), \"new_val\"\n  \n  test \"#attrReader\", ->\n    o = Core\n      test: \"my_val\"\n  \n    o.attrReader(\"test\")\n  \n    equals o.test(), \"my_val\"\n    equals o.test(\"new_val\"), \"my_val\"\n    equals o.test(), \"my_val\"\n  \n  test \"#include\", ->\n    o = Core\n      test: \"my_val\"\n  \n    M = (I, self) ->\n      self.attrReader \"test\"\n  \n      self.extend\n        test2: \"cool\"\n  \n    ret = o.include M\n  \n    equals ret, o, \"Should return self\"\n  \n    equals o.test(), \"my_val\"\n    equals o.test2, \"cool\"\n  \n  test \"#include multiple\", ->\n    o = Core\n      test: \"my_val\"\n  \n    M = (I, self) ->\n      self.attrReader \"test\"\n  \n      self.extend\n        test2: \"cool\"\n  \n    M2 = (I, self) ->\n      self.extend\n        test2: \"coolio\"\n  \n    o.include M, M2\n  \n    equals o.test2, \"coolio\"\n",
                  "type": "blob"
                }
              },
              "distribution": {
                "core": {
                  "path": "core",
                  "content": "(function() {\n  var Core, extend,\n    __slice = [].slice;\n\n  Core = function(I, self) {\n    if (I == null) {\n      I = {};\n    }\n    if (self == null) {\n      self = {};\n    }\n    extend(self, {\n      I: I,\n      attrAccessor: function() {\n        var attrNames;\n        attrNames = 1 <= arguments.length ? __slice.call(arguments, 0) : [];\n        attrNames.forEach(function(attrName) {\n          return self[attrName] = function(newValue) {\n            if (arguments.length > 0) {\n              I[attrName] = newValue;\n              return self;\n            } else {\n              return I[attrName];\n            }\n          };\n        });\n        return self;\n      },\n      attrReader: function() {\n        var attrNames;\n        attrNames = 1 <= arguments.length ? __slice.call(arguments, 0) : [];\n        attrNames.forEach(function(attrName) {\n          return self[attrName] = function() {\n            return I[attrName];\n          };\n        });\n        return self;\n      },\n      extend: function() {\n        var objects;\n        objects = 1 <= arguments.length ? __slice.call(arguments, 0) : [];\n        return extend.apply(null, [self].concat(__slice.call(objects)));\n      },\n      include: function() {\n        var Module, modules, _i, _len;\n        modules = 1 <= arguments.length ? __slice.call(arguments, 0) : [];\n        for (_i = 0, _len = modules.length; _i < _len; _i++) {\n          Module = modules[_i];\n          Module(I, self);\n        }\n        return self;\n      }\n    });\n    return self;\n  };\n\n  extend = function() {\n    var name, source, sources, target, _i, _len;\n    target = arguments[0], sources = 2 <= arguments.length ? __slice.call(arguments, 1) : [];\n    for (_i = 0, _len = sources.length; _i < _len; _i++) {\n      source = sources[_i];\n      for (name in source) {\n        target[name] = source[name];\n      }\n    }\n    return target;\n  };\n\n  module.exports = Core;\n\n}).call(this);\n\n//# sourceURL=core.coffee",
                  "type": "blob"
                },
                "pixie": {
                  "path": "pixie",
                  "content": "module.exports = {\"entryPoint\":\"core\",\"version\":\"0.6.0\"};",
                  "type": "blob"
                },
                "test/core": {
                  "path": "test/core",
                  "content": "(function() {\n  var Core, equals, ok, test;\n\n  Core = require(\"../core\");\n\n  ok = assert;\n\n  equals = assert.equal;\n\n  test = it;\n\n  describe(\"Core\", function() {\n    test(\"#extend\", function() {\n      var o;\n      o = Core();\n      o.extend({\n        test: \"jawsome\"\n      });\n      return equals(o.test, \"jawsome\");\n    });\n    test(\"#attrAccessor\", function() {\n      var o;\n      o = Core({\n        test: \"my_val\"\n      });\n      o.attrAccessor(\"test\");\n      equals(o.test(), \"my_val\");\n      equals(o.test(\"new_val\"), o);\n      return equals(o.test(), \"new_val\");\n    });\n    test(\"#attrReader\", function() {\n      var o;\n      o = Core({\n        test: \"my_val\"\n      });\n      o.attrReader(\"test\");\n      equals(o.test(), \"my_val\");\n      equals(o.test(\"new_val\"), \"my_val\");\n      return equals(o.test(), \"my_val\");\n    });\n    test(\"#include\", function() {\n      var M, o, ret;\n      o = Core({\n        test: \"my_val\"\n      });\n      M = function(I, self) {\n        self.attrReader(\"test\");\n        return self.extend({\n          test2: \"cool\"\n        });\n      };\n      ret = o.include(M);\n      equals(ret, o, \"Should return self\");\n      equals(o.test(), \"my_val\");\n      return equals(o.test2, \"cool\");\n    });\n    return test(\"#include multiple\", function() {\n      var M, M2, o;\n      o = Core({\n        test: \"my_val\"\n      });\n      M = function(I, self) {\n        self.attrReader(\"test\");\n        return self.extend({\n          test2: \"cool\"\n        });\n      };\n      M2 = function(I, self) {\n        return self.extend({\n          test2: \"coolio\"\n        });\n      };\n      o.include(M, M2);\n      return equals(o.test2, \"coolio\");\n    });\n  });\n\n}).call(this);\n\n//# sourceURL=test/core.coffee",
                  "type": "blob"
                }
              },
              "progenitor": {
                "url": "http://strd6.github.io/editor/"
              },
              "version": "0.6.0",
              "entryPoint": "core",
              "repository": {
                "id": 13567517,
                "name": "core",
                "full_name": "distri/core",
                "owner": {
                  "login": "distri",
                  "id": 6005125,
                  "avatar_url": "https://identicons.github.com/f90c81ffc1498e260c820082f2e7ca5f.png",
                  "gravatar_id": null,
                  "url": "https://api.github.com/users/distri",
                  "html_url": "https://github.com/distri",
                  "followers_url": "https://api.github.com/users/distri/followers",
                  "following_url": "https://api.github.com/users/distri/following{/other_user}",
                  "gists_url": "https://api.github.com/users/distri/gists{/gist_id}",
                  "starred_url": "https://api.github.com/users/distri/starred{/owner}{/repo}",
                  "subscriptions_url": "https://api.github.com/users/distri/subscriptions",
                  "organizations_url": "https://api.github.com/users/distri/orgs",
                  "repos_url": "https://api.github.com/users/distri/repos",
                  "events_url": "https://api.github.com/users/distri/events{/privacy}",
                  "received_events_url": "https://api.github.com/users/distri/received_events",
                  "type": "Organization",
                  "site_admin": false
                },
                "private": false,
                "html_url": "https://github.com/distri/core",
                "description": "An object extension system.",
                "fork": false,
                "url": "https://api.github.com/repos/distri/core",
                "forks_url": "https://api.github.com/repos/distri/core/forks",
                "keys_url": "https://api.github.com/repos/distri/core/keys{/key_id}",
                "collaborators_url": "https://api.github.com/repos/distri/core/collaborators{/collaborator}",
                "teams_url": "https://api.github.com/repos/distri/core/teams",
                "hooks_url": "https://api.github.com/repos/distri/core/hooks",
                "issue_events_url": "https://api.github.com/repos/distri/core/issues/events{/number}",
                "events_url": "https://api.github.com/repos/distri/core/events",
                "assignees_url": "https://api.github.com/repos/distri/core/assignees{/user}",
                "branches_url": "https://api.github.com/repos/distri/core/branches{/branch}",
                "tags_url": "https://api.github.com/repos/distri/core/tags",
                "blobs_url": "https://api.github.com/repos/distri/core/git/blobs{/sha}",
                "git_tags_url": "https://api.github.com/repos/distri/core/git/tags{/sha}",
                "git_refs_url": "https://api.github.com/repos/distri/core/git/refs{/sha}",
                "trees_url": "https://api.github.com/repos/distri/core/git/trees{/sha}",
                "statuses_url": "https://api.github.com/repos/distri/core/statuses/{sha}",
                "languages_url": "https://api.github.com/repos/distri/core/languages",
                "stargazers_url": "https://api.github.com/repos/distri/core/stargazers",
                "contributors_url": "https://api.github.com/repos/distri/core/contributors",
                "subscribers_url": "https://api.github.com/repos/distri/core/subscribers",
                "subscription_url": "https://api.github.com/repos/distri/core/subscription",
                "commits_url": "https://api.github.com/repos/distri/core/commits{/sha}",
                "git_commits_url": "https://api.github.com/repos/distri/core/git/commits{/sha}",
                "comments_url": "https://api.github.com/repos/distri/core/comments{/number}",
                "issue_comment_url": "https://api.github.com/repos/distri/core/issues/comments/{number}",
                "contents_url": "https://api.github.com/repos/distri/core/contents/{+path}",
                "compare_url": "https://api.github.com/repos/distri/core/compare/{base}...{head}",
                "merges_url": "https://api.github.com/repos/distri/core/merges",
                "archive_url": "https://api.github.com/repos/distri/core/{archive_format}{/ref}",
                "downloads_url": "https://api.github.com/repos/distri/core/downloads",
                "issues_url": "https://api.github.com/repos/distri/core/issues{/number}",
                "pulls_url": "https://api.github.com/repos/distri/core/pulls{/number}",
                "milestones_url": "https://api.github.com/repos/distri/core/milestones{/number}",
                "notifications_url": "https://api.github.com/repos/distri/core/notifications{?since,all,participating}",
                "labels_url": "https://api.github.com/repos/distri/core/labels{/name}",
                "releases_url": "https://api.github.com/repos/distri/core/releases{/id}",
                "created_at": "2013-10-14T17:04:33Z",
                "updated_at": "2013-12-24T00:49:21Z",
                "pushed_at": "2013-10-14T23:49:11Z",
                "git_url": "git://github.com/distri/core.git",
                "ssh_url": "git@github.com:distri/core.git",
                "clone_url": "https://github.com/distri/core.git",
                "svn_url": "https://github.com/distri/core",
                "homepage": null,
                "size": 592,
                "stargazers_count": 0,
                "watchers_count": 0,
                "language": "CoffeeScript",
                "has_issues": true,
                "has_downloads": true,
                "has_wiki": true,
                "forks_count": 0,
                "mirror_url": null,
                "open_issues_count": 0,
                "forks": 0,
                "open_issues": 0,
                "watchers": 0,
                "default_branch": "master",
                "master_branch": "master",
                "permissions": {
                  "admin": true,
                  "push": true,
                  "pull": true
                },
                "organization": {
                  "login": "distri",
                  "id": 6005125,
                  "avatar_url": "https://identicons.github.com/f90c81ffc1498e260c820082f2e7ca5f.png",
                  "gravatar_id": null,
                  "url": "https://api.github.com/users/distri",
                  "html_url": "https://github.com/distri",
                  "followers_url": "https://api.github.com/users/distri/followers",
                  "following_url": "https://api.github.com/users/distri/following{/other_user}",
                  "gists_url": "https://api.github.com/users/distri/gists{/gist_id}",
                  "starred_url": "https://api.github.com/users/distri/starred{/owner}{/repo}",
                  "subscriptions_url": "https://api.github.com/users/distri/subscriptions",
                  "organizations_url": "https://api.github.com/users/distri/orgs",
                  "repos_url": "https://api.github.com/users/distri/repos",
                  "events_url": "https://api.github.com/users/distri/events{/privacy}",
                  "received_events_url": "https://api.github.com/users/distri/received_events",
                  "type": "Organization",
                  "site_admin": false
                },
                "network_count": 0,
                "subscribers_count": 1,
                "branch": "v0.6.0",
                "defaultBranch": "master"
              },
              "dependencies": {}
            }
          }
        },
        "core": {
          "source": {
            "LICENSE": {
              "path": "LICENSE",
              "mode": "100644",
              "content": "The MIT License (MIT)\n\nCopyright (c) 2013 Daniel X Moore\n\nPermission is hereby granted, free of charge, to any person obtaining a copy of\nthis software and associated documentation files (the \"Software\"), to deal in\nthe Software without restriction, including without limitation the rights to\nuse, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of\nthe Software, and to permit persons to whom the Software is furnished to do so,\nsubject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS\nFOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR\nCOPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER\nIN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN\nCONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.\n",
              "type": "blob"
            },
            "README.md": {
              "path": "README.md",
              "mode": "100644",
              "content": "core\n====\n\nAn object extension system.\n",
              "type": "blob"
            },
            "core.coffee.md": {
              "path": "core.coffee.md",
              "mode": "100644",
              "content": "Core\n====\n\nThe Core module is used to add extended functionality to objects without\nextending `Object.prototype` directly.\n\n    Core = (I={}, self={}) ->\n      extend self,\n\nExternal access to instance variables. Use of this property should be avoided\nin general, but can come in handy from time to time.\n\n>     #! example\n>     I =\n>       r: 255\n>       g: 0\n>       b: 100\n>\n>     myObject = Core(I)\n>\n>     [myObject.I.r, myObject.I.g, myObject.I.b]\n\n        I: I\n\nGenerates a public jQuery style getter / setter method for each `String` argument.\n\n>     #! example\n>     myObject = Core\n>       r: 255\n>       g: 0\n>       b: 100\n>\n>     myObject.attrAccessor \"r\", \"g\", \"b\"\n>\n>     myObject.r(254)\n\n        attrAccessor: (attrNames...) ->\n          attrNames.forEach (attrName) ->\n            self[attrName] = (newValue) ->\n              if arguments.length > 0\n                I[attrName] = newValue\n\n                return self\n              else\n                I[attrName]\n\n          return self\n\nGenerates a public jQuery style getter method for each String argument.\n\n>     #! example\n>     myObject = Core\n>       r: 255\n>       g: 0\n>       b: 100\n>\n>     myObject.attrReader \"r\", \"g\", \"b\"\n>\n>     [myObject.r(), myObject.g(), myObject.b()]\n\n        attrReader: (attrNames...) ->\n          attrNames.forEach (attrName) ->\n            self[attrName] = ->\n              I[attrName]\n\n          return self\n\nExtends this object with methods from the passed in object. A shortcut for Object.extend(self, methods)\n\n>     I =\n>       x: 30\n>       y: 40\n>       maxSpeed: 5\n>\n>     # we are using extend to give player\n>     # additional methods that Core doesn't have\n>     player = Core(I).extend\n>       increaseSpeed: ->\n>         I.maxSpeed += 1\n>\n>     player.increaseSpeed()\n\n        extend: (objects...) ->\n          extend self, objects...\n\nIncludes a module in this object. A module is a constructor that takes two parameters, `I` and `self`\n\n>     myObject = Core()\n>     myObject.include(Bindable)\n\n>     # now you can bind handlers to functions\n>     myObject.bind \"someEvent\", ->\n>       alert(\"wow. that was easy.\")\n\n        include: (modules...) ->\n          for Module in modules\n            Module(I, self)\n\n          return self\n\n      return self\n\nHelpers\n-------\n\nExtend an object with the properties of other objects.\n\n    extend = (target, sources...) ->\n      for source in sources\n        for name of source\n          target[name] = source[name]\n\n      return target\n\nExport\n\n    module.exports = Core\n",
              "type": "blob"
            },
            "pixie.cson": {
              "path": "pixie.cson",
              "mode": "100644",
              "content": "entryPoint: \"core\"\nversion: \"0.6.0\"\n",
              "type": "blob"
            },
            "test/core.coffee": {
              "path": "test/core.coffee",
              "mode": "100644",
              "content": "Core = require \"../core\"\n\nok = assert\nequals = assert.equal\ntest = it\n\ndescribe \"Core\", ->\n\n  test \"#extend\", ->\n    o = Core()\n  \n    o.extend\n      test: \"jawsome\"\n  \n    equals o.test, \"jawsome\"\n  \n  test \"#attrAccessor\", ->\n    o = Core\n      test: \"my_val\"\n  \n    o.attrAccessor(\"test\")\n  \n    equals o.test(), \"my_val\"\n    equals o.test(\"new_val\"), o\n    equals o.test(), \"new_val\"\n  \n  test \"#attrReader\", ->\n    o = Core\n      test: \"my_val\"\n  \n    o.attrReader(\"test\")\n  \n    equals o.test(), \"my_val\"\n    equals o.test(\"new_val\"), \"my_val\"\n    equals o.test(), \"my_val\"\n  \n  test \"#include\", ->\n    o = Core\n      test: \"my_val\"\n  \n    M = (I, self) ->\n      self.attrReader \"test\"\n  \n      self.extend\n        test2: \"cool\"\n  \n    ret = o.include M\n  \n    equals ret, o, \"Should return self\"\n  \n    equals o.test(), \"my_val\"\n    equals o.test2, \"cool\"\n  \n  test \"#include multiple\", ->\n    o = Core\n      test: \"my_val\"\n  \n    M = (I, self) ->\n      self.attrReader \"test\"\n  \n      self.extend\n        test2: \"cool\"\n  \n    M2 = (I, self) ->\n      self.extend\n        test2: \"coolio\"\n  \n    o.include M, M2\n  \n    equals o.test2, \"coolio\"\n",
              "type": "blob"
            }
          },
          "distribution": {
            "core": {
              "path": "core",
              "content": "(function() {\n  var Core, extend,\n    __slice = [].slice;\n\n  Core = function(I, self) {\n    if (I == null) {\n      I = {};\n    }\n    if (self == null) {\n      self = {};\n    }\n    extend(self, {\n      I: I,\n      attrAccessor: function() {\n        var attrNames;\n        attrNames = 1 <= arguments.length ? __slice.call(arguments, 0) : [];\n        attrNames.forEach(function(attrName) {\n          return self[attrName] = function(newValue) {\n            if (arguments.length > 0) {\n              I[attrName] = newValue;\n              return self;\n            } else {\n              return I[attrName];\n            }\n          };\n        });\n        return self;\n      },\n      attrReader: function() {\n        var attrNames;\n        attrNames = 1 <= arguments.length ? __slice.call(arguments, 0) : [];\n        attrNames.forEach(function(attrName) {\n          return self[attrName] = function() {\n            return I[attrName];\n          };\n        });\n        return self;\n      },\n      extend: function() {\n        var objects;\n        objects = 1 <= arguments.length ? __slice.call(arguments, 0) : [];\n        return extend.apply(null, [self].concat(__slice.call(objects)));\n      },\n      include: function() {\n        var Module, modules, _i, _len;\n        modules = 1 <= arguments.length ? __slice.call(arguments, 0) : [];\n        for (_i = 0, _len = modules.length; _i < _len; _i++) {\n          Module = modules[_i];\n          Module(I, self);\n        }\n        return self;\n      }\n    });\n    return self;\n  };\n\n  extend = function() {\n    var name, source, sources, target, _i, _len;\n    target = arguments[0], sources = 2 <= arguments.length ? __slice.call(arguments, 1) : [];\n    for (_i = 0, _len = sources.length; _i < _len; _i++) {\n      source = sources[_i];\n      for (name in source) {\n        target[name] = source[name];\n      }\n    }\n    return target;\n  };\n\n  module.exports = Core;\n\n}).call(this);\n\n//# sourceURL=core.coffee",
              "type": "blob"
            },
            "pixie": {
              "path": "pixie",
              "content": "module.exports = {\"entryPoint\":\"core\",\"version\":\"0.6.0\"};",
              "type": "blob"
            },
            "test/core": {
              "path": "test/core",
              "content": "(function() {\n  var Core, equals, ok, test;\n\n  Core = require(\"../core\");\n\n  ok = assert;\n\n  equals = assert.equal;\n\n  test = it;\n\n  describe(\"Core\", function() {\n    test(\"#extend\", function() {\n      var o;\n      o = Core();\n      o.extend({\n        test: \"jawsome\"\n      });\n      return equals(o.test, \"jawsome\");\n    });\n    test(\"#attrAccessor\", function() {\n      var o;\n      o = Core({\n        test: \"my_val\"\n      });\n      o.attrAccessor(\"test\");\n      equals(o.test(), \"my_val\");\n      equals(o.test(\"new_val\"), o);\n      return equals(o.test(), \"new_val\");\n    });\n    test(\"#attrReader\", function() {\n      var o;\n      o = Core({\n        test: \"my_val\"\n      });\n      o.attrReader(\"test\");\n      equals(o.test(), \"my_val\");\n      equals(o.test(\"new_val\"), \"my_val\");\n      return equals(o.test(), \"my_val\");\n    });\n    test(\"#include\", function() {\n      var M, o, ret;\n      o = Core({\n        test: \"my_val\"\n      });\n      M = function(I, self) {\n        self.attrReader(\"test\");\n        return self.extend({\n          test2: \"cool\"\n        });\n      };\n      ret = o.include(M);\n      equals(ret, o, \"Should return self\");\n      equals(o.test(), \"my_val\");\n      return equals(o.test2, \"cool\");\n    });\n    return test(\"#include multiple\", function() {\n      var M, M2, o;\n      o = Core({\n        test: \"my_val\"\n      });\n      M = function(I, self) {\n        self.attrReader(\"test\");\n        return self.extend({\n          test2: \"cool\"\n        });\n      };\n      M2 = function(I, self) {\n        return self.extend({\n          test2: \"coolio\"\n        });\n      };\n      o.include(M, M2);\n      return equals(o.test2, \"coolio\");\n    });\n  });\n\n}).call(this);\n\n//# sourceURL=test/core.coffee",
              "type": "blob"
            }
          },
          "progenitor": {
            "url": "http://strd6.github.io/editor/"
          },
          "version": "0.6.0",
          "entryPoint": "core",
          "repository": {
            "id": 13567517,
            "name": "core",
            "full_name": "distri/core",
            "owner": {
              "login": "distri",
              "id": 6005125,
              "avatar_url": "https://identicons.github.com/f90c81ffc1498e260c820082f2e7ca5f.png",
              "gravatar_id": null,
              "url": "https://api.github.com/users/distri",
              "html_url": "https://github.com/distri",
              "followers_url": "https://api.github.com/users/distri/followers",
              "following_url": "https://api.github.com/users/distri/following{/other_user}",
              "gists_url": "https://api.github.com/users/distri/gists{/gist_id}",
              "starred_url": "https://api.github.com/users/distri/starred{/owner}{/repo}",
              "subscriptions_url": "https://api.github.com/users/distri/subscriptions",
              "organizations_url": "https://api.github.com/users/distri/orgs",
              "repos_url": "https://api.github.com/users/distri/repos",
              "events_url": "https://api.github.com/users/distri/events{/privacy}",
              "received_events_url": "https://api.github.com/users/distri/received_events",
              "type": "Organization",
              "site_admin": false
            },
            "private": false,
            "html_url": "https://github.com/distri/core",
            "description": "An object extension system.",
            "fork": false,
            "url": "https://api.github.com/repos/distri/core",
            "forks_url": "https://api.github.com/repos/distri/core/forks",
            "keys_url": "https://api.github.com/repos/distri/core/keys{/key_id}",
            "collaborators_url": "https://api.github.com/repos/distri/core/collaborators{/collaborator}",
            "teams_url": "https://api.github.com/repos/distri/core/teams",
            "hooks_url": "https://api.github.com/repos/distri/core/hooks",
            "issue_events_url": "https://api.github.com/repos/distri/core/issues/events{/number}",
            "events_url": "https://api.github.com/repos/distri/core/events",
            "assignees_url": "https://api.github.com/repos/distri/core/assignees{/user}",
            "branches_url": "https://api.github.com/repos/distri/core/branches{/branch}",
            "tags_url": "https://api.github.com/repos/distri/core/tags",
            "blobs_url": "https://api.github.com/repos/distri/core/git/blobs{/sha}",
            "git_tags_url": "https://api.github.com/repos/distri/core/git/tags{/sha}",
            "git_refs_url": "https://api.github.com/repos/distri/core/git/refs{/sha}",
            "trees_url": "https://api.github.com/repos/distri/core/git/trees{/sha}",
            "statuses_url": "https://api.github.com/repos/distri/core/statuses/{sha}",
            "languages_url": "https://api.github.com/repos/distri/core/languages",
            "stargazers_url": "https://api.github.com/repos/distri/core/stargazers",
            "contributors_url": "https://api.github.com/repos/distri/core/contributors",
            "subscribers_url": "https://api.github.com/repos/distri/core/subscribers",
            "subscription_url": "https://api.github.com/repos/distri/core/subscription",
            "commits_url": "https://api.github.com/repos/distri/core/commits{/sha}",
            "git_commits_url": "https://api.github.com/repos/distri/core/git/commits{/sha}",
            "comments_url": "https://api.github.com/repos/distri/core/comments{/number}",
            "issue_comment_url": "https://api.github.com/repos/distri/core/issues/comments/{number}",
            "contents_url": "https://api.github.com/repos/distri/core/contents/{+path}",
            "compare_url": "https://api.github.com/repos/distri/core/compare/{base}...{head}",
            "merges_url": "https://api.github.com/repos/distri/core/merges",
            "archive_url": "https://api.github.com/repos/distri/core/{archive_format}{/ref}",
            "downloads_url": "https://api.github.com/repos/distri/core/downloads",
            "issues_url": "https://api.github.com/repos/distri/core/issues{/number}",
            "pulls_url": "https://api.github.com/repos/distri/core/pulls{/number}",
            "milestones_url": "https://api.github.com/repos/distri/core/milestones{/number}",
            "notifications_url": "https://api.github.com/repos/distri/core/notifications{?since,all,participating}",
            "labels_url": "https://api.github.com/repos/distri/core/labels{/name}",
            "releases_url": "https://api.github.com/repos/distri/core/releases{/id}",
            "created_at": "2013-10-14T17:04:33Z",
            "updated_at": "2013-12-24T00:49:21Z",
            "pushed_at": "2013-10-14T23:49:11Z",
            "git_url": "git://github.com/distri/core.git",
            "ssh_url": "git@github.com:distri/core.git",
            "clone_url": "https://github.com/distri/core.git",
            "svn_url": "https://github.com/distri/core",
            "homepage": null,
            "size": 592,
            "stargazers_count": 0,
            "watchers_count": 0,
            "language": "CoffeeScript",
            "has_issues": true,
            "has_downloads": true,
            "has_wiki": true,
            "forks_count": 0,
            "mirror_url": null,
            "open_issues_count": 0,
            "forks": 0,
            "open_issues": 0,
            "watchers": 0,
            "default_branch": "master",
            "master_branch": "master",
            "permissions": {
              "admin": true,
              "push": true,
              "pull": true
            },
            "organization": {
              "login": "distri",
              "id": 6005125,
              "avatar_url": "https://identicons.github.com/f90c81ffc1498e260c820082f2e7ca5f.png",
              "gravatar_id": null,
              "url": "https://api.github.com/users/distri",
              "html_url": "https://github.com/distri",
              "followers_url": "https://api.github.com/users/distri/followers",
              "following_url": "https://api.github.com/users/distri/following{/other_user}",
              "gists_url": "https://api.github.com/users/distri/gists{/gist_id}",
              "starred_url": "https://api.github.com/users/distri/starred{/owner}{/repo}",
              "subscriptions_url": "https://api.github.com/users/distri/subscriptions",
              "organizations_url": "https://api.github.com/users/distri/orgs",
              "repos_url": "https://api.github.com/users/distri/repos",
              "events_url": "https://api.github.com/users/distri/events{/privacy}",
              "received_events_url": "https://api.github.com/users/distri/received_events",
              "type": "Organization",
              "site_admin": false
            },
            "network_count": 0,
            "subscribers_count": 1,
            "branch": "v0.6.0",
            "defaultBranch": "master"
          },
          "dependencies": {}
        },
        "extensions": {
          "source": {
            "LICENSE": {
              "path": "LICENSE",
              "mode": "100644",
              "content": "The MIT License (MIT)\n\nCopyright (c) 2013 Daniel X Moore\n\nPermission is hereby granted, free of charge, to any person obtaining a copy of\nthis software and associated documentation files (the \"Software\"), to deal in\nthe Software without restriction, including without limitation the rights to\nuse, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of\nthe Software, and to permit persons to whom the Software is furnished to do so,\nsubject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS\nFOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR\nCOPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER\nIN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN\nCONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.\n",
              "type": "blob"
            },
            "README.md": {
              "path": "README.md",
              "mode": "100644",
              "content": "Extensions\n==========\n\nExtend built-in prototypes with helpful methods.\n",
              "type": "blob"
            },
            "array.coffee.md": {
              "path": "array.coffee.md",
              "mode": "100644",
              "content": "Array\n=====\n\n    {extend} = require \"./util\"\n\n    extend Array.prototype,\n\nCalculate the average value of an array. Returns undefined if some elements\nare not numbers.\n\n      average: ->\n        @sum()/@length\n\n>     #! example\n>     [1, 3, 5, 7].average()\n\n----\n\nReturns a copy of the array without null and undefined values.\n\n      compact: ->\n        @select (element) ->\n          element?\n\n>     #! example\n>     [null, undefined, 3, 3, undefined, 5].compact()\n\n----\n\nCreates and returns a copy of the array. The copy contains\nthe same objects.\n\n      copy: ->\n        @concat()\n\n>     #! example\n>     a = [\"a\", \"b\", \"c\"]\n>     b = a.copy()\n>\n>     # their elements are equal\n>     a[0] == b[0] && a[1] == b[1] && a[2] == b[2]\n>     # => true\n>\n>     # but they aren't the same object in memory\n>     a is b\n>     # => false\n\n----\n\nEmpties the array of its contents. It is modified in place.\n\n      clear: ->\n        @length = 0\n\n        return this\n\n>     #! example\n>     fullArray = [1, 2, 3]\n>     fullArray.clear()\n>     fullArray\n\n----\n\nFlatten out an array of arrays into a single array of elements.\n\n      flatten: ->\n        @inject [], (a, b) ->\n          a.concat b\n\n>     #! example\n>     [[1, 2], [3, 4], 5].flatten()\n>     # => [1, 2, 3, 4, 5]\n>\n>     # won't flatten twice nested arrays. call\n>     # flatten twice if that is what you want\n>     [[1, 2], [3, [4, 5]], 6].flatten()\n>     # => [1, 2, 3, [4, 5], 6]\n\n----\n\nInvoke the named method on each element in the array\nand return a new array containing the results of the invocation.\n\n      invoke: (method, args...) ->\n        @map (element) ->\n          element[method].apply(element, args)\n\n>     #! example\n>     [1.1, 2.2, 3.3, 4.4].invoke(\"floor\")\n\n----\n\n>     #! example\n>     ['hello', 'world', 'cool!'].invoke('substring', 0, 3)\n\n----\n\nRandomly select an element from the array.\n\n      rand: ->\n        @[rand(@length)]\n\n>     #! example\n>     [1, 2, 3].rand()\n\n----\n\nRemove the first occurrence of the given object from the array if it is\npresent. The array is modified in place.\n\n      remove: (object) ->\n        index = @indexOf(object)\n\n        if index >= 0\n          @splice(index, 1)[0]\n        else\n          undefined\n\n>     #! example\n>     a = [1, 1, \"a\", \"b\"]\n>     a.remove(1)\n>     a\n\n----\n\nReturns true if the element is present in the array.\n\n      include: (element) ->\n        @indexOf(element) != -1\n\n>     #! example\n>     [\"a\", \"b\", \"c\"].include(\"c\")\n\n----\n\nCall the given iterator once for each element in the array,\npassing in the element as the first argument, the index of\nthe element as the second argument, and this array as the\nthird argument.\n\n      each: (iterator, context) ->\n        if @forEach\n          @forEach iterator, context\n        else\n          for element, i in this\n            iterator.call context, element, i, this\n\n        return this\n\n>     #! example\n>     word = \"\"\n>     indices = []\n>     [\"r\", \"a\", \"d\"].each (letter, index) ->\n>       word += letter\n>       indices.push(index)\n>\n>     # => [\"r\", \"a\", \"d\"]\n>\n>     word\n>     # => \"rad\"\n>\n>     indices\n\n----\n\nCall the given iterator once for each pair of objects in the array.\n\n      eachPair: (iterator, context) ->\n        length = @length\n        i = 0\n        while i < length\n          a = @[i]\n          j = i + 1\n          i += 1\n\n          while j < length\n            b = @[j]\n            j += 1\n\n            iterator.call context, a, b\n\n>     #! example\n>     results = []\n>     [1, 2, 3, 4].eachPair (a, b) ->\n>       results.push [a, b]\n>\n>     results\n\n----\n\nCall the given iterator once for each element in the array,\npassing in the element as the first argument and the given object\nas the second argument. Additional arguments are passed similar to\n`each`.\n\n      eachWithObject: (object, iterator, context) ->\n        @each (element, i, self) ->\n          iterator.call context, element, object, i, self\n\n        return object\n\nCall the given iterator once for each group of elements in the array,\npassing in the elements in groups of n. Additional arguments are\npassed as in `each`.\n\n      eachSlice: (n, iterator, context) ->\n        len = @length / n\n        i = -1\n\n        while ++i < len\n          iterator.call(context, @slice(i*n, (i+1)*n), i*n, this)\n\n        return this\n\n>     #! example\n>     results = []\n>     [1, 2, 3, 4].eachSlice 2, (slice) ->\n>       results.push(slice)\n>\n>     results\n\n----\n\nPipe the input through each function in the array in turn. For example, if you have a\nlist of objects you can perform a series of selection, sorting, and other processing\nmethods and then receive the processed list. This array must contain functions that\naccept a single input and return the processed input. The output of the first function\nis fed to the input of the second and so on until the final processed output is returned.\n\n      pipeline: (input) ->\n        @inject input, (input, fn) ->\n          fn(input)\n\nReturns a new array with the elements all shuffled up.\n\n      shuffle: ->\n        shuffledArray = []\n\n        @each (element) ->\n          shuffledArray.splice(rand(shuffledArray.length + 1), 0, element)\n\n        return shuffledArray\n\n>     #! example\n>     [0..9].shuffle()\n\n----\n\nReturns the first element of the array, undefined if the array is empty.\n\n      first: ->\n        @[0]\n\n>     #! example\n>     [\"first\", \"second\", \"third\"].first()\n\n----\n\nReturns the last element of the array, undefined if the array is empty.\n\n      last: ->\n        @[@length - 1]\n\n>     #! example\n>     [\"first\", \"second\", \"third\"].last()\n\n----\n\nReturns an object containing the extremes of this array.\n\n      extremes: (fn=identity) ->\n        min = max = undefined\n        minResult = maxResult = undefined\n\n        @each (object) ->\n          result = fn(object)\n\n          if min?\n            if result < minResult\n              min = object\n              minResult = result\n          else\n            min = object\n            minResult = result\n\n          if max?\n            if result > maxResult\n              max = object\n              maxResult = result\n          else\n            max = object\n            maxResult = result\n\n        min: min\n        max: max\n\n>     #! example\n>     [-1, 3, 0].extremes()\n\n----\n\n      maxima: (valueFunction=identity) ->\n        @inject([-Infinity, []], (memo, item) ->\n          value = valueFunction(item)\n          [maxValue, maxItems] = memo\n\n          if value > maxValue\n            [value, [item]]\n          else if value is maxValue\n            [value, maxItems.concat(item)]\n          else\n            memo\n        ).last()\n\n      maximum: (valueFunction) ->\n        @maxima(valueFunction).first()\n\n      minima: (valueFunction=identity) ->\n        inverseFn = (x) ->\n          -valueFunction(x)\n\n        @maxima(inverseFn)\n\n      minimum: (valueFunction) ->\n        @minima(valueFunction).first()\n\nPretend the array is a circle and grab a new array containing length elements.\nIf length is not given return the element at start, again assuming the array\nis a circle.\n\n      wrap: (start, length) ->\n        if length?\n          end = start + length\n          i = start\n          result = []\n\n          while i < end\n            result.push(@[mod(i, @length)])\n            i += 1\n\n          return result\n        else\n          return @[mod(start, @length)]\n\n>     #! example\n>     [1, 2, 3].wrap(-1)\n\n----\n\n>     #! example\n>     [1, 2, 3].wrap(6)\n\n----\n\n>     #! example\n>     [\"l\", \"o\", \"o\", \"p\"].wrap(0, 12)\n\n----\n\nPartitions the elements into two groups: those for which the iterator returns\ntrue, and those for which it returns false.\n\n      partition: (iterator, context) ->\n        trueCollection = []\n        falseCollection = []\n\n        @each (element) ->\n          if iterator.call(context, element)\n            trueCollection.push element\n          else\n            falseCollection.push element\n\n        return [trueCollection, falseCollection]\n\n>     #! example\n>     [0..9].partition (n) ->\n>       n % 2 is 0\n\n----\n\nReturn the group of elements for which the return value of the iterator is true.\n\n      select: (iterator, context) ->\n        return @partition(iterator, context)[0]\n\nReturn the group of elements that are not in the passed in set.\n\n      without: (values) ->\n        @reject (element) ->\n          values.include(element)\n\n>     #! example\n>     [1, 2, 3, 4].without [2, 3]\n\n----\n\nReturn the group of elements for which the return value of the iterator is false.\n\n      reject: (iterator, context) ->\n        @partition(iterator, context)[1]\n\nCombines all elements of the array by applying a binary operation.\nfor each element in the arra the iterator is passed an accumulator\nvalue (memo) and the element.\n\n      inject: (initial, iterator) ->\n        @each (element) ->\n          initial = iterator(initial, element)\n\n        return initial\n\nAdd all the elements in the array.\n\n      sum: ->\n        @inject 0, (sum, n) ->\n          sum + n\n\n>     #! example\n>     [1, 2, 3, 4].sum()\n\n----\n\nMultiply all the elements in the array.\n\n      product: ->\n        @inject 1, (product, n) ->\n          product * n\n\n>     #! example\n>     [1, 2, 3, 4].product()\n\n----\n\nProduce a duplicate-free version of the array.\n\n      unique: ->\n        @inject [], (results, element) ->\n          results.push element if results.indexOf(element) is -1\n\n          results\n\nMerges together the values of each of the arrays with the values at the corresponding position.\n\n      zip: (args...) ->\n        @map (element, index) ->\n          output = args.map (arr) ->\n            arr[index]\n\n          output.unshift(element)\n\n          return output\n\n>     #! example\n>     ['a', 'b', 'c'].zip([1, 2, 3])\n\n----\n\nHelpers\n-------\n\n    identity = (x) ->\n      x\n\n    rand = (n) ->\n      Math.floor n * Math.random()\n\n    mod = (n, base) ->\n      result = n % base\n\n      if result < 0 and base > 0\n        result += base\n\n      return result\n",
              "type": "blob"
            },
            "extensions.coffee.md": {
              "path": "extensions.coffee.md",
              "mode": "100644",
              "content": "Extensions\n==========\n\nExtend built in prototypes with additional behavior.\n\n    require \"./array\"\n    require \"./function\"\n    require \"./number\"\n    require \"./string\"\n",
              "type": "blob"
            },
            "function.coffee.md": {
              "path": "function.coffee.md",
              "mode": "100644",
              "content": "Function\n========\n\n    {extend} = require \"./util\"\n\nAdd our `Function` extensions.\n\n    extend Function.prototype,\n      once: ->\n        func = this\n\n        ran = false\n        memo = undefined\n\n        return ->\n          return memo if ran\n          ran = true\n\n          return memo = func.apply(this, arguments)\n\nCalling a debounced function will postpone its execution until after\nwait milliseconds have elapsed since the last time the function was\ninvoked. Useful for implementing behavior that should only happen after\nthe input has stopped arriving. For example: rendering a preview of a\nMarkdown comment, recalculating a layout after the window has stopped\nbeing resized...\n\n      debounce: (wait) ->\n        timeout = null\n        func = this\n\n        return ->\n          context = this\n          args = arguments\n\n          later = ->\n            timeout = null\n            func.apply(context, args)\n\n          clearTimeout(timeout)\n          timeout = setTimeout(later, wait)\n\n>     lazyLayout = calculateLayout.debounce(300)\n>     $(window).resize(lazyLayout)\n\n----\n\n      delay: (wait, args...) ->\n        func = this\n\n        setTimeout ->\n          func.apply(null, args)\n        , wait\n\n      defer: (args...) ->\n        this.delay.apply this, [1].concat(args)\n\n    extend Function,\n      identity: (x) ->\n        x\n\n      noop: ->\n",
              "type": "blob"
            },
            "number.coffee.md": {
              "path": "number.coffee.md",
              "mode": "100644",
              "content": "Number\n======\n\nReturns the absolute value of this number.\n\n>     #! example\n>     (-4).abs()\n\nReturns the mathematical ceiling of this number. The number truncated to the\nnearest integer of greater than or equal value.\n\n>     #! example\n>     4.2.ceil()\n\n---\n\n>     #! example\n>     (-1.2).ceil()\n\n---\n\nReturns the mathematical floor of this number. The number truncated to the\nnearest integer of less than or equal value.\n\n>     #! example\n>     4.9.floor()\n\n---\n\n>     #! example\n>     (-1.2).floor()\n\n---\n\nReturns this number rounded to the nearest integer.\n\n>     #! example\n>     4.5.round()\n\n---\n\n>     #! example\n>     4.4.round()\n\n---\n\n    [\n      \"abs\"\n      \"ceil\"\n      \"floor\"\n      \"round\"\n    ].forEach (method) ->\n      Number::[method] = ->\n        Math[method](this)\n\n    {extend} = require \"./util\"\n\n    extend Number.prototype,\n\nGet a bunch of points equally spaced around the unit circle.\n\n      circularPoints: ->\n        n = this\n\n        [0..n].map (i) ->\n          Point.fromAngle (i/n).turns\n\n>     #! example\n>     4.circularPoints()\n\n---\n\nReturns a number whose value is limited to the given range.\n\n      clamp: (min, max) ->\n        if min? and max?\n          Math.min(Math.max(this, min), max)\n        else if min?\n          Math.max(this, min)\n        else if max?\n          Math.min(this, max)\n        else\n          this\n\n>     #! example\n>     512.clamp(0, 255)\n\n---\n\nA mod method useful for array wrapping. The range of the function is\nconstrained to remain in bounds of array indices.\n\n      mod: (base) ->\n        result = this % base;\n\n        if result < 0 && base > 0\n          result += base\n\n        return result\n\n>     #! example\n>     (-1).mod(5)\n\n---\n\nGet the sign of this number as an integer (1, -1, or 0).\n\n      sign: ->\n        if this > 0\n          1\n        else if this < 0\n          -1\n        else\n          0\n\n>     #! example\n>     5.sign()\n\n---\n\nReturns true if this number is even (evenly divisible by 2).\n\n      even: ->\n        @mod(2) is 0\n\n>     #! example\n>     2.even()\n\n---\n\nReturns true if this number is odd (has remainder of 1 when divided by 2).\n\n      odd: ->\n        @mod(2) is 1\n\n>     #! example\n>     3.odd()\n\n---\n\nCalls iterator the specified number of times, passing in the number of the\ncurrent iteration as a parameter: 0 on first call, 1 on the second call, etc.\n\n      times: (iterator, context) ->\n        i = -1\n\n        while ++i < this\n          iterator.call context, i\n\n        return i\n\n>     #! example\n>     output = []\n>\n>     5.times (n) ->\n>       output.push(n)\n>\n>     output\n\n---\n\nReturns the the nearest grid resolution less than or equal to the number.\n\n      snap: (resolution) ->\n        (n / resolution).floor() * resolution\n\n>     #! example\n>     7.snap(8)\n\n---\n\n      truncate: ->\n        if this > 0\n          @floor()\n        else if this < 0\n          @ceil()\n        else\n          this\n\nConvert a number to an amount of rotations.\n\n    unless 5.rotations\n      Object.defineProperty Number::, 'rotations',\n        get: ->\n          this * Math.TAU\n\n    unless 1.rotation\n      Object.defineProperty Number::, 'rotation',\n        get: ->\n          this * Math.TAU\n\n>     #! example\n>     0.5.rotations\n\n---\n\nConvert a number to an amount of rotations.\n\n    unless 5.turns\n      Object.defineProperty Number.prototype, 'turns',\n        get: ->\n          this * Math.TAU\n\n    unless 1.turn\n      Object.defineProperty Number.prototype, 'turn',\n        get: ->\n          this * Math.TAU\n\n>     #! example\n>     0.5.turns\n\n---\n\nConvert a number to an amount of degrees.\n\n    unless 2.degrees\n      Object.defineProperty Number::, 'degrees',\n        get: ->\n          this * Math.TAU / 360\n\n    unless 1.degree\n      Object.defineProperty Number::, 'degree',\n        get: ->\n          this * Math.TAU / 360\n\n>     #! example\n>     180.degrees\n\n---\n\nExtra\n-----\n\nThe mathematical circle constant of 1 turn.\n\n    Math.TAU = 2 * Math.PI\n",
              "type": "blob"
            },
            "pixie.cson": {
              "path": "pixie.cson",
              "mode": "100644",
              "content": "version: \"0.2.0\"\nentryPoint: \"extensions\"\n",
              "type": "blob"
            },
            "string.coffee.md": {
              "path": "string.coffee.md",
              "mode": "100644",
              "content": "String\n======\n\nExtend strings with utility methods.\n\n    {extend} = require \"./util\"\n\n    extend String.prototype,\n\nReturns true if this string only contains whitespace characters.\n\n      blank: ->\n        /^\\s*$/.test(this)\n\n>     #! example\n>     \"   \".blank()\n\n---\n\nParse this string as though it is JSON and return the object it represents. If it\nis not valid JSON returns the string itself.\n\n      parse: () ->\n        try\n          JSON.parse(this.toString())\n        catch e\n          this.toString()\n\n>     #! example\n>     # this is valid json, so an object is returned\n>     '{\"a\": 3}'.parse()\n\n---\n\nReturns true if this string starts with the given string.\n\n      startsWith: (str) ->\n        @lastIndexOf(str, 0) is 0\n\nReturns true if this string ends with the given string.\n\n      endsWith: (str) ->\n        @indexOf(str, @length - str.length) != -1\n\nGet the file extension of a string.\n\n      extension: ->\n        if extension = this.match(/\\.([^\\.]*)$/, '')?.last()\n          extension\n        else\n          ''\n\n>     #! example\n>     \"README.md\".extension()\n\n---\n\nAssumes the string is something like a file name and returns the\ncontents of the string without the extension.\n\n      withoutExtension: ->\n        this.replace(/\\.[^\\.]*$/, '')\n\n      toInt: (base=10) ->\n        parseInt(this, base)\n\n>     #! example\n>     \"neat.png\".witouthExtension()\n\n---\n",
              "type": "blob"
            },
            "test/array.coffee": {
              "path": "test/array.coffee",
              "mode": "100644",
              "content": "require \"../array\"\n\nok = assert\nequals = assert.equal\ntest = it\n\ndescribe \"Array\", ->\n\n  test \"#average\", ->\n    equals [1, 3, 5, 7].average(), 4\n  \n  test \"#compact\", ->\n    a = [0, 1, undefined, 2, null, 3, '', 4]\n  \n    compacted = a.compact()\n  \n    equals(compacted[0], 0)\n    equals(compacted[1], 1)\n    equals(compacted[2], 2)\n    equals(compacted[3], 3)\n    equals(compacted[4], '')\n    equals(compacted[5], 4)\n  \n  test \"#copy\", ->\n    a = [1,2,3]\n    b = a.copy()\n  \n    ok a != b, \"Original array is not the same array as the copied one\"\n    ok a.length == b.length, \"Both arrays are the same size\"\n    ok a[0] == b[0] && a[1] == b[1] && a[2] == b[2], \"The elements of the two arrays are equal\"\n  \n  test \"#flatten\", ->\n    array = [[0,1], [2,3], [4,5]]\n  \n    flattenedArray = array.flatten()\n  \n    equals flattenedArray.length, 6, \"Flattened array length should equal number of elements in sub-arrays\"\n    equals flattenedArray.first(), 0, \"First element should be first element in first sub-array\"\n    equals flattenedArray.last(), 5, \"Last element should be last element in last sub-array\"\n  \n  test \"#rand\", ->\n    array = [1,2,3]\n  \n    ok array.indexOf(array.rand()) != -1, \"Array includes randomly selected element\"\n    ok [5].rand() == 5, \"[5].rand() === 5\"\n    ok [].rand() == undefined, \"[].rand() === undefined\"\n  \n  test \"#remove\", ->\n    equals [1,2,3].remove(2), 2, \"[1,2,3].remove(2) === 2\"\n    equals [1,3].remove(2), undefined, \"[1,3].remove(2) === undefined\"\n    equals [1,3].remove(3), 3, \"[1,3].remove(3) === 3\"\n  \n    array = [1,2,3]\n    array.remove(2)\n    ok array.length == 2, \"array = [1,2,3]; array.remove(2); array.length === 2\"\n    array.remove(3)\n    ok array.length == 1, \"array = [1,3]; array.remove(3); array.length === 1\"\n  \n  test \"#map\", ->\n    equals [1].map((x) -> return x + 1 )[0], 2\n  \n  test \"#invoke\", ->\n    results = ['hello', 'world', 'cool!'].invoke('substring', 0, 3)\n  \n    equals results[0], \"hel\"\n    equals results[1], \"wor\"\n    equals results[2], \"coo\"\n  \n  test \"#each\", ->\n    array = [1, 2, 3]\n    count = 0\n  \n    equals array, array.each -> count++\n    equals array.length, count\n  \n  test \"#eachPair\", ->\n    array = [1, 2, 3]\n    sum = 0\n  \n    array.eachPair (a, b) ->\n      sum += a + b\n  \n    equals(sum, 12)\n  \n  test \"#eachWithObject\", ->\n    array = [1, 2, 3]\n  \n    result = array.eachWithObject {}, (element, hash) ->\n      hash[element] = (element + 1).toString()\n  \n    equals result[1], \"2\"\n    equals result[2], \"3\"\n    equals result[3], \"4\"\n  \n  test \"#shuffle\", ->\n    array = [0, 1, 2, 3, 4, 5]\n  \n    shuffledArray = array.shuffle()\n  \n    shuffledArray.each (element) ->\n      ok array.indexOf(element) >= 0, \"Every element in shuffled array is in orig array\"\n  \n    array.each (element) ->\n      ok shuffledArray.indexOf(element) >= 0, \"Every element in orig array is in shuffled array\"\n  \n  test \"#first\", ->\n    equals [2].first(), 2\n    equals [1, 2, 3].first(), 1\n    equals [].first(), undefined\n  \n  test \"#last\", ->\n    equals [2].last(), 2\n    equals [1, 2, 3].last(), 3\n    equals [].first(), undefined\n  \n  test \"#maxima\", ->\n    maxima = [-52, 0, 78].maxima()\n  \n    maxima.each (n) ->\n      equals n, 78\n  \n    maxima = [0, 0, 1, 0, 1, 0, 1, 0].maxima()\n  \n    equals 3, maxima.length\n  \n    maxima.each (n) ->\n      equals n, 1\n  \n  test \"#maximum\", ->\n    equals [-345, 38, 8347].maximum(), 8347\n  \n  test \"#maximum with function\", ->\n    equals [3, 4, 5].maximum((n) ->\n      n % 4\n    ), 3\n  \n  test \"#minima\", ->\n    minima = [-52, 0, 78].minima()\n  \n    minima.each (n) ->\n      equals n, -52\n  \n    minima = [0, 0, 1, 0, 1, 0, 1, 0].minima()\n  \n    equals 5, minima.length\n  \n    minima.each (n) ->\n      equals n, 0\n  \n  test \"#minimum\", ->\n    equals [-345, 38, 8347].minimum(), -345\n  \n  test \"#pipeline\", ->\n    pipe = [\n      (x) -> x * x\n      (x) -> x - 10\n    ]\n  \n    equals pipe.pipeline(5), 15\n  \n  test \"#extremes\", ->\n    array = [-7, 1, 11, 94]\n  \n    extremes = array.extremes()\n  \n    equals extremes.min, -7, \"Min is -7\"\n    equals extremes.max, 94, \"Max is 94\"\n  \n  test \"#extremes with fn\", ->\n    array = [1, 11, 94]\n\n    extremes = array.extremes (value) ->\n      value % 11\n\n    equals extremes.min, 11, extremes.min\n    equals extremes.max, 94, extremes.max\n\n  test \"#sum\", ->\n    equals [].sum(), 0, \"Empty array sums to zero\"\n    equals [2].sum(), 2, \"[2] sums to 2\"\n    equals [1, 2, 3, 4, 5].sum(), 15, \"[1, 2, 3, 4, 5] sums to 15\"\n  \n  test \"#eachSlice\", ->\n    [1, 2, 3, 4, 5, 6].eachSlice 2, (array) ->\n      equals array[0] % 2, 1\n      equals array[1] % 2, 0\n  \n  test \"#without\", ->\n    array = [1, 2, 3, 4]\n  \n    excluded = array.without([2, 4])\n  \n    equals excluded[0], 1\n    equals excluded[1], 3\n  \n  test \"#clear\", ->\n    array = [1, 2, 3, 4]\n  \n    equals array.length, 4\n    equals array[0], 1\n  \n    array.clear()\n  \n    equals array.length, 0\n    equals array[0], undefined\n  \n  test \"#unique\", ->\n    array = [0, 0, 0, 1, 1, 1, 2, 3]\n  \n    equals array.unique().first(), 0\n    equals array.unique().last(), 3\n    equals array.unique().length, 4\n  \n  test \"#wrap\", ->\n    array = [0, 1, 2, 3, 4]\n  \n    equals array.wrap(0), 0\n    equals array.wrap(-1), 4\n    equals array.wrap(2), 2\n  \n  test \"#zip\", ->\n    a = [1, 2, 3]\n    b = [4, 5, 6]\n    c = [7, 8]\n  \n    output = a.zip(b, c)\n  \n    equals output[0][0], 1\n    equals output[0][1], 4\n    equals output[0][2], 7\n  \n    equals output[2][2], undefined\n",
              "type": "blob"
            },
            "test/function.coffee": {
              "path": "test/function.coffee",
              "mode": "100644",
              "content": "require \"../function\"\n\nok = assert\nequals = assert.equal\ntest = it\n\ndescribe \"Function\", ->\n\n  test \"#once\", ->\n    score = 0\n  \n    addScore = ->\n      score += 100\n  \n    onceScore = addScore.once()\n  \n    [0..9].map ->\n      onceScore()\n  \n    equals score, 100\n  \n  test \".identity\", ->\n    I = Function.identity\n  \n    [0, 1, true, false, null, undefined].each (x) ->\n      equals I(x), x\n  \n  test \"#debounce\", (done) ->\n    fn = (-> ok true; done()).debounce(1)\n  \n    # Though called multiple times the function is only triggered once\n    fn()\n    fn()\n    fn()\n  \n  test \"#delay\", (done) ->\n    fn = (x, y) ->\n      equals x, 3\n      equals y, \"testy\"\n      done()\n  \n    fn.delay 25, 3, \"testy\"\n  \n  test \"#defer\", (done) ->\n    fn = (x) ->\n      equals x, 3\n      done()\n  \n    fn.defer 3\n",
              "type": "blob"
            },
            "test/number.coffee": {
              "path": "test/number.coffee",
              "mode": "100644",
              "content": "require \"../number\"\n\nok = assert\nequals = assert.equal\ntest = it\n\nequalEnough = (expected, actual, tolerance, message) ->\n  message ||= \"#{expected} within #{tolerance} of #{actual}\"\n\n  ok(expected + tolerance >= actual && expected - tolerance <= actual, message)\n  \ndescribe \"Number\", ->\n  \n  test \"#abs\", ->\n    equals 5.abs(), 5, \"(5).abs() equals 5\"\n    equals 4.2.abs(), 4.2, \"(4.2).abs() equals 4.2\"\n    equals (-1.2).abs(), 1.2, \"(-1.2).abs() equals 1.2\"\n    equals 0.abs(), 0, \"(0).abs() equals 0\"\n  \n  test \"#ceil\", ->\n    equals 4.9.ceil(), 5, \"(4.9).floor() equals 5\"\n    equals 4.2.ceil(), 5, \"(4.2).ceil() equals 5\"\n    equals (-1.2).ceil(), -1, \"(-1.2).ceil() equals -1\"\n    equals 3.ceil(), 3, \"(3).ceil() equals 3\"\n  \n  test \"#clamp\", ->\n    equals 5.clamp(0, 3), 3\n    equals 5.clamp(-1, 0), 0\n    equals (-5).clamp(0, 1), 0\n    equals 1.clamp(0, null), 1\n    equals (-1).clamp(0, null), 0\n    equals (-10).clamp(-5, 0), -5\n    equals (-10).clamp(null, 0), -10\n    equals 50.clamp(null, 10), 10\n  \n  test \"#floor\", ->\n    equals 4.9.floor(), 4, \"(4.9).floor() equals 4\"\n    equals 4.2.floor(), 4, \"(4.2).floor() equals 4\"\n    equals (-1.2).floor(), -2, \"(-1.2).floor() equals -2\"\n    equals 3.floor(), 3, \"(3).floor() equals 3\"\n  \n  test \"#round\", ->\n    equals 4.5.round(), 5, \"(4.5).round() equals 5\"\n    equals 4.4.round(), 4, \"(4.4).round() equals 4\"\n  \n  test \"#sign\", ->\n    equals 5.sign(), 1, \"Positive number's sign is 1\"\n    equals (-3).sign(), -1, \"Negative number's sign is -1\"\n    equals 0.sign(), 0, \"Zero's sign is 0\"\n  \n  test \"#even\", ->\n    [0, 2, -32].each (n) ->\n      ok n.even(), \"#{n} is even\"\n  \n    [1, -1, 2.2, -3.784].each (n) ->\n      equals n.even(), false, \"#{n} is not even\"\n  \n  test \"#odd\", ->\n    [1, 9, -37].each (n) ->\n      ok n.odd(), \"#{n} is odd\"\n  \n    [0, 32, 2.2, -1.1].each (n) ->\n      equals n.odd(), false, \"#{n} is not odd\"\n  \n  test \"#times\", ->\n    n = 5\n    equals n.times(->), n, \"returns n\"\n  \n  test \"#times called correct amount\", ->\n    n = 5\n    count = 0\n  \n    n.times -> count++\n  \n    equals n, count, \"returns n\"\n  \n  test \"#mod should have a positive result when used with a positive base and a negative number\", ->\n    n = -3\n  \n    equals n.mod(8), 5, \"Should 'wrap' and be positive.\"\n  \n  test \"#degrees\", ->\n    equals 180.degrees, Math.PI\n    equals 1.degree, Math.TAU / 360\n  \n  test \"#rotations\", ->\n    equals 1.rotation, Math.TAU\n    equals 0.5.rotations, Math.TAU / 2\n  \n  test \"#turns\", ->\n    equals 1.turn, Math.TAU\n    equals 0.5.turns, Math.TAU / 2\n",
              "type": "blob"
            },
            "test/string.coffee": {
              "path": "test/string.coffee",
              "mode": "100644",
              "content": "require \"../string\"\n\nok = assert\nequals = assert.equal\ntest = it\n\ndescribe \"String\", ->\n  \n  test \"#blank\", ->\n    equals \"  \".blank(), true, \"A string containing only whitespace should be blank\"\n    equals \"a\".blank(), false, \"A string that contains a letter should not be blank\"\n    equals \"  a \".blank(), false\n    equals \"  \\n\\t \".blank(), true\n  \n  test \"#extension\", ->\n    equals \"README\".extension(), \"\"\n    equals \"README.md\".extension(), \"md\"\n    equals \"jquery.min.js\".extension(), \"js\"\n    equals \"src/bouse.js.coffee\".extension(), \"coffee\"\n  \n  test \"#parse\", ->\n    equals \"true\".parse(), true, \"parsing 'true' should equal boolean true\"\n    equals \"false\".parse(), false, \"parsing 'true' should equal boolean true\"\n    equals \"7.2\".parse(), 7.2, \"numbers should be cool too\"\n  \n    equals '{\"val\": \"a string\"}'.parse().val, \"a string\", \"even parsing objects works\"\n  \n    ok ''.parse() == '', \"Empty string parses to exactly the empty string\"\n  \n  test \"#startsWith\", ->\n    ok \"cool\".startsWith(\"coo\")\n    equals \"cool\".startsWith(\"oo\"), false\n  \n  test \"#toInt\", ->\n    equals \"31.3\".toInt(), 31\n    equals \"31.\".toInt(), 31\n    equals \"-1.02\".toInt(), -1\n  \n    equals \"009\".toInt(), 9\n    equals \"0109\".toInt(), 109\n  \n    equals \"F\".toInt(16), 15\n  \n  test \"#withoutExtension\", ->\n    equals \"neat.png\".withoutExtension(), \"neat\"\n    equals \"not a file\".withoutExtension(), \"not a file\"\n",
              "type": "blob"
            },
            "util.coffee.md": {
              "path": "util.coffee.md",
              "mode": "100644",
              "content": "Util\n====\n\nUtility methods shared in our extensions.\n\n    module.exports =\n\nExtend an object with the properties of other objects.\n\n      extend: (target, sources...) ->\n        for source in sources\n          for name of source\n            target[name] = source[name]\n\n        return target\n",
              "type": "blob"
            }
          },
          "distribution": {
            "array": {
              "path": "array",
              "content": "(function() {\n  var extend, identity, mod, rand,\n    __slice = [].slice;\n\n  extend = require(\"./util\").extend;\n\n  extend(Array.prototype, {\n    average: function() {\n      return this.sum() / this.length;\n    },\n    compact: function() {\n      return this.select(function(element) {\n        return element != null;\n      });\n    },\n    copy: function() {\n      return this.concat();\n    },\n    clear: function() {\n      this.length = 0;\n      return this;\n    },\n    flatten: function() {\n      return this.inject([], function(a, b) {\n        return a.concat(b);\n      });\n    },\n    invoke: function() {\n      var args, method;\n      method = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];\n      return this.map(function(element) {\n        return element[method].apply(element, args);\n      });\n    },\n    rand: function() {\n      return this[rand(this.length)];\n    },\n    remove: function(object) {\n      var index;\n      index = this.indexOf(object);\n      if (index >= 0) {\n        return this.splice(index, 1)[0];\n      } else {\n        return void 0;\n      }\n    },\n    include: function(element) {\n      return this.indexOf(element) !== -1;\n    },\n    each: function(iterator, context) {\n      var element, i, _i, _len;\n      if (this.forEach) {\n        this.forEach(iterator, context);\n      } else {\n        for (i = _i = 0, _len = this.length; _i < _len; i = ++_i) {\n          element = this[i];\n          iterator.call(context, element, i, this);\n        }\n      }\n      return this;\n    },\n    eachPair: function(iterator, context) {\n      var a, b, i, j, length, _results;\n      length = this.length;\n      i = 0;\n      _results = [];\n      while (i < length) {\n        a = this[i];\n        j = i + 1;\n        i += 1;\n        _results.push((function() {\n          var _results1;\n          _results1 = [];\n          while (j < length) {\n            b = this[j];\n            j += 1;\n            _results1.push(iterator.call(context, a, b));\n          }\n          return _results1;\n        }).call(this));\n      }\n      return _results;\n    },\n    eachWithObject: function(object, iterator, context) {\n      this.each(function(element, i, self) {\n        return iterator.call(context, element, object, i, self);\n      });\n      return object;\n    },\n    eachSlice: function(n, iterator, context) {\n      var i, len;\n      len = this.length / n;\n      i = -1;\n      while (++i < len) {\n        iterator.call(context, this.slice(i * n, (i + 1) * n), i * n, this);\n      }\n      return this;\n    },\n    pipeline: function(input) {\n      return this.inject(input, function(input, fn) {\n        return fn(input);\n      });\n    },\n    shuffle: function() {\n      var shuffledArray;\n      shuffledArray = [];\n      this.each(function(element) {\n        return shuffledArray.splice(rand(shuffledArray.length + 1), 0, element);\n      });\n      return shuffledArray;\n    },\n    first: function() {\n      return this[0];\n    },\n    last: function() {\n      return this[this.length - 1];\n    },\n    extremes: function(fn) {\n      var max, maxResult, min, minResult;\n      if (fn == null) {\n        fn = identity;\n      }\n      min = max = void 0;\n      minResult = maxResult = void 0;\n      this.each(function(object) {\n        var result;\n        result = fn(object);\n        if (min != null) {\n          if (result < minResult) {\n            min = object;\n            minResult = result;\n          }\n        } else {\n          min = object;\n          minResult = result;\n        }\n        if (max != null) {\n          if (result > maxResult) {\n            max = object;\n            return maxResult = result;\n          }\n        } else {\n          max = object;\n          return maxResult = result;\n        }\n      });\n      return {\n        min: min,\n        max: max\n      };\n    },\n    maxima: function(valueFunction) {\n      if (valueFunction == null) {\n        valueFunction = identity;\n      }\n      return this.inject([-Infinity, []], function(memo, item) {\n        var maxItems, maxValue, value;\n        value = valueFunction(item);\n        maxValue = memo[0], maxItems = memo[1];\n        if (value > maxValue) {\n          return [value, [item]];\n        } else if (value === maxValue) {\n          return [value, maxItems.concat(item)];\n        } else {\n          return memo;\n        }\n      }).last();\n    },\n    maximum: function(valueFunction) {\n      return this.maxima(valueFunction).first();\n    },\n    minima: function(valueFunction) {\n      var inverseFn;\n      if (valueFunction == null) {\n        valueFunction = identity;\n      }\n      inverseFn = function(x) {\n        return -valueFunction(x);\n      };\n      return this.maxima(inverseFn);\n    },\n    minimum: function(valueFunction) {\n      return this.minima(valueFunction).first();\n    },\n    wrap: function(start, length) {\n      var end, i, result;\n      if (length != null) {\n        end = start + length;\n        i = start;\n        result = [];\n        while (i < end) {\n          result.push(this[mod(i, this.length)]);\n          i += 1;\n        }\n        return result;\n      } else {\n        return this[mod(start, this.length)];\n      }\n    },\n    partition: function(iterator, context) {\n      var falseCollection, trueCollection;\n      trueCollection = [];\n      falseCollection = [];\n      this.each(function(element) {\n        if (iterator.call(context, element)) {\n          return trueCollection.push(element);\n        } else {\n          return falseCollection.push(element);\n        }\n      });\n      return [trueCollection, falseCollection];\n    },\n    select: function(iterator, context) {\n      return this.partition(iterator, context)[0];\n    },\n    without: function(values) {\n      return this.reject(function(element) {\n        return values.include(element);\n      });\n    },\n    reject: function(iterator, context) {\n      return this.partition(iterator, context)[1];\n    },\n    inject: function(initial, iterator) {\n      this.each(function(element) {\n        return initial = iterator(initial, element);\n      });\n      return initial;\n    },\n    sum: function() {\n      return this.inject(0, function(sum, n) {\n        return sum + n;\n      });\n    },\n    product: function() {\n      return this.inject(1, function(product, n) {\n        return product * n;\n      });\n    },\n    unique: function() {\n      return this.inject([], function(results, element) {\n        if (results.indexOf(element) === -1) {\n          results.push(element);\n        }\n        return results;\n      });\n    },\n    zip: function() {\n      var args;\n      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];\n      return this.map(function(element, index) {\n        var output;\n        output = args.map(function(arr) {\n          return arr[index];\n        });\n        output.unshift(element);\n        return output;\n      });\n    }\n  });\n\n  identity = function(x) {\n    return x;\n  };\n\n  rand = function(n) {\n    return Math.floor(n * Math.random());\n  };\n\n  mod = function(n, base) {\n    var result;\n    result = n % base;\n    if (result < 0 && base > 0) {\n      result += base;\n    }\n    return result;\n  };\n\n}).call(this);\n\n//# sourceURL=array.coffee",
              "type": "blob"
            },
            "extensions": {
              "path": "extensions",
              "content": "(function() {\n  require(\"./array\");\n\n  require(\"./function\");\n\n  require(\"./number\");\n\n  require(\"./string\");\n\n}).call(this);\n\n//# sourceURL=extensions.coffee",
              "type": "blob"
            },
            "function": {
              "path": "function",
              "content": "(function() {\n  var extend,\n    __slice = [].slice;\n\n  extend = require(\"./util\").extend;\n\n  extend(Function.prototype, {\n    once: function() {\n      var func, memo, ran;\n      func = this;\n      ran = false;\n      memo = void 0;\n      return function() {\n        if (ran) {\n          return memo;\n        }\n        ran = true;\n        return memo = func.apply(this, arguments);\n      };\n    },\n    debounce: function(wait) {\n      var func, timeout;\n      timeout = null;\n      func = this;\n      return function() {\n        var args, context, later;\n        context = this;\n        args = arguments;\n        later = function() {\n          timeout = null;\n          return func.apply(context, args);\n        };\n        clearTimeout(timeout);\n        return timeout = setTimeout(later, wait);\n      };\n    },\n    delay: function() {\n      var args, func, wait;\n      wait = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];\n      func = this;\n      return setTimeout(function() {\n        return func.apply(null, args);\n      }, wait);\n    },\n    defer: function() {\n      var args;\n      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];\n      return this.delay.apply(this, [1].concat(args));\n    }\n  });\n\n  extend(Function, {\n    identity: function(x) {\n      return x;\n    },\n    noop: function() {}\n  });\n\n}).call(this);\n\n//# sourceURL=function.coffee",
              "type": "blob"
            },
            "number": {
              "path": "number",
              "content": "(function() {\n  var extend;\n\n  [\"abs\", \"ceil\", \"floor\", \"round\"].forEach(function(method) {\n    return Number.prototype[method] = function() {\n      return Math[method](this);\n    };\n  });\n\n  extend = require(\"./util\").extend;\n\n  extend(Number.prototype, {\n    circularPoints: function() {\n      var n, _i, _results;\n      n = this;\n      return (function() {\n        _results = [];\n        for (var _i = 0; 0 <= n ? _i <= n : _i >= n; 0 <= n ? _i++ : _i--){ _results.push(_i); }\n        return _results;\n      }).apply(this).map(function(i) {\n        return Point.fromAngle((i / n).turns);\n      });\n    },\n    clamp: function(min, max) {\n      if ((min != null) && (max != null)) {\n        return Math.min(Math.max(this, min), max);\n      } else if (min != null) {\n        return Math.max(this, min);\n      } else if (max != null) {\n        return Math.min(this, max);\n      } else {\n        return this;\n      }\n    },\n    mod: function(base) {\n      var result;\n      result = this % base;\n      if (result < 0 && base > 0) {\n        result += base;\n      }\n      return result;\n    },\n    sign: function() {\n      if (this > 0) {\n        return 1;\n      } else if (this < 0) {\n        return -1;\n      } else {\n        return 0;\n      }\n    },\n    even: function() {\n      return this.mod(2) === 0;\n    },\n    odd: function() {\n      return this.mod(2) === 1;\n    },\n    times: function(iterator, context) {\n      var i;\n      i = -1;\n      while (++i < this) {\n        iterator.call(context, i);\n      }\n      return i;\n    },\n    snap: function(resolution) {\n      return (n / resolution).floor() * resolution;\n    },\n    truncate: function() {\n      if (this > 0) {\n        return this.floor();\n      } else if (this < 0) {\n        return this.ceil();\n      } else {\n        return this;\n      }\n    }\n  });\n\n  if (!5..rotations) {\n    Object.defineProperty(Number.prototype, 'rotations', {\n      get: function() {\n        return this * Math.TAU;\n      }\n    });\n  }\n\n  if (!1..rotation) {\n    Object.defineProperty(Number.prototype, 'rotation', {\n      get: function() {\n        return this * Math.TAU;\n      }\n    });\n  }\n\n  if (!5..turns) {\n    Object.defineProperty(Number.prototype, 'turns', {\n      get: function() {\n        return this * Math.TAU;\n      }\n    });\n  }\n\n  if (!1..turn) {\n    Object.defineProperty(Number.prototype, 'turn', {\n      get: function() {\n        return this * Math.TAU;\n      }\n    });\n  }\n\n  if (!2..degrees) {\n    Object.defineProperty(Number.prototype, 'degrees', {\n      get: function() {\n        return this * Math.TAU / 360;\n      }\n    });\n  }\n\n  if (!1..degree) {\n    Object.defineProperty(Number.prototype, 'degree', {\n      get: function() {\n        return this * Math.TAU / 360;\n      }\n    });\n  }\n\n  Math.TAU = 2 * Math.PI;\n\n}).call(this);\n\n//# sourceURL=number.coffee",
              "type": "blob"
            },
            "pixie": {
              "path": "pixie",
              "content": "module.exports = {\"version\":\"0.2.0\",\"entryPoint\":\"extensions\"};",
              "type": "blob"
            },
            "string": {
              "path": "string",
              "content": "(function() {\n  var extend;\n\n  extend = require(\"./util\").extend;\n\n  extend(String.prototype, {\n    blank: function() {\n      return /^\\s*$/.test(this);\n    },\n    parse: function() {\n      var e;\n      try {\n        return JSON.parse(this.toString());\n      } catch (_error) {\n        e = _error;\n        return this.toString();\n      }\n    },\n    startsWith: function(str) {\n      return this.lastIndexOf(str, 0) === 0;\n    },\n    endsWith: function(str) {\n      return this.indexOf(str, this.length - str.length) !== -1;\n    },\n    extension: function() {\n      var extension, _ref;\n      if (extension = (_ref = this.match(/\\.([^\\.]*)$/, '')) != null ? _ref.last() : void 0) {\n        return extension;\n      } else {\n        return '';\n      }\n    },\n    withoutExtension: function() {\n      return this.replace(/\\.[^\\.]*$/, '');\n    },\n    toInt: function(base) {\n      if (base == null) {\n        base = 10;\n      }\n      return parseInt(this, base);\n    }\n  });\n\n}).call(this);\n\n//# sourceURL=string.coffee",
              "type": "blob"
            },
            "test/array": {
              "path": "test/array",
              "content": "(function() {\n  var equals, ok, test;\n\n  require(\"../array\");\n\n  ok = assert;\n\n  equals = assert.equal;\n\n  test = it;\n\n  describe(\"Array\", function() {\n    test(\"#average\", function() {\n      return equals([1, 3, 5, 7].average(), 4);\n    });\n    test(\"#compact\", function() {\n      var a, compacted;\n      a = [0, 1, void 0, 2, null, 3, '', 4];\n      compacted = a.compact();\n      equals(compacted[0], 0);\n      equals(compacted[1], 1);\n      equals(compacted[2], 2);\n      equals(compacted[3], 3);\n      equals(compacted[4], '');\n      return equals(compacted[5], 4);\n    });\n    test(\"#copy\", function() {\n      var a, b;\n      a = [1, 2, 3];\n      b = a.copy();\n      ok(a !== b, \"Original array is not the same array as the copied one\");\n      ok(a.length === b.length, \"Both arrays are the same size\");\n      return ok(a[0] === b[0] && a[1] === b[1] && a[2] === b[2], \"The elements of the two arrays are equal\");\n    });\n    test(\"#flatten\", function() {\n      var array, flattenedArray;\n      array = [[0, 1], [2, 3], [4, 5]];\n      flattenedArray = array.flatten();\n      equals(flattenedArray.length, 6, \"Flattened array length should equal number of elements in sub-arrays\");\n      equals(flattenedArray.first(), 0, \"First element should be first element in first sub-array\");\n      return equals(flattenedArray.last(), 5, \"Last element should be last element in last sub-array\");\n    });\n    test(\"#rand\", function() {\n      var array;\n      array = [1, 2, 3];\n      ok(array.indexOf(array.rand()) !== -1, \"Array includes randomly selected element\");\n      ok([5].rand() === 5, \"[5].rand() === 5\");\n      return ok([].rand() === void 0, \"[].rand() === undefined\");\n    });\n    test(\"#remove\", function() {\n      var array;\n      equals([1, 2, 3].remove(2), 2, \"[1,2,3].remove(2) === 2\");\n      equals([1, 3].remove(2), void 0, \"[1,3].remove(2) === undefined\");\n      equals([1, 3].remove(3), 3, \"[1,3].remove(3) === 3\");\n      array = [1, 2, 3];\n      array.remove(2);\n      ok(array.length === 2, \"array = [1,2,3]; array.remove(2); array.length === 2\");\n      array.remove(3);\n      return ok(array.length === 1, \"array = [1,3]; array.remove(3); array.length === 1\");\n    });\n    test(\"#map\", function() {\n      return equals([1].map(function(x) {\n        return x + 1;\n      })[0], 2);\n    });\n    test(\"#invoke\", function() {\n      var results;\n      results = ['hello', 'world', 'cool!'].invoke('substring', 0, 3);\n      equals(results[0], \"hel\");\n      equals(results[1], \"wor\");\n      return equals(results[2], \"coo\");\n    });\n    test(\"#each\", function() {\n      var array, count;\n      array = [1, 2, 3];\n      count = 0;\n      equals(array, array.each(function() {\n        return count++;\n      }));\n      return equals(array.length, count);\n    });\n    test(\"#eachPair\", function() {\n      var array, sum;\n      array = [1, 2, 3];\n      sum = 0;\n      array.eachPair(function(a, b) {\n        return sum += a + b;\n      });\n      return equals(sum, 12);\n    });\n    test(\"#eachWithObject\", function() {\n      var array, result;\n      array = [1, 2, 3];\n      result = array.eachWithObject({}, function(element, hash) {\n        return hash[element] = (element + 1).toString();\n      });\n      equals(result[1], \"2\");\n      equals(result[2], \"3\");\n      return equals(result[3], \"4\");\n    });\n    test(\"#shuffle\", function() {\n      var array, shuffledArray;\n      array = [0, 1, 2, 3, 4, 5];\n      shuffledArray = array.shuffle();\n      shuffledArray.each(function(element) {\n        return ok(array.indexOf(element) >= 0, \"Every element in shuffled array is in orig array\");\n      });\n      return array.each(function(element) {\n        return ok(shuffledArray.indexOf(element) >= 0, \"Every element in orig array is in shuffled array\");\n      });\n    });\n    test(\"#first\", function() {\n      equals([2].first(), 2);\n      equals([1, 2, 3].first(), 1);\n      return equals([].first(), void 0);\n    });\n    test(\"#last\", function() {\n      equals([2].last(), 2);\n      equals([1, 2, 3].last(), 3);\n      return equals([].first(), void 0);\n    });\n    test(\"#maxima\", function() {\n      var maxima;\n      maxima = [-52, 0, 78].maxima();\n      maxima.each(function(n) {\n        return equals(n, 78);\n      });\n      maxima = [0, 0, 1, 0, 1, 0, 1, 0].maxima();\n      equals(3, maxima.length);\n      return maxima.each(function(n) {\n        return equals(n, 1);\n      });\n    });\n    test(\"#maximum\", function() {\n      return equals([-345, 38, 8347].maximum(), 8347);\n    });\n    test(\"#maximum with function\", function() {\n      return equals([3, 4, 5].maximum(function(n) {\n        return n % 4;\n      }), 3);\n    });\n    test(\"#minima\", function() {\n      var minima;\n      minima = [-52, 0, 78].minima();\n      minima.each(function(n) {\n        return equals(n, -52);\n      });\n      minima = [0, 0, 1, 0, 1, 0, 1, 0].minima();\n      equals(5, minima.length);\n      return minima.each(function(n) {\n        return equals(n, 0);\n      });\n    });\n    test(\"#minimum\", function() {\n      return equals([-345, 38, 8347].minimum(), -345);\n    });\n    test(\"#pipeline\", function() {\n      var pipe;\n      pipe = [\n        function(x) {\n          return x * x;\n        }, function(x) {\n          return x - 10;\n        }\n      ];\n      return equals(pipe.pipeline(5), 15);\n    });\n    test(\"#extremes\", function() {\n      var array, extremes;\n      array = [-7, 1, 11, 94];\n      extremes = array.extremes();\n      equals(extremes.min, -7, \"Min is -7\");\n      return equals(extremes.max, 94, \"Max is 94\");\n    });\n    test(\"#extremes with fn\", function() {\n      var array, extremes;\n      array = [1, 11, 94];\n      extremes = array.extremes(function(value) {\n        return value % 11;\n      });\n      equals(extremes.min, 11, extremes.min);\n      return equals(extremes.max, 94, extremes.max);\n    });\n    test(\"#sum\", function() {\n      equals([].sum(), 0, \"Empty array sums to zero\");\n      equals([2].sum(), 2, \"[2] sums to 2\");\n      return equals([1, 2, 3, 4, 5].sum(), 15, \"[1, 2, 3, 4, 5] sums to 15\");\n    });\n    test(\"#eachSlice\", function() {\n      return [1, 2, 3, 4, 5, 6].eachSlice(2, function(array) {\n        equals(array[0] % 2, 1);\n        return equals(array[1] % 2, 0);\n      });\n    });\n    test(\"#without\", function() {\n      var array, excluded;\n      array = [1, 2, 3, 4];\n      excluded = array.without([2, 4]);\n      equals(excluded[0], 1);\n      return equals(excluded[1], 3);\n    });\n    test(\"#clear\", function() {\n      var array;\n      array = [1, 2, 3, 4];\n      equals(array.length, 4);\n      equals(array[0], 1);\n      array.clear();\n      equals(array.length, 0);\n      return equals(array[0], void 0);\n    });\n    test(\"#unique\", function() {\n      var array;\n      array = [0, 0, 0, 1, 1, 1, 2, 3];\n      equals(array.unique().first(), 0);\n      equals(array.unique().last(), 3);\n      return equals(array.unique().length, 4);\n    });\n    test(\"#wrap\", function() {\n      var array;\n      array = [0, 1, 2, 3, 4];\n      equals(array.wrap(0), 0);\n      equals(array.wrap(-1), 4);\n      return equals(array.wrap(2), 2);\n    });\n    return test(\"#zip\", function() {\n      var a, b, c, output;\n      a = [1, 2, 3];\n      b = [4, 5, 6];\n      c = [7, 8];\n      output = a.zip(b, c);\n      equals(output[0][0], 1);\n      equals(output[0][1], 4);\n      equals(output[0][2], 7);\n      return equals(output[2][2], void 0);\n    });\n  });\n\n}).call(this);\n\n//# sourceURL=test/array.coffee",
              "type": "blob"
            },
            "test/function": {
              "path": "test/function",
              "content": "(function() {\n  var equals, ok, test;\n\n  require(\"../function\");\n\n  ok = assert;\n\n  equals = assert.equal;\n\n  test = it;\n\n  describe(\"Function\", function() {\n    test(\"#once\", function() {\n      var addScore, onceScore, score;\n      score = 0;\n      addScore = function() {\n        return score += 100;\n      };\n      onceScore = addScore.once();\n      [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(function() {\n        return onceScore();\n      });\n      return equals(score, 100);\n    });\n    test(\".identity\", function() {\n      var I;\n      I = Function.identity;\n      return [0, 1, true, false, null, void 0].each(function(x) {\n        return equals(I(x), x);\n      });\n    });\n    test(\"#debounce\", function(done) {\n      var fn;\n      fn = (function() {\n        ok(true);\n        return done();\n      }).debounce(1);\n      fn();\n      fn();\n      return fn();\n    });\n    test(\"#delay\", function(done) {\n      var fn;\n      fn = function(x, y) {\n        equals(x, 3);\n        equals(y, \"testy\");\n        return done();\n      };\n      return fn.delay(25, 3, \"testy\");\n    });\n    return test(\"#defer\", function(done) {\n      var fn;\n      fn = function(x) {\n        equals(x, 3);\n        return done();\n      };\n      return fn.defer(3);\n    });\n  });\n\n}).call(this);\n\n//# sourceURL=test/function.coffee",
              "type": "blob"
            },
            "test/number": {
              "path": "test/number",
              "content": "(function() {\n  var equalEnough, equals, ok, test;\n\n  require(\"../number\");\n\n  ok = assert;\n\n  equals = assert.equal;\n\n  test = it;\n\n  equalEnough = function(expected, actual, tolerance, message) {\n    message || (message = \"\" + expected + \" within \" + tolerance + \" of \" + actual);\n    return ok(expected + tolerance >= actual && expected - tolerance <= actual, message);\n  };\n\n  describe(\"Number\", function() {\n    test(\"#abs\", function() {\n      equals(5..abs(), 5, \"(5).abs() equals 5\");\n      equals(4.2.abs(), 4.2, \"(4.2).abs() equals 4.2\");\n      equals((-1.2).abs(), 1.2, \"(-1.2).abs() equals 1.2\");\n      return equals(0..abs(), 0, \"(0).abs() equals 0\");\n    });\n    test(\"#ceil\", function() {\n      equals(4.9.ceil(), 5, \"(4.9).floor() equals 5\");\n      equals(4.2.ceil(), 5, \"(4.2).ceil() equals 5\");\n      equals((-1.2).ceil(), -1, \"(-1.2).ceil() equals -1\");\n      return equals(3..ceil(), 3, \"(3).ceil() equals 3\");\n    });\n    test(\"#clamp\", function() {\n      equals(5..clamp(0, 3), 3);\n      equals(5..clamp(-1, 0), 0);\n      equals((-5).clamp(0, 1), 0);\n      equals(1..clamp(0, null), 1);\n      equals((-1).clamp(0, null), 0);\n      equals((-10).clamp(-5, 0), -5);\n      equals((-10).clamp(null, 0), -10);\n      return equals(50..clamp(null, 10), 10);\n    });\n    test(\"#floor\", function() {\n      equals(4.9.floor(), 4, \"(4.9).floor() equals 4\");\n      equals(4.2.floor(), 4, \"(4.2).floor() equals 4\");\n      equals((-1.2).floor(), -2, \"(-1.2).floor() equals -2\");\n      return equals(3..floor(), 3, \"(3).floor() equals 3\");\n    });\n    test(\"#round\", function() {\n      equals(4.5.round(), 5, \"(4.5).round() equals 5\");\n      return equals(4.4.round(), 4, \"(4.4).round() equals 4\");\n    });\n    test(\"#sign\", function() {\n      equals(5..sign(), 1, \"Positive number's sign is 1\");\n      equals((-3).sign(), -1, \"Negative number's sign is -1\");\n      return equals(0..sign(), 0, \"Zero's sign is 0\");\n    });\n    test(\"#even\", function() {\n      [0, 2, -32].each(function(n) {\n        return ok(n.even(), \"\" + n + \" is even\");\n      });\n      return [1, -1, 2.2, -3.784].each(function(n) {\n        return equals(n.even(), false, \"\" + n + \" is not even\");\n      });\n    });\n    test(\"#odd\", function() {\n      [1, 9, -37].each(function(n) {\n        return ok(n.odd(), \"\" + n + \" is odd\");\n      });\n      return [0, 32, 2.2, -1.1].each(function(n) {\n        return equals(n.odd(), false, \"\" + n + \" is not odd\");\n      });\n    });\n    test(\"#times\", function() {\n      var n;\n      n = 5;\n      return equals(n.times(function() {}), n, \"returns n\");\n    });\n    test(\"#times called correct amount\", function() {\n      var count, n;\n      n = 5;\n      count = 0;\n      n.times(function() {\n        return count++;\n      });\n      return equals(n, count, \"returns n\");\n    });\n    test(\"#mod should have a positive result when used with a positive base and a negative number\", function() {\n      var n;\n      n = -3;\n      return equals(n.mod(8), 5, \"Should 'wrap' and be positive.\");\n    });\n    test(\"#degrees\", function() {\n      equals(180..degrees, Math.PI);\n      return equals(1..degree, Math.TAU / 360);\n    });\n    test(\"#rotations\", function() {\n      equals(1..rotation, Math.TAU);\n      return equals(0.5.rotations, Math.TAU / 2);\n    });\n    return test(\"#turns\", function() {\n      equals(1..turn, Math.TAU);\n      return equals(0.5.turns, Math.TAU / 2);\n    });\n  });\n\n}).call(this);\n\n//# sourceURL=test/number.coffee",
              "type": "blob"
            },
            "test/string": {
              "path": "test/string",
              "content": "(function() {\n  var equals, ok, test;\n\n  require(\"../string\");\n\n  ok = assert;\n\n  equals = assert.equal;\n\n  test = it;\n\n  describe(\"String\", function() {\n    test(\"#blank\", function() {\n      equals(\"  \".blank(), true, \"A string containing only whitespace should be blank\");\n      equals(\"a\".blank(), false, \"A string that contains a letter should not be blank\");\n      equals(\"  a \".blank(), false);\n      return equals(\"  \\n\\t \".blank(), true);\n    });\n    test(\"#extension\", function() {\n      equals(\"README\".extension(), \"\");\n      equals(\"README.md\".extension(), \"md\");\n      equals(\"jquery.min.js\".extension(), \"js\");\n      return equals(\"src/bouse.js.coffee\".extension(), \"coffee\");\n    });\n    test(\"#parse\", function() {\n      equals(\"true\".parse(), true, \"parsing 'true' should equal boolean true\");\n      equals(\"false\".parse(), false, \"parsing 'true' should equal boolean true\");\n      equals(\"7.2\".parse(), 7.2, \"numbers should be cool too\");\n      equals('{\"val\": \"a string\"}'.parse().val, \"a string\", \"even parsing objects works\");\n      return ok(''.parse() === '', \"Empty string parses to exactly the empty string\");\n    });\n    test(\"#startsWith\", function() {\n      ok(\"cool\".startsWith(\"coo\"));\n      return equals(\"cool\".startsWith(\"oo\"), false);\n    });\n    test(\"#toInt\", function() {\n      equals(\"31.3\".toInt(), 31);\n      equals(\"31.\".toInt(), 31);\n      equals(\"-1.02\".toInt(), -1);\n      equals(\"009\".toInt(), 9);\n      equals(\"0109\".toInt(), 109);\n      return equals(\"F\".toInt(16), 15);\n    });\n    return test(\"#withoutExtension\", function() {\n      equals(\"neat.png\".withoutExtension(), \"neat\");\n      return equals(\"not a file\".withoutExtension(), \"not a file\");\n    });\n  });\n\n}).call(this);\n\n//# sourceURL=test/string.coffee",
              "type": "blob"
            },
            "util": {
              "path": "util",
              "content": "(function() {\n  var __slice = [].slice;\n\n  module.exports = {\n    extend: function() {\n      var name, source, sources, target, _i, _len;\n      target = arguments[0], sources = 2 <= arguments.length ? __slice.call(arguments, 1) : [];\n      for (_i = 0, _len = sources.length; _i < _len; _i++) {\n        source = sources[_i];\n        for (name in source) {\n          target[name] = source[name];\n        }\n      }\n      return target;\n    }\n  };\n\n}).call(this);\n\n//# sourceURL=util.coffee",
              "type": "blob"
            }
          },
          "progenitor": {
            "url": "http://strd6.github.io/editor/"
          },
          "version": "0.2.0",
          "entryPoint": "extensions",
          "repository": {
            "id": 13577503,
            "name": "extensions",
            "full_name": "distri/extensions",
            "owner": {
              "login": "distri",
              "id": 6005125,
              "avatar_url": "https://identicons.github.com/f90c81ffc1498e260c820082f2e7ca5f.png",
              "gravatar_id": null,
              "url": "https://api.github.com/users/distri",
              "html_url": "https://github.com/distri",
              "followers_url": "https://api.github.com/users/distri/followers",
              "following_url": "https://api.github.com/users/distri/following{/other_user}",
              "gists_url": "https://api.github.com/users/distri/gists{/gist_id}",
              "starred_url": "https://api.github.com/users/distri/starred{/owner}{/repo}",
              "subscriptions_url": "https://api.github.com/users/distri/subscriptions",
              "organizations_url": "https://api.github.com/users/distri/orgs",
              "repos_url": "https://api.github.com/users/distri/repos",
              "events_url": "https://api.github.com/users/distri/events{/privacy}",
              "received_events_url": "https://api.github.com/users/distri/received_events",
              "type": "Organization",
              "site_admin": false
            },
            "private": false,
            "html_url": "https://github.com/distri/extensions",
            "description": "",
            "fork": false,
            "url": "https://api.github.com/repos/distri/extensions",
            "forks_url": "https://api.github.com/repos/distri/extensions/forks",
            "keys_url": "https://api.github.com/repos/distri/extensions/keys{/key_id}",
            "collaborators_url": "https://api.github.com/repos/distri/extensions/collaborators{/collaborator}",
            "teams_url": "https://api.github.com/repos/distri/extensions/teams",
            "hooks_url": "https://api.github.com/repos/distri/extensions/hooks",
            "issue_events_url": "https://api.github.com/repos/distri/extensions/issues/events{/number}",
            "events_url": "https://api.github.com/repos/distri/extensions/events",
            "assignees_url": "https://api.github.com/repos/distri/extensions/assignees{/user}",
            "branches_url": "https://api.github.com/repos/distri/extensions/branches{/branch}",
            "tags_url": "https://api.github.com/repos/distri/extensions/tags",
            "blobs_url": "https://api.github.com/repos/distri/extensions/git/blobs{/sha}",
            "git_tags_url": "https://api.github.com/repos/distri/extensions/git/tags{/sha}",
            "git_refs_url": "https://api.github.com/repos/distri/extensions/git/refs{/sha}",
            "trees_url": "https://api.github.com/repos/distri/extensions/git/trees{/sha}",
            "statuses_url": "https://api.github.com/repos/distri/extensions/statuses/{sha}",
            "languages_url": "https://api.github.com/repos/distri/extensions/languages",
            "stargazers_url": "https://api.github.com/repos/distri/extensions/stargazers",
            "contributors_url": "https://api.github.com/repos/distri/extensions/contributors",
            "subscribers_url": "https://api.github.com/repos/distri/extensions/subscribers",
            "subscription_url": "https://api.github.com/repos/distri/extensions/subscription",
            "commits_url": "https://api.github.com/repos/distri/extensions/commits{/sha}",
            "git_commits_url": "https://api.github.com/repos/distri/extensions/git/commits{/sha}",
            "comments_url": "https://api.github.com/repos/distri/extensions/comments{/number}",
            "issue_comment_url": "https://api.github.com/repos/distri/extensions/issues/comments/{number}",
            "contents_url": "https://api.github.com/repos/distri/extensions/contents/{+path}",
            "compare_url": "https://api.github.com/repos/distri/extensions/compare/{base}...{head}",
            "merges_url": "https://api.github.com/repos/distri/extensions/merges",
            "archive_url": "https://api.github.com/repos/distri/extensions/{archive_format}{/ref}",
            "downloads_url": "https://api.github.com/repos/distri/extensions/downloads",
            "issues_url": "https://api.github.com/repos/distri/extensions/issues{/number}",
            "pulls_url": "https://api.github.com/repos/distri/extensions/pulls{/number}",
            "milestones_url": "https://api.github.com/repos/distri/extensions/milestones{/number}",
            "notifications_url": "https://api.github.com/repos/distri/extensions/notifications{?since,all,participating}",
            "labels_url": "https://api.github.com/repos/distri/extensions/labels{/name}",
            "releases_url": "https://api.github.com/repos/distri/extensions/releases{/id}",
            "created_at": "2013-10-15T01:14:11Z",
            "updated_at": "2013-12-24T01:04:48Z",
            "pushed_at": "2013-12-24T01:04:20Z",
            "git_url": "git://github.com/distri/extensions.git",
            "ssh_url": "git@github.com:distri/extensions.git",
            "clone_url": "https://github.com/distri/extensions.git",
            "svn_url": "https://github.com/distri/extensions",
            "homepage": null,
            "size": 964,
            "stargazers_count": 0,
            "watchers_count": 0,
            "language": "CoffeeScript",
            "has_issues": true,
            "has_downloads": true,
            "has_wiki": true,
            "forks_count": 0,
            "mirror_url": null,
            "open_issues_count": 0,
            "forks": 0,
            "open_issues": 0,
            "watchers": 0,
            "default_branch": "master",
            "master_branch": "master",
            "permissions": {
              "admin": true,
              "push": true,
              "pull": true
            },
            "organization": {
              "login": "distri",
              "id": 6005125,
              "avatar_url": "https://identicons.github.com/f90c81ffc1498e260c820082f2e7ca5f.png",
              "gravatar_id": null,
              "url": "https://api.github.com/users/distri",
              "html_url": "https://github.com/distri",
              "followers_url": "https://api.github.com/users/distri/followers",
              "following_url": "https://api.github.com/users/distri/following{/other_user}",
              "gists_url": "https://api.github.com/users/distri/gists{/gist_id}",
              "starred_url": "https://api.github.com/users/distri/starred{/owner}{/repo}",
              "subscriptions_url": "https://api.github.com/users/distri/subscriptions",
              "organizations_url": "https://api.github.com/users/distri/orgs",
              "repos_url": "https://api.github.com/users/distri/repos",
              "events_url": "https://api.github.com/users/distri/events{/privacy}",
              "received_events_url": "https://api.github.com/users/distri/received_events",
              "type": "Organization",
              "site_admin": false
            },
            "network_count": 0,
            "subscribers_count": 1,
            "branch": "v0.2.0",
            "defaultBranch": "master"
          },
          "dependencies": {}
        },
        "math": {
          "source": {
            "LICENSE": {
              "path": "LICENSE",
              "mode": "100644",
              "content": "The MIT License (MIT)\n\nCopyright (c) 2013 Daniel X Moore\n\nPermission is hereby granted, free of charge, to any person obtaining a copy of\nthis software and associated documentation files (the \"Software\"), to deal in\nthe Software without restriction, including without limitation the rights to\nuse, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of\nthe Software, and to permit persons to whom the Software is furnished to do so,\nsubject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS\nFOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR\nCOPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER\nIN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN\nCONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.\n",
              "type": "blob"
            },
            "README.md": {
              "path": "README.md",
              "mode": "100644",
              "content": "math\n====\n\nMath is for cool guys.\n",
              "type": "blob"
            },
            "math.coffee.md": {
              "path": "math.coffee.md",
              "mode": "100644",
              "content": "Math\n====\n\nRequire and export many math libraries.\n\n    Point = require \"point\"\n\n    Matrix = require \"matrix\"\n    Matrix.Point = Point\n\n    Random = require \"random\"\n\n    module.exports = self =\n      Point: Point\n      Matrix: Matrix\n      Random: Random\n      rand: Random.rand\n\nPollute all libraries to the global namespace.\n\n      pollute: ->\n        Object.keys(self).forEach (key) ->\n          return if key is \"version\"\n          return if key is \"pollute\"\n\n          global[key] = self[key]\n\n        return self\n",
              "type": "blob"
            },
            "pixie.cson": {
              "path": "pixie.cson",
              "mode": "100644",
              "content": "entryPoint: \"math\"\nversion: \"0.2.0\"\ndependencies:\n  point: \"distri/point:v0.2.0\"\n  matrix: \"distri/matrix:v0.3.1\"\n  random: \"distri/random:v0.2.0\"\n",
              "type": "blob"
            },
            "test/math.coffee": {
              "path": "test/math.coffee",
              "mode": "100644",
              "content": "require(\"../math\").pollute()\n\nconsole.log global\n\ndescribe \"Point\", ->\n  it \"should exist\", ->\n    assert Point\n\n  it \"should construct points\", ->\n    assert Point()\n\ndescribe \"Matrix\", ->\n  it \"should exist and return matrices when invoked\", ->\n    assert Matrix\n\n    assert Matrix()\n\n  it \"should use the same `Point` class\", ->\n    assert Matrix.Point is Point\n\n    assert Matrix().transformPoint(Point()) instanceof Point\n\ndescribe \"Random\", ->\n  it \"should exist\", ->\n    assert Random\n\ndescribe \"rand\", ->\n  it \"should exist\", ->\n    assert rand\n\n    assert rand()?\n",
              "type": "blob"
            }
          },
          "distribution": {
            "math": {
              "path": "math",
              "content": "(function() {\n  var Matrix, Point, Random, self;\n\n  Point = require(\"point\");\n\n  Matrix = require(\"matrix\");\n\n  Matrix.Point = Point;\n\n  Random = require(\"random\");\n\n  module.exports = self = {\n    Point: Point,\n    Matrix: Matrix,\n    Random: Random,\n    rand: Random.rand,\n    pollute: function() {\n      Object.keys(self).forEach(function(key) {\n        if (key === \"version\") {\n          return;\n        }\n        if (key === \"pollute\") {\n          return;\n        }\n        return global[key] = self[key];\n      });\n      return self;\n    }\n  };\n\n}).call(this);\n\n//# sourceURL=math.coffee",
              "type": "blob"
            },
            "pixie": {
              "path": "pixie",
              "content": "module.exports = {\"entryPoint\":\"math\",\"version\":\"0.2.0\",\"dependencies\":{\"point\":\"distri/point:v0.2.0\",\"matrix\":\"distri/matrix:v0.3.1\",\"random\":\"distri/random:v0.2.0\"}};",
              "type": "blob"
            },
            "test/math": {
              "path": "test/math",
              "content": "(function() {\n  require(\"../math\").pollute();\n\n  console.log(global);\n\n  describe(\"Point\", function() {\n    it(\"should exist\", function() {\n      return assert(Point);\n    });\n    return it(\"should construct points\", function() {\n      return assert(Point());\n    });\n  });\n\n  describe(\"Matrix\", function() {\n    it(\"should exist and return matrices when invoked\", function() {\n      assert(Matrix);\n      return assert(Matrix());\n    });\n    return it(\"should use the same `Point` class\", function() {\n      assert(Matrix.Point === Point);\n      return assert(Matrix().transformPoint(Point()) instanceof Point);\n    });\n  });\n\n  describe(\"Random\", function() {\n    return it(\"should exist\", function() {\n      return assert(Random);\n    });\n  });\n\n  describe(\"rand\", function() {\n    return it(\"should exist\", function() {\n      assert(rand);\n      return assert(rand() != null);\n    });\n  });\n\n}).call(this);\n\n//# sourceURL=test/math.coffee",
              "type": "blob"
            }
          },
          "progenitor": {
            "url": "http://strd6.github.io/editor/"
          },
          "version": "0.2.0",
          "entryPoint": "math",
          "repository": {
            "id": 13576636,
            "name": "math",
            "full_name": "distri/math",
            "owner": {
              "login": "distri",
              "id": 6005125,
              "avatar_url": "https://identicons.github.com/f90c81ffc1498e260c820082f2e7ca5f.png",
              "gravatar_id": null,
              "url": "https://api.github.com/users/distri",
              "html_url": "https://github.com/distri",
              "followers_url": "https://api.github.com/users/distri/followers",
              "following_url": "https://api.github.com/users/distri/following{/other_user}",
              "gists_url": "https://api.github.com/users/distri/gists{/gist_id}",
              "starred_url": "https://api.github.com/users/distri/starred{/owner}{/repo}",
              "subscriptions_url": "https://api.github.com/users/distri/subscriptions",
              "organizations_url": "https://api.github.com/users/distri/orgs",
              "repos_url": "https://api.github.com/users/distri/repos",
              "events_url": "https://api.github.com/users/distri/events{/privacy}",
              "received_events_url": "https://api.github.com/users/distri/received_events",
              "type": "Organization",
              "site_admin": false
            },
            "private": false,
            "html_url": "https://github.com/distri/math",
            "description": "Math is for cool guys.",
            "fork": false,
            "url": "https://api.github.com/repos/distri/math",
            "forks_url": "https://api.github.com/repos/distri/math/forks",
            "keys_url": "https://api.github.com/repos/distri/math/keys{/key_id}",
            "collaborators_url": "https://api.github.com/repos/distri/math/collaborators{/collaborator}",
            "teams_url": "https://api.github.com/repos/distri/math/teams",
            "hooks_url": "https://api.github.com/repos/distri/math/hooks",
            "issue_events_url": "https://api.github.com/repos/distri/math/issues/events{/number}",
            "events_url": "https://api.github.com/repos/distri/math/events",
            "assignees_url": "https://api.github.com/repos/distri/math/assignees{/user}",
            "branches_url": "https://api.github.com/repos/distri/math/branches{/branch}",
            "tags_url": "https://api.github.com/repos/distri/math/tags",
            "blobs_url": "https://api.github.com/repos/distri/math/git/blobs{/sha}",
            "git_tags_url": "https://api.github.com/repos/distri/math/git/tags{/sha}",
            "git_refs_url": "https://api.github.com/repos/distri/math/git/refs{/sha}",
            "trees_url": "https://api.github.com/repos/distri/math/git/trees{/sha}",
            "statuses_url": "https://api.github.com/repos/distri/math/statuses/{sha}",
            "languages_url": "https://api.github.com/repos/distri/math/languages",
            "stargazers_url": "https://api.github.com/repos/distri/math/stargazers",
            "contributors_url": "https://api.github.com/repos/distri/math/contributors",
            "subscribers_url": "https://api.github.com/repos/distri/math/subscribers",
            "subscription_url": "https://api.github.com/repos/distri/math/subscription",
            "commits_url": "https://api.github.com/repos/distri/math/commits{/sha}",
            "git_commits_url": "https://api.github.com/repos/distri/math/git/commits{/sha}",
            "comments_url": "https://api.github.com/repos/distri/math/comments{/number}",
            "issue_comment_url": "https://api.github.com/repos/distri/math/issues/comments/{number}",
            "contents_url": "https://api.github.com/repos/distri/math/contents/{+path}",
            "compare_url": "https://api.github.com/repos/distri/math/compare/{base}...{head}",
            "merges_url": "https://api.github.com/repos/distri/math/merges",
            "archive_url": "https://api.github.com/repos/distri/math/{archive_format}{/ref}",
            "downloads_url": "https://api.github.com/repos/distri/math/downloads",
            "issues_url": "https://api.github.com/repos/distri/math/issues{/number}",
            "pulls_url": "https://api.github.com/repos/distri/math/pulls{/number}",
            "milestones_url": "https://api.github.com/repos/distri/math/milestones{/number}",
            "notifications_url": "https://api.github.com/repos/distri/math/notifications{?since,all,participating}",
            "labels_url": "https://api.github.com/repos/distri/math/labels{/name}",
            "releases_url": "https://api.github.com/repos/distri/math/releases{/id}",
            "created_at": "2013-10-15T00:13:24Z",
            "updated_at": "2013-12-23T23:29:58Z",
            "pushed_at": "2013-10-15T18:45:48Z",
            "git_url": "git://github.com/distri/math.git",
            "ssh_url": "git@github.com:distri/math.git",
            "clone_url": "https://github.com/distri/math.git",
            "svn_url": "https://github.com/distri/math",
            "homepage": null,
            "size": 364,
            "stargazers_count": 0,
            "watchers_count": 0,
            "language": "CoffeeScript",
            "has_issues": true,
            "has_downloads": true,
            "has_wiki": true,
            "forks_count": 0,
            "mirror_url": null,
            "open_issues_count": 0,
            "forks": 0,
            "open_issues": 0,
            "watchers": 0,
            "default_branch": "master",
            "master_branch": "master",
            "permissions": {
              "admin": true,
              "push": true,
              "pull": true
            },
            "organization": {
              "login": "distri",
              "id": 6005125,
              "avatar_url": "https://identicons.github.com/f90c81ffc1498e260c820082f2e7ca5f.png",
              "gravatar_id": null,
              "url": "https://api.github.com/users/distri",
              "html_url": "https://github.com/distri",
              "followers_url": "https://api.github.com/users/distri/followers",
              "following_url": "https://api.github.com/users/distri/following{/other_user}",
              "gists_url": "https://api.github.com/users/distri/gists{/gist_id}",
              "starred_url": "https://api.github.com/users/distri/starred{/owner}{/repo}",
              "subscriptions_url": "https://api.github.com/users/distri/subscriptions",
              "organizations_url": "https://api.github.com/users/distri/orgs",
              "repos_url": "https://api.github.com/users/distri/repos",
              "events_url": "https://api.github.com/users/distri/events{/privacy}",
              "received_events_url": "https://api.github.com/users/distri/received_events",
              "type": "Organization",
              "site_admin": false
            },
            "network_count": 0,
            "subscribers_count": 1,
            "branch": "v0.2.0",
            "defaultBranch": "master"
          },
          "dependencies": {
            "point": {
              "source": {
                "LICENSE": {
                  "path": "LICENSE",
                  "mode": "100644",
                  "content": "The MIT License (MIT)\n\nCopyright (c) 2013 Daniel X Moore\n\nPermission is hereby granted, free of charge, to any person obtaining a copy of\nthis software and associated documentation files (the \"Software\"), to deal in\nthe Software without restriction, including without limitation the rights to\nuse, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of\nthe Software, and to permit persons to whom the Software is furnished to do so,\nsubject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS\nFOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR\nCOPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER\nIN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN\nCONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.\n",
                  "type": "blob"
                },
                "README.md": {
                  "path": "README.md",
                  "mode": "100644",
                  "content": "point\n=====\n\nJavaScript Point implementation\n",
                  "type": "blob"
                },
                "interactive_runtime.coffee.md": {
                  "path": "interactive_runtime.coffee.md",
                  "mode": "100644",
                  "content": "Interactive Runtime\n-------------------\n\n    window.Point = require(\"./point\")\n\nRegister our example runner.\n\n    Interactive.register \"example\", ({source, runtimeElement}) ->\n      program = CoffeeScript.compile(source, bare: true)\n\n      outputElement = document.createElement \"pre\"\n      runtimeElement.empty().append outputElement\n\n      result = eval(program)\n\n      if typeof result is \"number\"\n        if result != (0 | result)\n          result = result.toFixed(4)\n    \n\n      outputElement.textContent = result\n",
                  "type": "blob"
                },
                "pixie.cson": {
                  "path": "pixie.cson",
                  "mode": "100644",
                  "content": "version: \"0.2.0\"\nentryPoint: \"point\"\n",
                  "type": "blob"
                },
                "point.coffee.md": {
                  "path": "point.coffee.md",
                  "mode": "100644",
                  "content": "\nCreate a new point with given x and y coordinates. If no arguments are given\ndefaults to (0, 0).\n\n>     #! example\n>     Point()\n\n----\n\n>     #! example\n>     Point(-2, 5)\n\n----\n\n    Point = (x, y) ->\n      if isObject(x)\n        {x, y} = x\n\n      __proto__: Point.prototype\n      x: x ? 0\n      y: y ? 0\n\nPoint protoype methods.\n\n    Point:: =\n\nConstrain the magnitude of a vector.\n\n      clamp: (n) ->\n        if @magnitude() > n\n          @norm(n)\n        else\n          @copy()\n\nCreates a copy of this point.\n\n      copy: ->\n        Point(@x, @y)\n\n>     #! example\n>     Point(1, 1).copy()\n\n----\n\nAdds a point to this one and returns the new point. You may\nalso use a two argument call like `point.add(x, y)`\nto add x and y values without a second point object.\n\n      add: (first, second) ->\n        if second?\n          Point(\n            @x + first\n            @y + second\n          )\n        else\n          Point(\n            @x + first.x,\n            @y + first.y\n          )\n\n>     #! example\n>     Point(2, 3).add(Point(3, 4))\n\n----\n\nSubtracts a point to this one and returns the new point.\n\n      subtract: (first, second) ->\n        if second?\n          Point(\n            @x - first,\n            @y - second\n          )\n        else\n          @add(first.scale(-1))\n\n>     #! example\n>     Point(1, 2).subtract(Point(2, 0))\n\n----\n\nScale this Point (Vector) by a constant amount.\n\n      scale: (scalar) ->\n        Point(\n          @x * scalar,\n          @y * scalar\n        )\n\n>     #! example\n>     point = Point(5, 6).scale(2)\n\n----\n\nThe `norm` of a vector is the unit vector pointing in the same direction. This method\ntreats the point as though it is a vector from the origin to (x, y).\n\n      norm: (length=1.0) ->\n        if m = @length()\n          @scale(length/m)\n        else\n          @copy()\n\n>     #! example\n>     point = Point(2, 3).norm()\n\n----\n\nDetermine whether this `Point` is equal to another `Point`. Returns `true` if\nthey are equal and `false` otherwise.\n\n      equal: (other) ->\n        @x == other.x && @y == other.y\n\n>     #! example\n>     point = Point(2, 3)\n>\n>     point.equal(Point(2, 3))\n\n----\n\nComputed the length of this point as though it were a vector from (0,0) to (x,y).\n\n      length: ->\n        Math.sqrt(@dot(this))\n\n>     #! example\n>     Point(5, 7).length()\n\n----\n\nCalculate the magnitude of this Point (Vector).\n\n      magnitude: ->\n        @length()\n\n>     #! example\n>     Point(5, 7).magnitude()\n\n----\n\nReturns the direction in radians of this point from the origin.\n\n      direction: ->\n        Math.atan2(@y, @x)\n\n>     #! example\n>     point = Point(0, 1)\n>\n>     point.direction()\n\n----\n\nCalculate the dot product of this point and another point (Vector).\n\n      dot: (other) ->\n        @x * other.x + @y * other.y\n\n\n`cross` calculates the cross product of this point and another point (Vector).\nUsually cross products are thought of as only applying to three dimensional vectors,\nbut z can be treated as zero. The result of this method is interpreted as the magnitude\nof the vector result of the cross product between [x1, y1, 0] x [x2, y2, 0]\nperpendicular to the xy plane.\n\n      cross: (other) ->\n        @x * other.y - other.x * @y\n\n\n`distance` computes the Euclidean distance between this point and another point.\n\n      distance: (other) ->\n        Point.distance(this, other)\n\n>     #! example\n>     pointA = Point(2, 3)\n>     pointB = Point(9, 2)\n>\n>     pointA.distance(pointB)\n\n----\n\n`toFixed` returns a string representation of this point with fixed decimal places.\n\n      toFixed: (n) ->\n        \"Point(#{@x.toFixed(n)}, #{@y.toFixed(n)})\"\n\n`toString` returns a string representation of this point. The representation is\nsuch that if `eval`d it will return a `Point`\n\n      toString: ->\n        \"Point(#{@x}, #{@y})\"\n\n`distance` Compute the Euclidean distance between two points.\n\n    Point.distance = (p1, p2) ->\n      Math.sqrt(Point.distanceSquared(p1, p2))\n\n>     #! example\n>     pointA = Point(2, 3)\n>     pointB = Point(9, 2)\n>\n>     Point.distance(pointA, pointB)\n\n----\n\n`distanceSquared` The square of the Euclidean distance between two points.\n\n    Point.distanceSquared = (p1, p2) ->\n      Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2)\n\n>     #! example\n>     pointA = Point(2, 3)\n>     pointB = Point(9, 2)\n>\n>     Point.distanceSquared(pointA, pointB)\n\n----\n\n`interpolate` returns a point along the path from p1 to p2\n\n    Point.interpolate = (p1, p2, t) ->\n      p2.subtract(p1).scale(t).add(p1)\n\nConstruct a point on the unit circle for the given angle.\n\n    Point.fromAngle = (angle) ->\n      Point(Math.cos(angle), Math.sin(angle))\n\n>     #! example\n>     Point.fromAngle(Math.PI / 2)\n\n----\n\nIf you have two dudes, one standing at point p1, and the other\nstanding at point p2, then this method will return the direction\nthat the dude standing at p1 will need to face to look at p2.\n\n>     #! example\n>     p1 = Point(0, 0)\n>     p2 = Point(7, 3)\n>\n>     Point.direction(p1, p2)\n\n    Point.direction = (p1, p2) ->\n      Math.atan2(\n        p2.y - p1.y,\n        p2.x - p1.x\n      )\n\nThe centroid of a set of points is their arithmetic mean.\n\n    Point.centroid = (points...) ->\n      points.reduce((sumPoint, point) ->\n        sumPoint.add(point)\n      , Point(0, 0))\n      .scale(1/points.length)\n\nGenerate a random point on the unit circle.\n\n    Point.random = ->\n      Point.fromAngle(Math.random() * 2 * Math.PI)\n\nExport\n\n    module.exports = Point\n\nHelpers\n-------\n\n    isObject = (object) ->\n      Object.prototype.toString.call(object) is \"[object Object]\"\n\nLive Examples\n-------------\n\n>     #! setup\n>     require(\"/interactive_runtime\")\n",
                  "type": "blob"
                },
                "test/test.coffee": {
                  "path": "test/test.coffee",
                  "mode": "100644",
                  "content": "Point = require \"../point\"\n\nok = assert\nequals = assert.equal\n\nTAU = 2 * Math.PI\n\ndescribe \"Point\", ->\n\n  TOLERANCE = 0.00001\n\n  equalEnough = (expected, actual, tolerance, message) ->\n    message ||= \"\" + expected + \" within \" + tolerance + \" of \" + actual\n    ok(expected + tolerance >= actual && expected - tolerance <= actual, message)\n\n  it \"copy constructor\", ->\n    p = Point(3, 7)\n\n    p2 = Point(p)\n\n    equals p2.x, p.x\n    equals p2.y, p.y\n\n  it \"#add\", ->\n    p1 = Point(5, 6)\n    p2 = Point(7, 5)\n\n    result = p1.add(p2)\n\n    equals result.x, p1.x + p2.x\n    equals result.y, p1.y + p2.y\n\n    equals p1.x, 5\n    equals p1.y, 6\n    equals p2.x, 7\n    equals p2.y, 5\n\n  it \"#add with two arguments\", ->\n    point = Point(3, 7)\n    x = 2\n    y = 1\n\n    result = point.add(x, y)\n\n    equals result.x, point.x + x\n    equals result.y, point.y + y\n\n    x = 2\n    y = 0\n\n    result = point.add(x, y)\n\n    equals result.x, point.x + x\n    equals result.y, point.y + y\n\n  it \"#add existing\", ->\n    p = Point(0, 0)\n\n    p.add(Point(3, 5))\n\n    equals p.x, 0\n    equals p.y, 0\n\n  it \"#subtract\", ->\n    p1 = Point(5, 6)\n    p2 = Point(7, 5)\n\n    result = p1.subtract(p2)\n\n    equals result.x, p1.x - p2.x\n    equals result.y, p1.y - p2.y\n\n  it \"#subtract existing\", ->\n    p = Point(8, 6)\n\n    p.subtract(3, 4)\n\n    equals p.x, 8\n    equals p.y, 6\n\n  it \"#norm\", ->\n    p = Point(2, 0)\n\n    normal = p.norm()\n    equals normal.x, 1\n\n    normal = p.norm(5)\n    equals normal.x, 5\n\n    p = Point(0, 0)\n\n    normal = p.norm()\n    equals normal.x, 0, \"x value of norm of point(0,0) is 0\"\n    equals normal.y, 0, \"y value of norm of point(0,0) is 0\"\n\n  it \"#norm existing\", ->\n    p = Point(6, 8)\n\n    p.norm(5)\n\n    equals p.x, 6\n    equals p.y, 8\n\n  it \"#scale\", ->\n    p = Point(5, 6)\n    scalar = 2\n\n    result = p.scale(scalar)\n\n    equals result.x, p.x * scalar\n    equals result.y, p.y * scalar\n\n    equals p.x, 5\n    equals p.y, 6\n\n  it \"#scale existing\", ->\n    p = Point(0, 1)\n    scalar = 3\n\n    p.scale(scalar)\n\n    equals p.x, 0\n    equals p.y, 1\n\n  it \"#equal\", ->\n    ok Point(7, 8).equal(Point(7, 8))\n\n  it \"#magnitude\", ->\n    equals Point(3, 4).magnitude(), 5\n\n  it \"#length\", ->\n    equals Point(0, 0).length(), 0\n    equals Point(-1, 0).length(), 1\n\n  it \"#toString\", ->\n    p = Point(7, 5)\n    ok eval(p.toString()).equal(p)\n\n  it \"#clamp\", ->\n    p = Point(10, 10)\n    p2 = p.clamp(5)\n\n    equals p2.length(), 5\n\n  it \".centroid\", ->\n    centroid = Point.centroid(\n      Point(0, 0),\n      Point(10, 10),\n      Point(10, 0),\n      Point(0, 10)\n    )\n\n    equals centroid.x, 5\n    equals centroid.y, 5\n\n  it \".fromAngle\", ->\n    p = Point.fromAngle(TAU / 4)\n\n    equalEnough p.x, 0, TOLERANCE\n    equals p.y, 1\n\n  it \".random\", ->\n    p = Point.random()\n\n    ok p\n\n  it \".interpolate\", ->\n    p1 = Point(10, 7)\n    p2 = Point(-6, 29)\n\n    ok p1.equal(Point.interpolate(p1, p2, 0))\n    ok p2.equal(Point.interpolate(p1, p2, 1))\n",
                  "type": "blob"
                }
              },
              "distribution": {
                "interactive_runtime": {
                  "path": "interactive_runtime",
                  "content": "(function() {\n  window.Point = require(\"./point\");\n\n  Interactive.register(\"example\", function(_arg) {\n    var outputElement, program, result, runtimeElement, source;\n    source = _arg.source, runtimeElement = _arg.runtimeElement;\n    program = CoffeeScript.compile(source, {\n      bare: true\n    });\n    outputElement = document.createElement(\"pre\");\n    runtimeElement.empty().append(outputElement);\n    result = eval(program);\n    if (typeof result === \"number\") {\n      if (result !== (0 | result)) {\n        result = result.toFixed(4);\n      }\n    }\n    return outputElement.textContent = result;\n  });\n\n}).call(this);\n\n//# sourceURL=interactive_runtime.coffee",
                  "type": "blob"
                },
                "pixie": {
                  "path": "pixie",
                  "content": "module.exports = {\"version\":\"0.2.0\",\"entryPoint\":\"point\"};",
                  "type": "blob"
                },
                "point": {
                  "path": "point",
                  "content": "(function() {\n  var Point, isObject,\n    __slice = [].slice;\n\n  Point = function(x, y) {\n    var _ref;\n    if (isObject(x)) {\n      _ref = x, x = _ref.x, y = _ref.y;\n    }\n    return {\n      __proto__: Point.prototype,\n      x: x != null ? x : 0,\n      y: y != null ? y : 0\n    };\n  };\n\n  Point.prototype = {\n    clamp: function(n) {\n      if (this.magnitude() > n) {\n        return this.norm(n);\n      } else {\n        return this.copy();\n      }\n    },\n    copy: function() {\n      return Point(this.x, this.y);\n    },\n    add: function(first, second) {\n      if (second != null) {\n        return Point(this.x + first, this.y + second);\n      } else {\n        return Point(this.x + first.x, this.y + first.y);\n      }\n    },\n    subtract: function(first, second) {\n      if (second != null) {\n        return Point(this.x - first, this.y - second);\n      } else {\n        return this.add(first.scale(-1));\n      }\n    },\n    scale: function(scalar) {\n      return Point(this.x * scalar, this.y * scalar);\n    },\n    norm: function(length) {\n      var m;\n      if (length == null) {\n        length = 1.0;\n      }\n      if (m = this.length()) {\n        return this.scale(length / m);\n      } else {\n        return this.copy();\n      }\n    },\n    equal: function(other) {\n      return this.x === other.x && this.y === other.y;\n    },\n    length: function() {\n      return Math.sqrt(this.dot(this));\n    },\n    magnitude: function() {\n      return this.length();\n    },\n    direction: function() {\n      return Math.atan2(this.y, this.x);\n    },\n    dot: function(other) {\n      return this.x * other.x + this.y * other.y;\n    },\n    cross: function(other) {\n      return this.x * other.y - other.x * this.y;\n    },\n    distance: function(other) {\n      return Point.distance(this, other);\n    },\n    toFixed: function(n) {\n      return \"Point(\" + (this.x.toFixed(n)) + \", \" + (this.y.toFixed(n)) + \")\";\n    },\n    toString: function() {\n      return \"Point(\" + this.x + \", \" + this.y + \")\";\n    }\n  };\n\n  Point.distance = function(p1, p2) {\n    return Math.sqrt(Point.distanceSquared(p1, p2));\n  };\n\n  Point.distanceSquared = function(p1, p2) {\n    return Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2);\n  };\n\n  Point.interpolate = function(p1, p2, t) {\n    return p2.subtract(p1).scale(t).add(p1);\n  };\n\n  Point.fromAngle = function(angle) {\n    return Point(Math.cos(angle), Math.sin(angle));\n  };\n\n  Point.direction = function(p1, p2) {\n    return Math.atan2(p2.y - p1.y, p2.x - p1.x);\n  };\n\n  Point.centroid = function() {\n    var points;\n    points = 1 <= arguments.length ? __slice.call(arguments, 0) : [];\n    return points.reduce(function(sumPoint, point) {\n      return sumPoint.add(point);\n    }, Point(0, 0)).scale(1 / points.length);\n  };\n\n  Point.random = function() {\n    return Point.fromAngle(Math.random() * 2 * Math.PI);\n  };\n\n  module.exports = Point;\n\n  isObject = function(object) {\n    return Object.prototype.toString.call(object) === \"[object Object]\";\n  };\n\n}).call(this);\n\n//# sourceURL=point.coffee",
                  "type": "blob"
                },
                "test/test": {
                  "path": "test/test",
                  "content": "(function() {\n  var Point, TAU, equals, ok;\n\n  Point = require(\"../point\");\n\n  ok = assert;\n\n  equals = assert.equal;\n\n  TAU = 2 * Math.PI;\n\n  describe(\"Point\", function() {\n    var TOLERANCE, equalEnough;\n    TOLERANCE = 0.00001;\n    equalEnough = function(expected, actual, tolerance, message) {\n      message || (message = \"\" + expected + \" within \" + tolerance + \" of \" + actual);\n      return ok(expected + tolerance >= actual && expected - tolerance <= actual, message);\n    };\n    it(\"copy constructor\", function() {\n      var p, p2;\n      p = Point(3, 7);\n      p2 = Point(p);\n      equals(p2.x, p.x);\n      return equals(p2.y, p.y);\n    });\n    it(\"#add\", function() {\n      var p1, p2, result;\n      p1 = Point(5, 6);\n      p2 = Point(7, 5);\n      result = p1.add(p2);\n      equals(result.x, p1.x + p2.x);\n      equals(result.y, p1.y + p2.y);\n      equals(p1.x, 5);\n      equals(p1.y, 6);\n      equals(p2.x, 7);\n      return equals(p2.y, 5);\n    });\n    it(\"#add with two arguments\", function() {\n      var point, result, x, y;\n      point = Point(3, 7);\n      x = 2;\n      y = 1;\n      result = point.add(x, y);\n      equals(result.x, point.x + x);\n      equals(result.y, point.y + y);\n      x = 2;\n      y = 0;\n      result = point.add(x, y);\n      equals(result.x, point.x + x);\n      return equals(result.y, point.y + y);\n    });\n    it(\"#add existing\", function() {\n      var p;\n      p = Point(0, 0);\n      p.add(Point(3, 5));\n      equals(p.x, 0);\n      return equals(p.y, 0);\n    });\n    it(\"#subtract\", function() {\n      var p1, p2, result;\n      p1 = Point(5, 6);\n      p2 = Point(7, 5);\n      result = p1.subtract(p2);\n      equals(result.x, p1.x - p2.x);\n      return equals(result.y, p1.y - p2.y);\n    });\n    it(\"#subtract existing\", function() {\n      var p;\n      p = Point(8, 6);\n      p.subtract(3, 4);\n      equals(p.x, 8);\n      return equals(p.y, 6);\n    });\n    it(\"#norm\", function() {\n      var normal, p;\n      p = Point(2, 0);\n      normal = p.norm();\n      equals(normal.x, 1);\n      normal = p.norm(5);\n      equals(normal.x, 5);\n      p = Point(0, 0);\n      normal = p.norm();\n      equals(normal.x, 0, \"x value of norm of point(0,0) is 0\");\n      return equals(normal.y, 0, \"y value of norm of point(0,0) is 0\");\n    });\n    it(\"#norm existing\", function() {\n      var p;\n      p = Point(6, 8);\n      p.norm(5);\n      equals(p.x, 6);\n      return equals(p.y, 8);\n    });\n    it(\"#scale\", function() {\n      var p, result, scalar;\n      p = Point(5, 6);\n      scalar = 2;\n      result = p.scale(scalar);\n      equals(result.x, p.x * scalar);\n      equals(result.y, p.y * scalar);\n      equals(p.x, 5);\n      return equals(p.y, 6);\n    });\n    it(\"#scale existing\", function() {\n      var p, scalar;\n      p = Point(0, 1);\n      scalar = 3;\n      p.scale(scalar);\n      equals(p.x, 0);\n      return equals(p.y, 1);\n    });\n    it(\"#equal\", function() {\n      return ok(Point(7, 8).equal(Point(7, 8)));\n    });\n    it(\"#magnitude\", function() {\n      return equals(Point(3, 4).magnitude(), 5);\n    });\n    it(\"#length\", function() {\n      equals(Point(0, 0).length(), 0);\n      return equals(Point(-1, 0).length(), 1);\n    });\n    it(\"#toString\", function() {\n      var p;\n      p = Point(7, 5);\n      return ok(eval(p.toString()).equal(p));\n    });\n    it(\"#clamp\", function() {\n      var p, p2;\n      p = Point(10, 10);\n      p2 = p.clamp(5);\n      return equals(p2.length(), 5);\n    });\n    it(\".centroid\", function() {\n      var centroid;\n      centroid = Point.centroid(Point(0, 0), Point(10, 10), Point(10, 0), Point(0, 10));\n      equals(centroid.x, 5);\n      return equals(centroid.y, 5);\n    });\n    it(\".fromAngle\", function() {\n      var p;\n      p = Point.fromAngle(TAU / 4);\n      equalEnough(p.x, 0, TOLERANCE);\n      return equals(p.y, 1);\n    });\n    it(\".random\", function() {\n      var p;\n      p = Point.random();\n      return ok(p);\n    });\n    return it(\".interpolate\", function() {\n      var p1, p2;\n      p1 = Point(10, 7);\n      p2 = Point(-6, 29);\n      ok(p1.equal(Point.interpolate(p1, p2, 0)));\n      return ok(p2.equal(Point.interpolate(p1, p2, 1)));\n    });\n  });\n\n}).call(this);\n\n//# sourceURL=test/test.coffee",
                  "type": "blob"
                }
              },
              "progenitor": {
                "url": "http://strd6.github.io/editor/"
              },
              "version": "0.2.0",
              "entryPoint": "point",
              "repository": {
                "id": 13484982,
                "name": "point",
                "full_name": "distri/point",
                "owner": {
                  "login": "distri",
                  "id": 6005125,
                  "avatar_url": "https://identicons.github.com/f90c81ffc1498e260c820082f2e7ca5f.png",
                  "gravatar_id": null,
                  "url": "https://api.github.com/users/distri",
                  "html_url": "https://github.com/distri",
                  "followers_url": "https://api.github.com/users/distri/followers",
                  "following_url": "https://api.github.com/users/distri/following{/other_user}",
                  "gists_url": "https://api.github.com/users/distri/gists{/gist_id}",
                  "starred_url": "https://api.github.com/users/distri/starred{/owner}{/repo}",
                  "subscriptions_url": "https://api.github.com/users/distri/subscriptions",
                  "organizations_url": "https://api.github.com/users/distri/orgs",
                  "repos_url": "https://api.github.com/users/distri/repos",
                  "events_url": "https://api.github.com/users/distri/events{/privacy}",
                  "received_events_url": "https://api.github.com/users/distri/received_events",
                  "type": "Organization",
                  "site_admin": false
                },
                "private": false,
                "html_url": "https://github.com/distri/point",
                "description": "JavaScript Point implementation",
                "fork": false,
                "url": "https://api.github.com/repos/distri/point",
                "forks_url": "https://api.github.com/repos/distri/point/forks",
                "keys_url": "https://api.github.com/repos/distri/point/keys{/key_id}",
                "collaborators_url": "https://api.github.com/repos/distri/point/collaborators{/collaborator}",
                "teams_url": "https://api.github.com/repos/distri/point/teams",
                "hooks_url": "https://api.github.com/repos/distri/point/hooks",
                "issue_events_url": "https://api.github.com/repos/distri/point/issues/events{/number}",
                "events_url": "https://api.github.com/repos/distri/point/events",
                "assignees_url": "https://api.github.com/repos/distri/point/assignees{/user}",
                "branches_url": "https://api.github.com/repos/distri/point/branches{/branch}",
                "tags_url": "https://api.github.com/repos/distri/point/tags",
                "blobs_url": "https://api.github.com/repos/distri/point/git/blobs{/sha}",
                "git_tags_url": "https://api.github.com/repos/distri/point/git/tags{/sha}",
                "git_refs_url": "https://api.github.com/repos/distri/point/git/refs{/sha}",
                "trees_url": "https://api.github.com/repos/distri/point/git/trees{/sha}",
                "statuses_url": "https://api.github.com/repos/distri/point/statuses/{sha}",
                "languages_url": "https://api.github.com/repos/distri/point/languages",
                "stargazers_url": "https://api.github.com/repos/distri/point/stargazers",
                "contributors_url": "https://api.github.com/repos/distri/point/contributors",
                "subscribers_url": "https://api.github.com/repos/distri/point/subscribers",
                "subscription_url": "https://api.github.com/repos/distri/point/subscription",
                "commits_url": "https://api.github.com/repos/distri/point/commits{/sha}",
                "git_commits_url": "https://api.github.com/repos/distri/point/git/commits{/sha}",
                "comments_url": "https://api.github.com/repos/distri/point/comments{/number}",
                "issue_comment_url": "https://api.github.com/repos/distri/point/issues/comments/{number}",
                "contents_url": "https://api.github.com/repos/distri/point/contents/{+path}",
                "compare_url": "https://api.github.com/repos/distri/point/compare/{base}...{head}",
                "merges_url": "https://api.github.com/repos/distri/point/merges",
                "archive_url": "https://api.github.com/repos/distri/point/{archive_format}{/ref}",
                "downloads_url": "https://api.github.com/repos/distri/point/downloads",
                "issues_url": "https://api.github.com/repos/distri/point/issues{/number}",
                "pulls_url": "https://api.github.com/repos/distri/point/pulls{/number}",
                "milestones_url": "https://api.github.com/repos/distri/point/milestones{/number}",
                "notifications_url": "https://api.github.com/repos/distri/point/notifications{?since,all,participating}",
                "labels_url": "https://api.github.com/repos/distri/point/labels{/name}",
                "releases_url": "https://api.github.com/repos/distri/point/releases{/id}",
                "created_at": "2013-10-10T22:59:27Z",
                "updated_at": "2013-12-23T23:33:20Z",
                "pushed_at": "2013-10-15T00:22:04Z",
                "git_url": "git://github.com/distri/point.git",
                "ssh_url": "git@github.com:distri/point.git",
                "clone_url": "https://github.com/distri/point.git",
                "svn_url": "https://github.com/distri/point",
                "homepage": null,
                "size": 836,
                "stargazers_count": 0,
                "watchers_count": 0,
                "language": "CoffeeScript",
                "has_issues": true,
                "has_downloads": true,
                "has_wiki": true,
                "forks_count": 0,
                "mirror_url": null,
                "open_issues_count": 0,
                "forks": 0,
                "open_issues": 0,
                "watchers": 0,
                "default_branch": "master",
                "master_branch": "master",
                "permissions": {
                  "admin": true,
                  "push": true,
                  "pull": true
                },
                "organization": {
                  "login": "distri",
                  "id": 6005125,
                  "avatar_url": "https://identicons.github.com/f90c81ffc1498e260c820082f2e7ca5f.png",
                  "gravatar_id": null,
                  "url": "https://api.github.com/users/distri",
                  "html_url": "https://github.com/distri",
                  "followers_url": "https://api.github.com/users/distri/followers",
                  "following_url": "https://api.github.com/users/distri/following{/other_user}",
                  "gists_url": "https://api.github.com/users/distri/gists{/gist_id}",
                  "starred_url": "https://api.github.com/users/distri/starred{/owner}{/repo}",
                  "subscriptions_url": "https://api.github.com/users/distri/subscriptions",
                  "organizations_url": "https://api.github.com/users/distri/orgs",
                  "repos_url": "https://api.github.com/users/distri/repos",
                  "events_url": "https://api.github.com/users/distri/events{/privacy}",
                  "received_events_url": "https://api.github.com/users/distri/received_events",
                  "type": "Organization",
                  "site_admin": false
                },
                "network_count": 0,
                "subscribers_count": 1,
                "branch": "v0.2.0",
                "defaultBranch": "master"
              },
              "dependencies": {}
            },
            "matrix": {
              "source": {
                "LICENSE": {
                  "path": "LICENSE",
                  "mode": "100644",
                  "content": "The MIT License (MIT)\n\nCopyright (c) 2013 Daniel X Moore\n\nPermission is hereby granted, free of charge, to any person obtaining a copy of\nthis software and associated documentation files (the \"Software\"), to deal in\nthe Software without restriction, including without limitation the rights to\nuse, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of\nthe Software, and to permit persons to whom the Software is furnished to do so,\nsubject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS\nFOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR\nCOPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER\nIN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN\nCONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.\n",
                  "type": "blob"
                },
                "README.md": {
                  "path": "README.md",
                  "mode": "100644",
                  "content": "matrix\n======\n\nWhere matrices become heroes, together.\n",
                  "type": "blob"
                },
                "matrix.coffee.md": {
                  "path": "matrix.coffee.md",
                  "mode": "100644",
                  "content": "Matrix\n======\n\n```\n   _        _\n  | a  c tx  |\n  | b  d ty  |\n  |_0  0  1 _|\n```\n\nCreates a matrix for 2d affine transformations.\n\n`concat`, `inverse`, `rotate`, `scale` and `translate` return new matrices with\nthe transformations applied. The matrix is not modified in place.\n\nReturns the identity matrix when called with no arguments.\n\n    Matrix = (a, b, c, d, tx, ty) ->\n      if isObject(a)\n        {a, b, c, d, tx, ty} = a\n\n      __proto__: Matrix.prototype\n      a: a ? 1\n      b: b ? 0\n      c: c ? 0\n      d: d ? 1\n      tx: tx ? 0\n      ty: ty ? 0\n\nA `Point` constructor for the methods that return points. This can be overridden\nwith a compatible constructor if you want fancier points.\n\n    Matrix.Point = require \"./point\"\n\n    Matrix.prototype =\n\n`concat` returns the result of this matrix multiplied by another matrix\ncombining the geometric effects of the two. In mathematical terms,\nconcatenating two matrixes is the same as combining them using matrix multiplication.\nIf this matrix is A and the matrix passed in is B, the resulting matrix is A x B\nhttp://mathworld.wolfram.com/MatrixMultiplication.html\n\n      concat: (matrix) ->\n        Matrix(\n          @a * matrix.a + @c * matrix.b,\n          @b * matrix.a + @d * matrix.b,\n          @a * matrix.c + @c * matrix.d,\n          @b * matrix.c + @d * matrix.d,\n          @a * matrix.tx + @c * matrix.ty + @tx,\n          @b * matrix.tx + @d * matrix.ty + @ty\n        )\n\n\nReturn a new matrix that is a `copy` of this matrix.\n\n      copy: ->\n        Matrix(@a, @b, @c, @d, @tx, @ty)\n\nGiven a point in the pretransform coordinate space, returns the coordinates of\nthat point after the transformation occurs. Unlike the standard transformation\napplied using the transformPoint() method, the deltaTransformPoint() method\ndoes not consider the translation parameters tx and ty.\n\nReturns a new `Point` transformed by this matrix ignoring tx and ty.\n\n      deltaTransformPoint: (point) ->\n        Matrix.Point(\n          @a * point.x + @c * point.y,\n          @b * point.x + @d * point.y\n        )\n\nReturns a new matrix that is the inverse of this matrix.\nhttp://mathworld.wolfram.com/MatrixInverse.html\n\n      inverse: ->\n        determinant = @a * @d - @b * @c\n\n        Matrix(\n          @d / determinant,\n          -@b / determinant,\n          -@c / determinant,\n          @a / determinant,\n          (@c * @ty - @d * @tx) / determinant,\n          (@b * @tx - @a * @ty) / determinant\n        )\n\nReturns a new matrix that corresponds this matrix multiplied by a\na rotation matrix.\n\nThe first parameter `theta` is the amount to rotate in radians.\n\nThe second optional parameter, `aboutPoint` is the point about which the\nrotation occurs. Defaults to (0,0).\n\n      rotate: (theta, aboutPoint) ->\n        @concat(Matrix.rotation(theta, aboutPoint))\n\nReturns a new matrix that corresponds this matrix multiplied by a\na scaling matrix.\n\n      scale: (sx, sy, aboutPoint) ->\n        @concat(Matrix.scale(sx, sy, aboutPoint))\n\nReturns a new matrix that corresponds this matrix multiplied by a\na skewing matrix.\n\n      skew: (skewX, skewY) ->\n        @concat(Matrix.skew(skewX, skewY))\n\nReturns a string representation of this matrix.\n\n      toString: ->\n        \"Matrix(#{@a}, #{@b}, #{@c}, #{@d}, #{@tx}, #{@ty})\"\n\nReturns the result of applying the geometric transformation represented by the\nMatrix object to the specified point.\n\n      transformPoint: (point) ->\n        Matrix.Point(\n          @a * point.x + @c * point.y + @tx,\n          @b * point.x + @d * point.y + @ty\n        )\n\nTranslates the matrix along the x and y axes, as specified by the tx and ty parameters.\n\n      translate: (tx, ty) ->\n        @concat(Matrix.translation(tx, ty))\n\nCreates a matrix transformation that corresponds to the given rotation,\naround (0,0) or the specified point.\n\n    Matrix.rotate = Matrix.rotation = (theta, aboutPoint) ->\n      rotationMatrix = Matrix(\n        Math.cos(theta),\n        Math.sin(theta),\n        -Math.sin(theta),\n        Math.cos(theta)\n      )\n\n      if aboutPoint?\n        rotationMatrix =\n          Matrix.translation(aboutPoint.x, aboutPoint.y).concat(\n            rotationMatrix\n          ).concat(\n            Matrix.translation(-aboutPoint.x, -aboutPoint.y)\n          )\n\n      return rotationMatrix\n\nReturns a matrix that corresponds to scaling by factors of sx, sy along\nthe x and y axis respectively.\n\nIf only one parameter is given the matrix is scaled uniformly along both axis.\n\nIf the optional aboutPoint parameter is given the scaling takes place\nabout the given point.\n\n    Matrix.scale = (sx, sy, aboutPoint) ->\n      sy = sy || sx\n\n      scaleMatrix = Matrix(sx, 0, 0, sy)\n\n      if aboutPoint\n        scaleMatrix =\n          Matrix.translation(aboutPoint.x, aboutPoint.y).concat(\n            scaleMatrix\n          ).concat(\n            Matrix.translation(-aboutPoint.x, -aboutPoint.y)\n          )\n\n      return scaleMatrix\n\n\nReturns a matrix that corresponds to a skew of skewX, skewY.\n\n    Matrix.skew = (skewX, skewY) ->\n      Matrix(0, Math.tan(skewY), Math.tan(skewX), 0)\n\nReturns a matrix that corresponds to a translation of tx, ty.\n\n    Matrix.translate = Matrix.translation = (tx, ty) ->\n      Matrix(1, 0, 0, 1, tx, ty)\n\nHelpers\n-------\n\n    isObject = (object) ->\n      Object.prototype.toString.call(object) is \"[object Object]\"\n\n    frozen = (object) ->\n      Object.freeze?(object)\n\n      return object\n\nConstants\n---------\n\nA constant representing the identity matrix.\n\n    Matrix.IDENTITY = frozen Matrix()\n\nA constant representing the horizontal flip transformation matrix.\n\n    Matrix.HORIZONTAL_FLIP = frozen Matrix(-1, 0, 0, 1)\n\nA constant representing the vertical flip transformation matrix.\n\n    Matrix.VERTICAL_FLIP = frozen Matrix(1, 0, 0, -1)\n\nExports\n-------\n\n    module.exports = Matrix\n",
                  "type": "blob"
                },
                "pixie.cson": {
                  "path": "pixie.cson",
                  "mode": "100644",
                  "content": "version: \"0.3.1\"\nentryPoint: \"matrix\"\n",
                  "type": "blob"
                },
                "test/matrix.coffee": {
                  "path": "test/matrix.coffee",
                  "mode": "100644",
                  "content": "Matrix = require \"../matrix\"\nPoint = require \"../point\"\n\nok = assert\nequals = assert.equal\ntest = it\n\ndescribe \"Matrix\", ->\n\n  TOLERANCE = 0.00001\n  \n  equalEnough = (expected, actual, tolerance, message) ->\n    message ||= \"\" + expected + \" within \" + tolerance + \" of \" + actual\n    ok(expected + tolerance >= actual && expected - tolerance <= actual, message)\n  \n  matrixEqual = (m1, m2) ->\n    equalEnough(m1.a, m2.a, TOLERANCE)\n    equalEnough(m1.b, m2.b, TOLERANCE)\n    equalEnough(m1.c, m2.c, TOLERANCE)\n    equalEnough(m1.d, m2.d, TOLERANCE)\n    equalEnough(m1.tx, m2.tx, TOLERANCE)\n    equalEnough(m1.ty, m2.ty, TOLERANCE)\n  \n  test \"copy constructor\", ->\n   matrix = Matrix(1, 0, 0, 1, 10, 12)\n  \n   matrix2 = Matrix(matrix)\n  \n   ok matrix != matrix2\n   matrixEqual(matrix2, matrix)\n  \n  test \"Matrix() (Identity)\", ->\n    matrix = Matrix()\n  \n    equals(matrix.a, 1, \"a\")\n    equals(matrix.b, 0, \"b\")\n    equals(matrix.c, 0, \"c\")\n    equals(matrix.d, 1, \"d\")\n    equals(matrix.tx, 0, \"tx\")\n    equals(matrix.ty, 0, \"ty\")\n  \n    matrixEqual(matrix, Matrix.IDENTITY)\n  \n  test \"Empty\", ->\n    matrix = Matrix(0, 0, 0, 0, 0, 0)\n  \n    equals(matrix.a, 0, \"a\")\n    equals(matrix.b, 0, \"b\")\n    equals(matrix.c, 0, \"c\")\n    equals(matrix.d, 0, \"d\")\n    equals(matrix.tx, 0, \"tx\")\n    equals(matrix.ty, 0, \"ty\")\n  \n  test \"#copy\", ->\n    matrix = Matrix(2, 0, 0, 2)\n  \n    copyMatrix = matrix.copy()\n  \n    matrixEqual copyMatrix, matrix\n  \n    copyMatrix.a = 4\n  \n    equals copyMatrix.a, 4\n    equals matrix.a, 2, \"Old 'a' value is unchanged\"\n  \n  test \".scale\", ->\n    matrix = Matrix.scale(2, 2)\n  \n    equals(matrix.a, 2, \"a\")\n    equals(matrix.b, 0, \"b\")\n    equals(matrix.c, 0, \"c\")\n    equals(matrix.d, 2, \"d\")\n  \n    matrix = Matrix.scale(3)\n  \n    equals(matrix.a, 3, \"a\")\n    equals(matrix.b, 0, \"b\")\n    equals(matrix.c, 0, \"c\")\n    equals(matrix.d, 3, \"d\")\n  \n  test \".scale (about a point)\", ->\n    p = Point(5, 17)\n  \n    transformedPoint = Matrix.scale(3, 7, p).transformPoint(p)\n  \n    equals(transformedPoint.x, p.x, \"Point should remain the same\")\n    equals(transformedPoint.y, p.y, \"Point should remain the same\")\n  \n  test \"#scale (about a point)\", ->\n    p = Point(3, 11)\n  \n    transformedPoint = Matrix.IDENTITY.scale(3, 7, p).transformPoint(p)\n  \n    equals(transformedPoint.x, p.x, \"Point should remain the same\")\n    equals(transformedPoint.y, p.y, \"Point should remain the same\")\n  \n  test \"#skew\", ->\n    matrix = Matrix()\n\n    angle = 0.25 * Math.PI\n  \n    matrix = matrix.skew(angle, 0)\n  \n    equals matrix.c, Math.tan(angle)\n  \n  test \".rotation\", ->\n    matrix = Matrix.rotation(Math.PI / 2)\n  \n    equalEnough(matrix.a, 0, TOLERANCE)\n    equalEnough(matrix.b, 1, TOLERANCE)\n    equalEnough(matrix.c,-1, TOLERANCE)\n    equalEnough(matrix.d, 0, TOLERANCE)\n  \n  test \".rotation (about a point)\", ->\n    p = Point(11, 7)\n  \n    transformedPoint = Matrix.rotation(Math.PI / 2, p).transformPoint(p)\n  \n    equals transformedPoint.x, p.x, \"Point should remain the same\"\n    equals transformedPoint.y, p.y, \"Point should remain the same\"\n  \n  test \"#rotate (about a point)\", ->\n    p = Point(8, 5);\n  \n    transformedPoint = Matrix.IDENTITY.rotate(Math.PI / 2, p).transformPoint(p)\n  \n    equals transformedPoint.x, p.x, \"Point should remain the same\"\n    equals transformedPoint.y, p.y, \"Point should remain the same\"\n  \n  test \"#inverse (Identity)\", ->\n    matrix = Matrix().inverse()\n  \n    equals(matrix.a, 1, \"a\")\n    equals(matrix.b, 0, \"b\")\n    equals(matrix.c, 0, \"c\")\n    equals(matrix.d, 1, \"d\")\n    equals(matrix.tx, 0, \"tx\")\n    equals(matrix.ty, 0, \"ty\")\n  \n  test \"#concat\", ->\n    matrix = Matrix.rotation(Math.PI / 2).concat(Matrix.rotation(-Math.PI / 2))\n  \n    matrixEqual(matrix, Matrix.IDENTITY)\n  \n  test \"#toString\", ->\n    matrix = Matrix(0.5, 2, 0.5, -2, 3, 4.5)\n    matrixEqual eval(matrix.toString()), matrix\n  \n  test \"Maths\", ->\n    a = Matrix(12, 3, 3, 1, 7, 9)\n    b = Matrix(3, 8, 3, 2, 1, 5)\n  \n    c = a.concat(b)\n  \n    equals(c.a, 60)\n    equals(c.b, 17)\n    equals(c.c, 42)\n    equals(c.d, 11)\n    equals(c.tx, 34)\n    equals(c.ty, 17)\n  \n  test \"Order of transformations should match manual concat\", ->\n    tx = 10\n    ty = 5\n    theta = Math.PI/3\n    s = 2\n  \n    m1 = Matrix().translate(tx, ty).scale(s).rotate(theta)\n    m2 = Matrix().concat(Matrix.translation(tx, ty)).concat(Matrix.scale(s)).concat(Matrix.rotation(theta))\n  \n    matrixEqual(m1, m2)\n  \n  test \"IDENTITY is immutable\", ->\n    identity = Matrix.IDENTITY\n  \n    identity.a = 5\n  \n    equals identity.a, 1\n",
                  "type": "blob"
                },
                "point.coffee.md": {
                  "path": "point.coffee.md",
                  "mode": "100644",
                  "content": "Point\n=====\n\nA very simple Point object constructor.\n\n    module.exports = (x, y) ->\n      x: x\n      y: y\n",
                  "type": "blob"
                }
              },
              "distribution": {
                "matrix": {
                  "path": "matrix",
                  "content": "(function() {\n  var Matrix, frozen, isObject;\n\n  Matrix = function(a, b, c, d, tx, ty) {\n    var _ref;\n    if (isObject(a)) {\n      _ref = a, a = _ref.a, b = _ref.b, c = _ref.c, d = _ref.d, tx = _ref.tx, ty = _ref.ty;\n    }\n    return {\n      __proto__: Matrix.prototype,\n      a: a != null ? a : 1,\n      b: b != null ? b : 0,\n      c: c != null ? c : 0,\n      d: d != null ? d : 1,\n      tx: tx != null ? tx : 0,\n      ty: ty != null ? ty : 0\n    };\n  };\n\n  Matrix.Point = require(\"./point\");\n\n  Matrix.prototype = {\n    concat: function(matrix) {\n      return Matrix(this.a * matrix.a + this.c * matrix.b, this.b * matrix.a + this.d * matrix.b, this.a * matrix.c + this.c * matrix.d, this.b * matrix.c + this.d * matrix.d, this.a * matrix.tx + this.c * matrix.ty + this.tx, this.b * matrix.tx + this.d * matrix.ty + this.ty);\n    },\n    copy: function() {\n      return Matrix(this.a, this.b, this.c, this.d, this.tx, this.ty);\n    },\n    deltaTransformPoint: function(point) {\n      return Matrix.Point(this.a * point.x + this.c * point.y, this.b * point.x + this.d * point.y);\n    },\n    inverse: function() {\n      var determinant;\n      determinant = this.a * this.d - this.b * this.c;\n      return Matrix(this.d / determinant, -this.b / determinant, -this.c / determinant, this.a / determinant, (this.c * this.ty - this.d * this.tx) / determinant, (this.b * this.tx - this.a * this.ty) / determinant);\n    },\n    rotate: function(theta, aboutPoint) {\n      return this.concat(Matrix.rotation(theta, aboutPoint));\n    },\n    scale: function(sx, sy, aboutPoint) {\n      return this.concat(Matrix.scale(sx, sy, aboutPoint));\n    },\n    skew: function(skewX, skewY) {\n      return this.concat(Matrix.skew(skewX, skewY));\n    },\n    toString: function() {\n      return \"Matrix(\" + this.a + \", \" + this.b + \", \" + this.c + \", \" + this.d + \", \" + this.tx + \", \" + this.ty + \")\";\n    },\n    transformPoint: function(point) {\n      return Matrix.Point(this.a * point.x + this.c * point.y + this.tx, this.b * point.x + this.d * point.y + this.ty);\n    },\n    translate: function(tx, ty) {\n      return this.concat(Matrix.translation(tx, ty));\n    }\n  };\n\n  Matrix.rotate = Matrix.rotation = function(theta, aboutPoint) {\n    var rotationMatrix;\n    rotationMatrix = Matrix(Math.cos(theta), Math.sin(theta), -Math.sin(theta), Math.cos(theta));\n    if (aboutPoint != null) {\n      rotationMatrix = Matrix.translation(aboutPoint.x, aboutPoint.y).concat(rotationMatrix).concat(Matrix.translation(-aboutPoint.x, -aboutPoint.y));\n    }\n    return rotationMatrix;\n  };\n\n  Matrix.scale = function(sx, sy, aboutPoint) {\n    var scaleMatrix;\n    sy = sy || sx;\n    scaleMatrix = Matrix(sx, 0, 0, sy);\n    if (aboutPoint) {\n      scaleMatrix = Matrix.translation(aboutPoint.x, aboutPoint.y).concat(scaleMatrix).concat(Matrix.translation(-aboutPoint.x, -aboutPoint.y));\n    }\n    return scaleMatrix;\n  };\n\n  Matrix.skew = function(skewX, skewY) {\n    return Matrix(0, Math.tan(skewY), Math.tan(skewX), 0);\n  };\n\n  Matrix.translate = Matrix.translation = function(tx, ty) {\n    return Matrix(1, 0, 0, 1, tx, ty);\n  };\n\n  isObject = function(object) {\n    return Object.prototype.toString.call(object) === \"[object Object]\";\n  };\n\n  frozen = function(object) {\n    if (typeof Object.freeze === \"function\") {\n      Object.freeze(object);\n    }\n    return object;\n  };\n\n  Matrix.IDENTITY = frozen(Matrix());\n\n  Matrix.HORIZONTAL_FLIP = frozen(Matrix(-1, 0, 0, 1));\n\n  Matrix.VERTICAL_FLIP = frozen(Matrix(1, 0, 0, -1));\n\n  module.exports = Matrix;\n\n}).call(this);\n\n//# sourceURL=matrix.coffee",
                  "type": "blob"
                },
                "pixie": {
                  "path": "pixie",
                  "content": "module.exports = {\"version\":\"0.3.1\",\"entryPoint\":\"matrix\"};",
                  "type": "blob"
                },
                "test/matrix": {
                  "path": "test/matrix",
                  "content": "(function() {\n  var Matrix, Point, equals, ok, test;\n\n  Matrix = require(\"../matrix\");\n\n  Point = require(\"../point\");\n\n  ok = assert;\n\n  equals = assert.equal;\n\n  test = it;\n\n  describe(\"Matrix\", function() {\n    var TOLERANCE, equalEnough, matrixEqual;\n    TOLERANCE = 0.00001;\n    equalEnough = function(expected, actual, tolerance, message) {\n      message || (message = \"\" + expected + \" within \" + tolerance + \" of \" + actual);\n      return ok(expected + tolerance >= actual && expected - tolerance <= actual, message);\n    };\n    matrixEqual = function(m1, m2) {\n      equalEnough(m1.a, m2.a, TOLERANCE);\n      equalEnough(m1.b, m2.b, TOLERANCE);\n      equalEnough(m1.c, m2.c, TOLERANCE);\n      equalEnough(m1.d, m2.d, TOLERANCE);\n      equalEnough(m1.tx, m2.tx, TOLERANCE);\n      return equalEnough(m1.ty, m2.ty, TOLERANCE);\n    };\n    test(\"copy constructor\", function() {\n      var matrix, matrix2;\n      matrix = Matrix(1, 0, 0, 1, 10, 12);\n      matrix2 = Matrix(matrix);\n      ok(matrix !== matrix2);\n      return matrixEqual(matrix2, matrix);\n    });\n    test(\"Matrix() (Identity)\", function() {\n      var matrix;\n      matrix = Matrix();\n      equals(matrix.a, 1, \"a\");\n      equals(matrix.b, 0, \"b\");\n      equals(matrix.c, 0, \"c\");\n      equals(matrix.d, 1, \"d\");\n      equals(matrix.tx, 0, \"tx\");\n      equals(matrix.ty, 0, \"ty\");\n      return matrixEqual(matrix, Matrix.IDENTITY);\n    });\n    test(\"Empty\", function() {\n      var matrix;\n      matrix = Matrix(0, 0, 0, 0, 0, 0);\n      equals(matrix.a, 0, \"a\");\n      equals(matrix.b, 0, \"b\");\n      equals(matrix.c, 0, \"c\");\n      equals(matrix.d, 0, \"d\");\n      equals(matrix.tx, 0, \"tx\");\n      return equals(matrix.ty, 0, \"ty\");\n    });\n    test(\"#copy\", function() {\n      var copyMatrix, matrix;\n      matrix = Matrix(2, 0, 0, 2);\n      copyMatrix = matrix.copy();\n      matrixEqual(copyMatrix, matrix);\n      copyMatrix.a = 4;\n      equals(copyMatrix.a, 4);\n      return equals(matrix.a, 2, \"Old 'a' value is unchanged\");\n    });\n    test(\".scale\", function() {\n      var matrix;\n      matrix = Matrix.scale(2, 2);\n      equals(matrix.a, 2, \"a\");\n      equals(matrix.b, 0, \"b\");\n      equals(matrix.c, 0, \"c\");\n      equals(matrix.d, 2, \"d\");\n      matrix = Matrix.scale(3);\n      equals(matrix.a, 3, \"a\");\n      equals(matrix.b, 0, \"b\");\n      equals(matrix.c, 0, \"c\");\n      return equals(matrix.d, 3, \"d\");\n    });\n    test(\".scale (about a point)\", function() {\n      var p, transformedPoint;\n      p = Point(5, 17);\n      transformedPoint = Matrix.scale(3, 7, p).transformPoint(p);\n      equals(transformedPoint.x, p.x, \"Point should remain the same\");\n      return equals(transformedPoint.y, p.y, \"Point should remain the same\");\n    });\n    test(\"#scale (about a point)\", function() {\n      var p, transformedPoint;\n      p = Point(3, 11);\n      transformedPoint = Matrix.IDENTITY.scale(3, 7, p).transformPoint(p);\n      equals(transformedPoint.x, p.x, \"Point should remain the same\");\n      return equals(transformedPoint.y, p.y, \"Point should remain the same\");\n    });\n    test(\"#skew\", function() {\n      var angle, matrix;\n      matrix = Matrix();\n      angle = 0.25 * Math.PI;\n      matrix = matrix.skew(angle, 0);\n      return equals(matrix.c, Math.tan(angle));\n    });\n    test(\".rotation\", function() {\n      var matrix;\n      matrix = Matrix.rotation(Math.PI / 2);\n      equalEnough(matrix.a, 0, TOLERANCE);\n      equalEnough(matrix.b, 1, TOLERANCE);\n      equalEnough(matrix.c, -1, TOLERANCE);\n      return equalEnough(matrix.d, 0, TOLERANCE);\n    });\n    test(\".rotation (about a point)\", function() {\n      var p, transformedPoint;\n      p = Point(11, 7);\n      transformedPoint = Matrix.rotation(Math.PI / 2, p).transformPoint(p);\n      equals(transformedPoint.x, p.x, \"Point should remain the same\");\n      return equals(transformedPoint.y, p.y, \"Point should remain the same\");\n    });\n    test(\"#rotate (about a point)\", function() {\n      var p, transformedPoint;\n      p = Point(8, 5);\n      transformedPoint = Matrix.IDENTITY.rotate(Math.PI / 2, p).transformPoint(p);\n      equals(transformedPoint.x, p.x, \"Point should remain the same\");\n      return equals(transformedPoint.y, p.y, \"Point should remain the same\");\n    });\n    test(\"#inverse (Identity)\", function() {\n      var matrix;\n      matrix = Matrix().inverse();\n      equals(matrix.a, 1, \"a\");\n      equals(matrix.b, 0, \"b\");\n      equals(matrix.c, 0, \"c\");\n      equals(matrix.d, 1, \"d\");\n      equals(matrix.tx, 0, \"tx\");\n      return equals(matrix.ty, 0, \"ty\");\n    });\n    test(\"#concat\", function() {\n      var matrix;\n      matrix = Matrix.rotation(Math.PI / 2).concat(Matrix.rotation(-Math.PI / 2));\n      return matrixEqual(matrix, Matrix.IDENTITY);\n    });\n    test(\"#toString\", function() {\n      var matrix;\n      matrix = Matrix(0.5, 2, 0.5, -2, 3, 4.5);\n      return matrixEqual(eval(matrix.toString()), matrix);\n    });\n    test(\"Maths\", function() {\n      var a, b, c;\n      a = Matrix(12, 3, 3, 1, 7, 9);\n      b = Matrix(3, 8, 3, 2, 1, 5);\n      c = a.concat(b);\n      equals(c.a, 60);\n      equals(c.b, 17);\n      equals(c.c, 42);\n      equals(c.d, 11);\n      equals(c.tx, 34);\n      return equals(c.ty, 17);\n    });\n    test(\"Order of transformations should match manual concat\", function() {\n      var m1, m2, s, theta, tx, ty;\n      tx = 10;\n      ty = 5;\n      theta = Math.PI / 3;\n      s = 2;\n      m1 = Matrix().translate(tx, ty).scale(s).rotate(theta);\n      m2 = Matrix().concat(Matrix.translation(tx, ty)).concat(Matrix.scale(s)).concat(Matrix.rotation(theta));\n      return matrixEqual(m1, m2);\n    });\n    return test(\"IDENTITY is immutable\", function() {\n      var identity;\n      identity = Matrix.IDENTITY;\n      identity.a = 5;\n      return equals(identity.a, 1);\n    });\n  });\n\n}).call(this);\n\n//# sourceURL=test/matrix.coffee",
                  "type": "blob"
                },
                "point": {
                  "path": "point",
                  "content": "(function() {\n  module.exports = function(x, y) {\n    return {\n      x: x,\n      y: y\n    };\n  };\n\n}).call(this);\n\n//# sourceURL=point.coffee",
                  "type": "blob"
                }
              },
              "progenitor": {
                "url": "http://strd6.github.io/editor/"
              },
              "version": "0.3.1",
              "entryPoint": "matrix",
              "repository": {
                "id": 13551996,
                "name": "matrix",
                "full_name": "distri/matrix",
                "owner": {
                  "login": "distri",
                  "id": 6005125,
                  "avatar_url": "https://identicons.github.com/f90c81ffc1498e260c820082f2e7ca5f.png",
                  "gravatar_id": null,
                  "url": "https://api.github.com/users/distri",
                  "html_url": "https://github.com/distri",
                  "followers_url": "https://api.github.com/users/distri/followers",
                  "following_url": "https://api.github.com/users/distri/following{/other_user}",
                  "gists_url": "https://api.github.com/users/distri/gists{/gist_id}",
                  "starred_url": "https://api.github.com/users/distri/starred{/owner}{/repo}",
                  "subscriptions_url": "https://api.github.com/users/distri/subscriptions",
                  "organizations_url": "https://api.github.com/users/distri/orgs",
                  "repos_url": "https://api.github.com/users/distri/repos",
                  "events_url": "https://api.github.com/users/distri/events{/privacy}",
                  "received_events_url": "https://api.github.com/users/distri/received_events",
                  "type": "Organization",
                  "site_admin": false
                },
                "private": false,
                "html_url": "https://github.com/distri/matrix",
                "description": "Where matrices become heroes, together.",
                "fork": false,
                "url": "https://api.github.com/repos/distri/matrix",
                "forks_url": "https://api.github.com/repos/distri/matrix/forks",
                "keys_url": "https://api.github.com/repos/distri/matrix/keys{/key_id}",
                "collaborators_url": "https://api.github.com/repos/distri/matrix/collaborators{/collaborator}",
                "teams_url": "https://api.github.com/repos/distri/matrix/teams",
                "hooks_url": "https://api.github.com/repos/distri/matrix/hooks",
                "issue_events_url": "https://api.github.com/repos/distri/matrix/issues/events{/number}",
                "events_url": "https://api.github.com/repos/distri/matrix/events",
                "assignees_url": "https://api.github.com/repos/distri/matrix/assignees{/user}",
                "branches_url": "https://api.github.com/repos/distri/matrix/branches{/branch}",
                "tags_url": "https://api.github.com/repos/distri/matrix/tags",
                "blobs_url": "https://api.github.com/repos/distri/matrix/git/blobs{/sha}",
                "git_tags_url": "https://api.github.com/repos/distri/matrix/git/tags{/sha}",
                "git_refs_url": "https://api.github.com/repos/distri/matrix/git/refs{/sha}",
                "trees_url": "https://api.github.com/repos/distri/matrix/git/trees{/sha}",
                "statuses_url": "https://api.github.com/repos/distri/matrix/statuses/{sha}",
                "languages_url": "https://api.github.com/repos/distri/matrix/languages",
                "stargazers_url": "https://api.github.com/repos/distri/matrix/stargazers",
                "contributors_url": "https://api.github.com/repos/distri/matrix/contributors",
                "subscribers_url": "https://api.github.com/repos/distri/matrix/subscribers",
                "subscription_url": "https://api.github.com/repos/distri/matrix/subscription",
                "commits_url": "https://api.github.com/repos/distri/matrix/commits{/sha}",
                "git_commits_url": "https://api.github.com/repos/distri/matrix/git/commits{/sha}",
                "comments_url": "https://api.github.com/repos/distri/matrix/comments{/number}",
                "issue_comment_url": "https://api.github.com/repos/distri/matrix/issues/comments/{number}",
                "contents_url": "https://api.github.com/repos/distri/matrix/contents/{+path}",
                "compare_url": "https://api.github.com/repos/distri/matrix/compare/{base}...{head}",
                "merges_url": "https://api.github.com/repos/distri/matrix/merges",
                "archive_url": "https://api.github.com/repos/distri/matrix/{archive_format}{/ref}",
                "downloads_url": "https://api.github.com/repos/distri/matrix/downloads",
                "issues_url": "https://api.github.com/repos/distri/matrix/issues{/number}",
                "pulls_url": "https://api.github.com/repos/distri/matrix/pulls{/number}",
                "milestones_url": "https://api.github.com/repos/distri/matrix/milestones{/number}",
                "notifications_url": "https://api.github.com/repos/distri/matrix/notifications{?since,all,participating}",
                "labels_url": "https://api.github.com/repos/distri/matrix/labels{/name}",
                "releases_url": "https://api.github.com/repos/distri/matrix/releases{/id}",
                "created_at": "2013-10-14T03:46:16Z",
                "updated_at": "2013-12-23T23:45:28Z",
                "pushed_at": "2013-10-15T00:22:51Z",
                "git_url": "git://github.com/distri/matrix.git",
                "ssh_url": "git@github.com:distri/matrix.git",
                "clone_url": "https://github.com/distri/matrix.git",
                "svn_url": "https://github.com/distri/matrix",
                "homepage": null,
                "size": 580,
                "stargazers_count": 0,
                "watchers_count": 0,
                "language": "CoffeeScript",
                "has_issues": true,
                "has_downloads": true,
                "has_wiki": true,
                "forks_count": 0,
                "mirror_url": null,
                "open_issues_count": 0,
                "forks": 0,
                "open_issues": 0,
                "watchers": 0,
                "default_branch": "master",
                "master_branch": "master",
                "permissions": {
                  "admin": true,
                  "push": true,
                  "pull": true
                },
                "organization": {
                  "login": "distri",
                  "id": 6005125,
                  "avatar_url": "https://identicons.github.com/f90c81ffc1498e260c820082f2e7ca5f.png",
                  "gravatar_id": null,
                  "url": "https://api.github.com/users/distri",
                  "html_url": "https://github.com/distri",
                  "followers_url": "https://api.github.com/users/distri/followers",
                  "following_url": "https://api.github.com/users/distri/following{/other_user}",
                  "gists_url": "https://api.github.com/users/distri/gists{/gist_id}",
                  "starred_url": "https://api.github.com/users/distri/starred{/owner}{/repo}",
                  "subscriptions_url": "https://api.github.com/users/distri/subscriptions",
                  "organizations_url": "https://api.github.com/users/distri/orgs",
                  "repos_url": "https://api.github.com/users/distri/repos",
                  "events_url": "https://api.github.com/users/distri/events{/privacy}",
                  "received_events_url": "https://api.github.com/users/distri/received_events",
                  "type": "Organization",
                  "site_admin": false
                },
                "network_count": 0,
                "subscribers_count": 1,
                "branch": "v0.3.1",
                "defaultBranch": "master"
              },
              "dependencies": {}
            },
            "random": {
              "source": {
                "LICENSE": {
                  "path": "LICENSE",
                  "mode": "100644",
                  "content": "The MIT License (MIT)\n\nCopyright (c) 2013 Daniel X Moore\n\nPermission is hereby granted, free of charge, to any person obtaining a copy of\nthis software and associated documentation files (the \"Software\"), to deal in\nthe Software without restriction, including without limitation the rights to\nuse, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of\nthe Software, and to permit persons to whom the Software is furnished to do so,\nsubject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS\nFOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR\nCOPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER\nIN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN\nCONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.\n",
                  "type": "blob"
                },
                "README.md": {
                  "path": "README.md",
                  "mode": "100644",
                  "content": "random\n======\n\nRandom generation.\n",
                  "type": "blob"
                },
                "pixie.cson": {
                  "path": "pixie.cson",
                  "mode": "100644",
                  "content": "version: \"0.2.0\"\nentryPoint: \"random\"\n",
                  "type": "blob"
                },
                "random.coffee.md": {
                  "path": "random.coffee.md",
                  "mode": "100644",
                  "content": "Random\n======\n\nSome useful methods for generating random things.\n\nHelpers\n-------\n\n`τ` is the circle constant.\n\n    τ = 2 * Math.PI\n\n`U` returns a continuous uniform distribution between `min` and `max`.\n\n    U = (min, max) ->\n      ->\n        Math.random() * (max - min) + min\n\n`standardUniformDistribution` is the uniform distribution between [0, 1]\n\n    standardUniformDistribution = U(0, 1)\n\n`rand` is a helpful shortcut for generating random numbers from a standard\nuniform distribution or from a discreet set of integers.\n\n    rand = (n) ->\n      if n\n        Math.floor(n * standardUniformDistribution())\n      else\n        standardUniformDistribution()\n\nMethods\n-------\n\n    module.exports = Random =\n\nReturns a random angle, uniformly distributed, between 0 and τ.\n\n      angle: ->\n        rand() * τ\n\nA binomial distribution.\n\n      binomial: (n=1, p=0.5) ->\n        [0...n].map ->\n          if rand() < p\n            1\n          else\n            0\n        .reduce (a, b) ->\n          a + b\n        , 0\n\nReturns a random float between two numbers.\n\n      between: (min, max) ->\n        rand() * (max - min) + min\n\nReturns random integers from [0, n) if n is given.\nOtherwise returns random float between 0 and 1.\n\n      rand: rand\n\nReturns random float from [-n / 2, n / 2] if n is given.\nOtherwise returns random float between -0.5 and 0.5.\n\n      signed: (n=1) ->\n        (n * rand()) - (n / 2)\n",
                  "type": "blob"
                },
                "test/random.coffee": {
                  "path": "test/random.coffee",
                  "mode": "100644",
                  "content": "Random = require \"../random\"\n\nok = assert\nequals = assert.equal\ntest = it\n\ndescribe \"Random\", ->\n  \n  test \"methods\", ->\n    [\n      \"angle\"\n      \"binomial\"\n      \"between\"\n      \"rand\"\n      \"signed\"\n    ].forEach (name) ->\n      ok(Random[name], name)\n\n  it \"should have binomial\", ->\n    result = Random.binomial()\n\n    assert result is 1 or result is 0\n",
                  "type": "blob"
                }
              },
              "distribution": {
                "pixie": {
                  "path": "pixie",
                  "content": "module.exports = {\"version\":\"0.2.0\",\"entryPoint\":\"random\"};",
                  "type": "blob"
                },
                "random": {
                  "path": "random",
                  "content": "(function() {\n  var Random, U, rand, standardUniformDistribution, τ;\n\n  τ = 2 * Math.PI;\n\n  U = function(min, max) {\n    return function() {\n      return Math.random() * (max - min) + min;\n    };\n  };\n\n  standardUniformDistribution = U(0, 1);\n\n  rand = function(n) {\n    if (n) {\n      return Math.floor(n * standardUniformDistribution());\n    } else {\n      return standardUniformDistribution();\n    }\n  };\n\n  module.exports = Random = {\n    angle: function() {\n      return rand() * τ;\n    },\n    binomial: function(n, p) {\n      var _i, _results;\n      if (n == null) {\n        n = 1;\n      }\n      if (p == null) {\n        p = 0.5;\n      }\n      return (function() {\n        _results = [];\n        for (var _i = 0; 0 <= n ? _i < n : _i > n; 0 <= n ? _i++ : _i--){ _results.push(_i); }\n        return _results;\n      }).apply(this).map(function() {\n        if (rand() < p) {\n          return 1;\n        } else {\n          return 0;\n        }\n      }).reduce(function(a, b) {\n        return a + b;\n      }, 0);\n    },\n    between: function(min, max) {\n      return rand() * (max - min) + min;\n    },\n    rand: rand,\n    signed: function(n) {\n      if (n == null) {\n        n = 1;\n      }\n      return (n * rand()) - (n / 2);\n    }\n  };\n\n}).call(this);\n\n//# sourceURL=random.coffee",
                  "type": "blob"
                },
                "test/random": {
                  "path": "test/random",
                  "content": "(function() {\n  var Random, equals, ok, test;\n\n  Random = require(\"../random\");\n\n  ok = assert;\n\n  equals = assert.equal;\n\n  test = it;\n\n  describe(\"Random\", function() {\n    test(\"methods\", function() {\n      return [\"angle\", \"binomial\", \"between\", \"rand\", \"signed\"].forEach(function(name) {\n        return ok(Random[name], name);\n      });\n    });\n    return it(\"should have binomial\", function() {\n      var result;\n      result = Random.binomial();\n      return assert(result === 1 || result === 0);\n    });\n  });\n\n}).call(this);\n\n//# sourceURL=test/random.coffee",
                  "type": "blob"
                }
              },
              "progenitor": {
                "url": "http://strd6.github.io/editor/"
              },
              "version": "0.2.0",
              "entryPoint": "random",
              "repository": {
                "id": 13576812,
                "name": "random",
                "full_name": "distri/random",
                "owner": {
                  "login": "distri",
                  "id": 6005125,
                  "avatar_url": "https://identicons.github.com/f90c81ffc1498e260c820082f2e7ca5f.png",
                  "gravatar_id": null,
                  "url": "https://api.github.com/users/distri",
                  "html_url": "https://github.com/distri",
                  "followers_url": "https://api.github.com/users/distri/followers",
                  "following_url": "https://api.github.com/users/distri/following{/other_user}",
                  "gists_url": "https://api.github.com/users/distri/gists{/gist_id}",
                  "starred_url": "https://api.github.com/users/distri/starred{/owner}{/repo}",
                  "subscriptions_url": "https://api.github.com/users/distri/subscriptions",
                  "organizations_url": "https://api.github.com/users/distri/orgs",
                  "repos_url": "https://api.github.com/users/distri/repos",
                  "events_url": "https://api.github.com/users/distri/events{/privacy}",
                  "received_events_url": "https://api.github.com/users/distri/received_events",
                  "type": "Organization",
                  "site_admin": false
                },
                "private": false,
                "html_url": "https://github.com/distri/random",
                "description": "Random generation.",
                "fork": false,
                "url": "https://api.github.com/repos/distri/random",
                "forks_url": "https://api.github.com/repos/distri/random/forks",
                "keys_url": "https://api.github.com/repos/distri/random/keys{/key_id}",
                "collaborators_url": "https://api.github.com/repos/distri/random/collaborators{/collaborator}",
                "teams_url": "https://api.github.com/repos/distri/random/teams",
                "hooks_url": "https://api.github.com/repos/distri/random/hooks",
                "issue_events_url": "https://api.github.com/repos/distri/random/issues/events{/number}",
                "events_url": "https://api.github.com/repos/distri/random/events",
                "assignees_url": "https://api.github.com/repos/distri/random/assignees{/user}",
                "branches_url": "https://api.github.com/repos/distri/random/branches{/branch}",
                "tags_url": "https://api.github.com/repos/distri/random/tags",
                "blobs_url": "https://api.github.com/repos/distri/random/git/blobs{/sha}",
                "git_tags_url": "https://api.github.com/repos/distri/random/git/tags{/sha}",
                "git_refs_url": "https://api.github.com/repos/distri/random/git/refs{/sha}",
                "trees_url": "https://api.github.com/repos/distri/random/git/trees{/sha}",
                "statuses_url": "https://api.github.com/repos/distri/random/statuses/{sha}",
                "languages_url": "https://api.github.com/repos/distri/random/languages",
                "stargazers_url": "https://api.github.com/repos/distri/random/stargazers",
                "contributors_url": "https://api.github.com/repos/distri/random/contributors",
                "subscribers_url": "https://api.github.com/repos/distri/random/subscribers",
                "subscription_url": "https://api.github.com/repos/distri/random/subscription",
                "commits_url": "https://api.github.com/repos/distri/random/commits{/sha}",
                "git_commits_url": "https://api.github.com/repos/distri/random/git/commits{/sha}",
                "comments_url": "https://api.github.com/repos/distri/random/comments{/number}",
                "issue_comment_url": "https://api.github.com/repos/distri/random/issues/comments/{number}",
                "contents_url": "https://api.github.com/repos/distri/random/contents/{+path}",
                "compare_url": "https://api.github.com/repos/distri/random/compare/{base}...{head}",
                "merges_url": "https://api.github.com/repos/distri/random/merges",
                "archive_url": "https://api.github.com/repos/distri/random/{archive_format}{/ref}",
                "downloads_url": "https://api.github.com/repos/distri/random/downloads",
                "issues_url": "https://api.github.com/repos/distri/random/issues{/number}",
                "pulls_url": "https://api.github.com/repos/distri/random/pulls{/number}",
                "milestones_url": "https://api.github.com/repos/distri/random/milestones{/number}",
                "notifications_url": "https://api.github.com/repos/distri/random/notifications{?since,all,participating}",
                "labels_url": "https://api.github.com/repos/distri/random/labels{/name}",
                "releases_url": "https://api.github.com/repos/distri/random/releases{/id}",
                "created_at": "2013-10-15T00:28:31Z",
                "updated_at": "2013-12-06T23:31:24Z",
                "pushed_at": "2013-10-15T01:01:00Z",
                "git_url": "git://github.com/distri/random.git",
                "ssh_url": "git@github.com:distri/random.git",
                "clone_url": "https://github.com/distri/random.git",
                "svn_url": "https://github.com/distri/random",
                "homepage": null,
                "size": 292,
                "stargazers_count": 0,
                "watchers_count": 0,
                "language": "CoffeeScript",
                "has_issues": true,
                "has_downloads": true,
                "has_wiki": true,
                "forks_count": 0,
                "mirror_url": null,
                "open_issues_count": 0,
                "forks": 0,
                "open_issues": 0,
                "watchers": 0,
                "default_branch": "master",
                "master_branch": "master",
                "permissions": {
                  "admin": true,
                  "push": true,
                  "pull": true
                },
                "organization": {
                  "login": "distri",
                  "id": 6005125,
                  "avatar_url": "https://identicons.github.com/f90c81ffc1498e260c820082f2e7ca5f.png",
                  "gravatar_id": null,
                  "url": "https://api.github.com/users/distri",
                  "html_url": "https://github.com/distri",
                  "followers_url": "https://api.github.com/users/distri/followers",
                  "following_url": "https://api.github.com/users/distri/following{/other_user}",
                  "gists_url": "https://api.github.com/users/distri/gists{/gist_id}",
                  "starred_url": "https://api.github.com/users/distri/starred{/owner}{/repo}",
                  "subscriptions_url": "https://api.github.com/users/distri/subscriptions",
                  "organizations_url": "https://api.github.com/users/distri/orgs",
                  "repos_url": "https://api.github.com/users/distri/repos",
                  "events_url": "https://api.github.com/users/distri/events{/privacy}",
                  "received_events_url": "https://api.github.com/users/distri/received_events",
                  "type": "Organization",
                  "site_admin": false
                },
                "network_count": 0,
                "subscribers_count": 1,
                "branch": "v0.2.0",
                "defaultBranch": "master"
              },
              "dependencies": {}
            }
          }
        },
        "model": {
          "source": {
            "LICENSE": {
              "path": "LICENSE",
              "content": "The MIT License (MIT)\n\nCopyright (c) 2014 Daniel X Moore\n\nPermission is hereby granted, free of charge, to any person obtaining a copy of\nthis software and associated documentation files (the \"Software\"), to deal in\nthe Software without restriction, including without limitation the rights to\nuse, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of\nthe Software, and to permit persons to whom the Software is furnished to do so,\nsubject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS\nFOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR\nCOPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER\nIN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN\nCONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.\n",
              "mode": "100644",
              "type": "blob"
            },
            "main.coffee.md": {
              "path": "main.coffee.md",
              "content": "Model\n=====\n\nThe `Model` module provides helper methods to compose nested data models.\n\nModels uses [Observable](/observable/docs) to keep the internal data in sync.\n\n    Core = require \"core\"\n    Observable = require \"observable\"\n\n    module.exports = (I={}, self=Core(I)) ->\n\n      self.extend\n\nObserve any number of attributes as simple observables. For each attribute name passed in we expose a public getter/setter method and listen to changes when the value is set.\n\n        attrObservable: (names...) ->\n          names.forEach (name) ->\n            self[name] = Observable(I[name])\n\n            self[name].observe (newValue) ->\n              I[name] = newValue\n\n          return self\n\nObserve an attribute as a model. Treats the attribute given as an Observable\nmodel instance exposting a getter/setter method of the same name. The Model\nconstructor must be passed in explicitly.\n\n        attrModel: (name, Model) ->\n          model = Model(I[name])\n\n          self[name] = Observable(model)\n\n          self[name].observe (newValue) ->\n            I[name] = newValue.I\n\n          return self\n\nObserve an attribute as a list of sub-models. This is the same as `attrModel`\nexcept the attribute is expected to be an array of models rather than a single one.\n\n        attrModels: (name, Model) ->\n          models = (I[name] or []).map (x) ->\n            Model(x)\n\n          self[name] = Observable(models)\n\n          self[name].observe (newValue) ->\n            I[name] = newValue.map (instance) ->\n              instance.I\n\n          return self\n\nThe JSON representation is kept up to date via the observable properites and resides in `I`.\n\n        toJSON: ->\n          I\n\nReturn our public object.\n\n      return self\n",
              "mode": "100644",
              "type": "blob"
            },
            "pixie.cson": {
              "path": "pixie.cson",
              "content": "version: \"0.1.3\"\ndependencies:\n  core: \"distri/core:v0.6.0\"\n  observable: \"distri/observable:v0.3.1\"\n",
              "mode": "100644",
              "type": "blob"
            },
            "test/model.coffee": {
              "path": "test/model.coffee",
              "content": "Model = require \"../main\"\n\ndescribe 'Model', ->\n  # Association Testing model\n  Person = (I) ->\n    person = Model(I)\n\n    person.attrAccessor(\n      'firstName'\n      'lastName'\n      'suffix'\n    )\n\n    person.fullName = ->\n      \"#{@firstName()} #{@lastName()} #{@suffix()}\"\n\n    return person\n\n  describe \"#attrObservable\", ->\n    it 'should allow for observing of attributes', ->\n      model = Model\n        name: \"Duder\"\n\n      model.attrObservable \"name\"\n\n      model.name(\"Dudeman\")\n\n      assert.equal model.name(), \"Dudeman\"\n\n    it 'should bind properties to observable attributes', ->\n      model = Model\n        name: \"Duder\"\n\n      model.attrObservable \"name\"\n\n      model.name(\"Dudeman\")\n\n      assert.equal model.name(), \"Dudeman\"\n      assert.equal model.name(), model.I.name\n\n  describe \"#attrModel\", ->\n    it \"should be a model instance\", ->\n      model = Model\n        person:\n          firstName: \"Duder\"\n          lastName: \"Mannington\"\n          suffix: \"Jr.\"\n\n      model.attrModel(\"person\", Person)\n\n      assert.equal model.person().fullName(), \"Duder Mannington Jr.\"\n\n    it \"should allow setting the associated model\", ->\n      model = Model\n        person:\n          firstName: \"Duder\"\n          lastName: \"Mannington\"\n          suffix: \"Jr.\"\n\n      model.attrModel(\"person\", Person)\n\n      otherPerson = Person\n        firstName: \"Mr.\"\n        lastName: \"Man\"\n\n      model.person(otherPerson)\n\n      assert.equal model.person().firstName(), \"Mr.\"\n\n    it \"shouldn't update the instance properties after it's been replaced\", ->\n      model = Model\n        person:\n          firstName: \"Duder\"\n          lastName: \"Mannington\"\n          suffix: \"Jr.\"\n\n      model.attrModel(\"person\", Person)\n\n      duder = model.person()\n\n      otherPerson = Person\n        firstName: \"Mr.\"\n        lastName: \"Man\"\n\n      model.person(otherPerson)\n\n      duder.firstName(\"Joe\")\n\n      assert.equal duder.I.firstName, \"Joe\"\n      assert.equal model.I.person.firstName, \"Mr.\"\n\n  describe \"#attrModels\", ->\n    it \"should have an array of model instances\", ->\n      model = Model\n        people: [{\n          firstName: \"Duder\"\n          lastName: \"Mannington\"\n          suffix: \"Jr.\"\n        }, {\n          firstName: \"Mr.\"\n          lastName: \"Mannington\"\n          suffix: \"Sr.\"\n        }]\n\n      model.attrModels(\"people\", Person)\n\n      assert.equal model.people()[0].fullName(), \"Duder Mannington Jr.\"\n\n    it \"should track pushes\", ->\n      model = Model\n        people: [{\n          firstName: \"Duder\"\n          lastName: \"Mannington\"\n          suffix: \"Jr.\"\n        }, {\n          firstName: \"Mr.\"\n          lastName: \"Mannington\"\n          suffix: \"Sr.\"\n        }]\n\n      model.attrModels(\"people\", Person)\n\n      model.people.push Person\n        firstName: \"JoJo\"\n        lastName: \"Loco\"\n\n      assert.equal model.people().length, 3\n      assert.equal model.I.people.length, 3\n\n    it \"should track pops\", ->\n      model = Model\n        people: [{\n          firstName: \"Duder\"\n          lastName: \"Mannington\"\n          suffix: \"Jr.\"\n        }, {\n          firstName: \"Mr.\"\n          lastName: \"Mannington\"\n          suffix: \"Sr.\"\n        }]\n\n      model.attrModels(\"people\", Person)\n\n      model.people.pop()\n\n      assert.equal model.people().length, 1\n      assert.equal model.I.people.length, 1\n\n  describe \"#toJSON\", ->\n    it \"should return an object appropriate for JSON serialization\", ->\n      model = Model\n        test: true\n\n      assert model.toJSON().test\n\n  describe \"#observeAll\", ->\n    it \"should observe all attributes of a simple model\"\n    ->  # TODO\n      model = Model\n        test: true\n        yolo: \"4life\"\n\n      model.observeAll()\n\n      assert model.test()\n      assert.equal model.yolo(), \"4life\"\n\n    it \"should camel case underscored names\"\n",
              "mode": "100644",
              "type": "blob"
            }
          },
          "distribution": {
            "main": {
              "path": "main",
              "content": "(function() {\n  var Core, Observable,\n    __slice = [].slice;\n\n  Core = require(\"core\");\n\n  Observable = require(\"observable\");\n\n  module.exports = function(I, self) {\n    if (I == null) {\n      I = {};\n    }\n    if (self == null) {\n      self = Core(I);\n    }\n    self.extend({\n      attrObservable: function() {\n        var names;\n        names = 1 <= arguments.length ? __slice.call(arguments, 0) : [];\n        names.forEach(function(name) {\n          self[name] = Observable(I[name]);\n          return self[name].observe(function(newValue) {\n            return I[name] = newValue;\n          });\n        });\n        return self;\n      },\n      attrModel: function(name, Model) {\n        var model;\n        model = Model(I[name]);\n        self[name] = Observable(model);\n        self[name].observe(function(newValue) {\n          return I[name] = newValue.I;\n        });\n        return self;\n      },\n      attrModels: function(name, Model) {\n        var models;\n        models = (I[name] || []).map(function(x) {\n          return Model(x);\n        });\n        self[name] = Observable(models);\n        self[name].observe(function(newValue) {\n          return I[name] = newValue.map(function(instance) {\n            return instance.I;\n          });\n        });\n        return self;\n      },\n      toJSON: function() {\n        return I;\n      }\n    });\n    return self;\n  };\n\n}).call(this);\n",
              "type": "blob"
            },
            "pixie": {
              "path": "pixie",
              "content": "module.exports = {\"version\":\"0.1.3\",\"dependencies\":{\"core\":\"distri/core:v0.6.0\",\"observable\":\"distri/observable:v0.3.1\"}};",
              "type": "blob"
            },
            "test/model": {
              "path": "test/model",
              "content": "(function() {\n  var Model;\n\n  Model = require(\"../main\");\n\n  describe('Model', function() {\n    var Person;\n    Person = function(I) {\n      var person;\n      person = Model(I);\n      person.attrAccessor('firstName', 'lastName', 'suffix');\n      person.fullName = function() {\n        return \"\" + (this.firstName()) + \" \" + (this.lastName()) + \" \" + (this.suffix());\n      };\n      return person;\n    };\n    describe(\"#attrObservable\", function() {\n      it('should allow for observing of attributes', function() {\n        var model;\n        model = Model({\n          name: \"Duder\"\n        });\n        model.attrObservable(\"name\");\n        model.name(\"Dudeman\");\n        return assert.equal(model.name(), \"Dudeman\");\n      });\n      return it('should bind properties to observable attributes', function() {\n        var model;\n        model = Model({\n          name: \"Duder\"\n        });\n        model.attrObservable(\"name\");\n        model.name(\"Dudeman\");\n        assert.equal(model.name(), \"Dudeman\");\n        return assert.equal(model.name(), model.I.name);\n      });\n    });\n    describe(\"#attrModel\", function() {\n      it(\"should be a model instance\", function() {\n        var model;\n        model = Model({\n          person: {\n            firstName: \"Duder\",\n            lastName: \"Mannington\",\n            suffix: \"Jr.\"\n          }\n        });\n        model.attrModel(\"person\", Person);\n        return assert.equal(model.person().fullName(), \"Duder Mannington Jr.\");\n      });\n      it(\"should allow setting the associated model\", function() {\n        var model, otherPerson;\n        model = Model({\n          person: {\n            firstName: \"Duder\",\n            lastName: \"Mannington\",\n            suffix: \"Jr.\"\n          }\n        });\n        model.attrModel(\"person\", Person);\n        otherPerson = Person({\n          firstName: \"Mr.\",\n          lastName: \"Man\"\n        });\n        model.person(otherPerson);\n        return assert.equal(model.person().firstName(), \"Mr.\");\n      });\n      return it(\"shouldn't update the instance properties after it's been replaced\", function() {\n        var duder, model, otherPerson;\n        model = Model({\n          person: {\n            firstName: \"Duder\",\n            lastName: \"Mannington\",\n            suffix: \"Jr.\"\n          }\n        });\n        model.attrModel(\"person\", Person);\n        duder = model.person();\n        otherPerson = Person({\n          firstName: \"Mr.\",\n          lastName: \"Man\"\n        });\n        model.person(otherPerson);\n        duder.firstName(\"Joe\");\n        assert.equal(duder.I.firstName, \"Joe\");\n        return assert.equal(model.I.person.firstName, \"Mr.\");\n      });\n    });\n    describe(\"#attrModels\", function() {\n      it(\"should have an array of model instances\", function() {\n        var model;\n        model = Model({\n          people: [\n            {\n              firstName: \"Duder\",\n              lastName: \"Mannington\",\n              suffix: \"Jr.\"\n            }, {\n              firstName: \"Mr.\",\n              lastName: \"Mannington\",\n              suffix: \"Sr.\"\n            }\n          ]\n        });\n        model.attrModels(\"people\", Person);\n        return assert.equal(model.people()[0].fullName(), \"Duder Mannington Jr.\");\n      });\n      it(\"should track pushes\", function() {\n        var model;\n        model = Model({\n          people: [\n            {\n              firstName: \"Duder\",\n              lastName: \"Mannington\",\n              suffix: \"Jr.\"\n            }, {\n              firstName: \"Mr.\",\n              lastName: \"Mannington\",\n              suffix: \"Sr.\"\n            }\n          ]\n        });\n        model.attrModels(\"people\", Person);\n        model.people.push(Person({\n          firstName: \"JoJo\",\n          lastName: \"Loco\"\n        }));\n        assert.equal(model.people().length, 3);\n        return assert.equal(model.I.people.length, 3);\n      });\n      return it(\"should track pops\", function() {\n        var model;\n        model = Model({\n          people: [\n            {\n              firstName: \"Duder\",\n              lastName: \"Mannington\",\n              suffix: \"Jr.\"\n            }, {\n              firstName: \"Mr.\",\n              lastName: \"Mannington\",\n              suffix: \"Sr.\"\n            }\n          ]\n        });\n        model.attrModels(\"people\", Person);\n        model.people.pop();\n        assert.equal(model.people().length, 1);\n        return assert.equal(model.I.people.length, 1);\n      });\n    });\n    describe(\"#toJSON\", function() {\n      return it(\"should return an object appropriate for JSON serialization\", function() {\n        var model;\n        model = Model({\n          test: true\n        });\n        return assert(model.toJSON().test);\n      });\n    });\n    return describe(\"#observeAll\", function() {\n      it(\"should observe all attributes of a simple model\");\n      (function() {\n        var model;\n        model = Model({\n          test: true,\n          yolo: \"4life\"\n        });\n        model.observeAll();\n        assert(model.test());\n        return assert.equal(model.yolo(), \"4life\");\n      });\n      return it(\"should camel case underscored names\");\n    });\n  });\n\n}).call(this);\n",
              "type": "blob"
            }
          },
          "progenitor": {
            "url": "http://www.danielx.net/editor/"
          },
          "version": "0.1.3",
          "entryPoint": "main",
          "repository": {
            "branch": "v0.1.3",
            "default_branch": "master",
            "full_name": "distri/model",
            "homepage": null,
            "description": "",
            "html_url": "https://github.com/distri/model",
            "url": "https://api.github.com/repos/distri/model",
            "publishBranch": "gh-pages"
          },
          "dependencies": {
            "core": {
              "source": {
                "LICENSE": {
                  "path": "LICENSE",
                  "mode": "100644",
                  "content": "The MIT License (MIT)\n\nCopyright (c) 2013 Daniel X Moore\n\nPermission is hereby granted, free of charge, to any person obtaining a copy of\nthis software and associated documentation files (the \"Software\"), to deal in\nthe Software without restriction, including without limitation the rights to\nuse, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of\nthe Software, and to permit persons to whom the Software is furnished to do so,\nsubject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS\nFOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR\nCOPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER\nIN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN\nCONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.\n",
                  "type": "blob"
                },
                "README.md": {
                  "path": "README.md",
                  "mode": "100644",
                  "content": "core\n====\n\nAn object extension system.\n",
                  "type": "blob"
                },
                "core.coffee.md": {
                  "path": "core.coffee.md",
                  "mode": "100644",
                  "content": "Core\n====\n\nThe Core module is used to add extended functionality to objects without\nextending `Object.prototype` directly.\n\n    Core = (I={}, self={}) ->\n      extend self,\n\nExternal access to instance variables. Use of this property should be avoided\nin general, but can come in handy from time to time.\n\n>     #! example\n>     I =\n>       r: 255\n>       g: 0\n>       b: 100\n>\n>     myObject = Core(I)\n>\n>     [myObject.I.r, myObject.I.g, myObject.I.b]\n\n        I: I\n\nGenerates a public jQuery style getter / setter method for each `String` argument.\n\n>     #! example\n>     myObject = Core\n>       r: 255\n>       g: 0\n>       b: 100\n>\n>     myObject.attrAccessor \"r\", \"g\", \"b\"\n>\n>     myObject.r(254)\n\n        attrAccessor: (attrNames...) ->\n          attrNames.forEach (attrName) ->\n            self[attrName] = (newValue) ->\n              if arguments.length > 0\n                I[attrName] = newValue\n\n                return self\n              else\n                I[attrName]\n\n          return self\n\nGenerates a public jQuery style getter method for each String argument.\n\n>     #! example\n>     myObject = Core\n>       r: 255\n>       g: 0\n>       b: 100\n>\n>     myObject.attrReader \"r\", \"g\", \"b\"\n>\n>     [myObject.r(), myObject.g(), myObject.b()]\n\n        attrReader: (attrNames...) ->\n          attrNames.forEach (attrName) ->\n            self[attrName] = ->\n              I[attrName]\n\n          return self\n\nExtends this object with methods from the passed in object. A shortcut for Object.extend(self, methods)\n\n>     I =\n>       x: 30\n>       y: 40\n>       maxSpeed: 5\n>\n>     # we are using extend to give player\n>     # additional methods that Core doesn't have\n>     player = Core(I).extend\n>       increaseSpeed: ->\n>         I.maxSpeed += 1\n>\n>     player.increaseSpeed()\n\n        extend: (objects...) ->\n          extend self, objects...\n\nIncludes a module in this object. A module is a constructor that takes two parameters, `I` and `self`\n\n>     myObject = Core()\n>     myObject.include(Bindable)\n\n>     # now you can bind handlers to functions\n>     myObject.bind \"someEvent\", ->\n>       alert(\"wow. that was easy.\")\n\n        include: (modules...) ->\n          for Module in modules\n            Module(I, self)\n\n          return self\n\n      return self\n\nHelpers\n-------\n\nExtend an object with the properties of other objects.\n\n    extend = (target, sources...) ->\n      for source in sources\n        for name of source\n          target[name] = source[name]\n\n      return target\n\nExport\n\n    module.exports = Core\n",
                  "type": "blob"
                },
                "pixie.cson": {
                  "path": "pixie.cson",
                  "mode": "100644",
                  "content": "entryPoint: \"core\"\nversion: \"0.6.0\"\n",
                  "type": "blob"
                },
                "test/core.coffee": {
                  "path": "test/core.coffee",
                  "mode": "100644",
                  "content": "Core = require \"../core\"\n\nok = assert\nequals = assert.equal\ntest = it\n\ndescribe \"Core\", ->\n\n  test \"#extend\", ->\n    o = Core()\n  \n    o.extend\n      test: \"jawsome\"\n  \n    equals o.test, \"jawsome\"\n  \n  test \"#attrAccessor\", ->\n    o = Core\n      test: \"my_val\"\n  \n    o.attrAccessor(\"test\")\n  \n    equals o.test(), \"my_val\"\n    equals o.test(\"new_val\"), o\n    equals o.test(), \"new_val\"\n  \n  test \"#attrReader\", ->\n    o = Core\n      test: \"my_val\"\n  \n    o.attrReader(\"test\")\n  \n    equals o.test(), \"my_val\"\n    equals o.test(\"new_val\"), \"my_val\"\n    equals o.test(), \"my_val\"\n  \n  test \"#include\", ->\n    o = Core\n      test: \"my_val\"\n  \n    M = (I, self) ->\n      self.attrReader \"test\"\n  \n      self.extend\n        test2: \"cool\"\n  \n    ret = o.include M\n  \n    equals ret, o, \"Should return self\"\n  \n    equals o.test(), \"my_val\"\n    equals o.test2, \"cool\"\n  \n  test \"#include multiple\", ->\n    o = Core\n      test: \"my_val\"\n  \n    M = (I, self) ->\n      self.attrReader \"test\"\n  \n      self.extend\n        test2: \"cool\"\n  \n    M2 = (I, self) ->\n      self.extend\n        test2: \"coolio\"\n  \n    o.include M, M2\n  \n    equals o.test2, \"coolio\"\n",
                  "type": "blob"
                }
              },
              "distribution": {
                "core": {
                  "path": "core",
                  "content": "(function() {\n  var Core, extend,\n    __slice = [].slice;\n\n  Core = function(I, self) {\n    if (I == null) {\n      I = {};\n    }\n    if (self == null) {\n      self = {};\n    }\n    extend(self, {\n      I: I,\n      attrAccessor: function() {\n        var attrNames;\n        attrNames = 1 <= arguments.length ? __slice.call(arguments, 0) : [];\n        attrNames.forEach(function(attrName) {\n          return self[attrName] = function(newValue) {\n            if (arguments.length > 0) {\n              I[attrName] = newValue;\n              return self;\n            } else {\n              return I[attrName];\n            }\n          };\n        });\n        return self;\n      },\n      attrReader: function() {\n        var attrNames;\n        attrNames = 1 <= arguments.length ? __slice.call(arguments, 0) : [];\n        attrNames.forEach(function(attrName) {\n          return self[attrName] = function() {\n            return I[attrName];\n          };\n        });\n        return self;\n      },\n      extend: function() {\n        var objects;\n        objects = 1 <= arguments.length ? __slice.call(arguments, 0) : [];\n        return extend.apply(null, [self].concat(__slice.call(objects)));\n      },\n      include: function() {\n        var Module, modules, _i, _len;\n        modules = 1 <= arguments.length ? __slice.call(arguments, 0) : [];\n        for (_i = 0, _len = modules.length; _i < _len; _i++) {\n          Module = modules[_i];\n          Module(I, self);\n        }\n        return self;\n      }\n    });\n    return self;\n  };\n\n  extend = function() {\n    var name, source, sources, target, _i, _len;\n    target = arguments[0], sources = 2 <= arguments.length ? __slice.call(arguments, 1) : [];\n    for (_i = 0, _len = sources.length; _i < _len; _i++) {\n      source = sources[_i];\n      for (name in source) {\n        target[name] = source[name];\n      }\n    }\n    return target;\n  };\n\n  module.exports = Core;\n\n}).call(this);\n\n//# sourceURL=core.coffee",
                  "type": "blob"
                },
                "pixie": {
                  "path": "pixie",
                  "content": "module.exports = {\"entryPoint\":\"core\",\"version\":\"0.6.0\"};",
                  "type": "blob"
                },
                "test/core": {
                  "path": "test/core",
                  "content": "(function() {\n  var Core, equals, ok, test;\n\n  Core = require(\"../core\");\n\n  ok = assert;\n\n  equals = assert.equal;\n\n  test = it;\n\n  describe(\"Core\", function() {\n    test(\"#extend\", function() {\n      var o;\n      o = Core();\n      o.extend({\n        test: \"jawsome\"\n      });\n      return equals(o.test, \"jawsome\");\n    });\n    test(\"#attrAccessor\", function() {\n      var o;\n      o = Core({\n        test: \"my_val\"\n      });\n      o.attrAccessor(\"test\");\n      equals(o.test(), \"my_val\");\n      equals(o.test(\"new_val\"), o);\n      return equals(o.test(), \"new_val\");\n    });\n    test(\"#attrReader\", function() {\n      var o;\n      o = Core({\n        test: \"my_val\"\n      });\n      o.attrReader(\"test\");\n      equals(o.test(), \"my_val\");\n      equals(o.test(\"new_val\"), \"my_val\");\n      return equals(o.test(), \"my_val\");\n    });\n    test(\"#include\", function() {\n      var M, o, ret;\n      o = Core({\n        test: \"my_val\"\n      });\n      M = function(I, self) {\n        self.attrReader(\"test\");\n        return self.extend({\n          test2: \"cool\"\n        });\n      };\n      ret = o.include(M);\n      equals(ret, o, \"Should return self\");\n      equals(o.test(), \"my_val\");\n      return equals(o.test2, \"cool\");\n    });\n    return test(\"#include multiple\", function() {\n      var M, M2, o;\n      o = Core({\n        test: \"my_val\"\n      });\n      M = function(I, self) {\n        self.attrReader(\"test\");\n        return self.extend({\n          test2: \"cool\"\n        });\n      };\n      M2 = function(I, self) {\n        return self.extend({\n          test2: \"coolio\"\n        });\n      };\n      o.include(M, M2);\n      return equals(o.test2, \"coolio\");\n    });\n  });\n\n}).call(this);\n\n//# sourceURL=test/core.coffee",
                  "type": "blob"
                }
              },
              "progenitor": {
                "url": "http://strd6.github.io/editor/"
              },
              "version": "0.6.0",
              "entryPoint": "core",
              "repository": {
                "id": 13567517,
                "name": "core",
                "full_name": "distri/core",
                "owner": {
                  "login": "distri",
                  "id": 6005125,
                  "avatar_url": "https://identicons.github.com/f90c81ffc1498e260c820082f2e7ca5f.png",
                  "gravatar_id": null,
                  "url": "https://api.github.com/users/distri",
                  "html_url": "https://github.com/distri",
                  "followers_url": "https://api.github.com/users/distri/followers",
                  "following_url": "https://api.github.com/users/distri/following{/other_user}",
                  "gists_url": "https://api.github.com/users/distri/gists{/gist_id}",
                  "starred_url": "https://api.github.com/users/distri/starred{/owner}{/repo}",
                  "subscriptions_url": "https://api.github.com/users/distri/subscriptions",
                  "organizations_url": "https://api.github.com/users/distri/orgs",
                  "repos_url": "https://api.github.com/users/distri/repos",
                  "events_url": "https://api.github.com/users/distri/events{/privacy}",
                  "received_events_url": "https://api.github.com/users/distri/received_events",
                  "type": "Organization",
                  "site_admin": false
                },
                "private": false,
                "html_url": "https://github.com/distri/core",
                "description": "An object extension system.",
                "fork": false,
                "url": "https://api.github.com/repos/distri/core",
                "forks_url": "https://api.github.com/repos/distri/core/forks",
                "keys_url": "https://api.github.com/repos/distri/core/keys{/key_id}",
                "collaborators_url": "https://api.github.com/repos/distri/core/collaborators{/collaborator}",
                "teams_url": "https://api.github.com/repos/distri/core/teams",
                "hooks_url": "https://api.github.com/repos/distri/core/hooks",
                "issue_events_url": "https://api.github.com/repos/distri/core/issues/events{/number}",
                "events_url": "https://api.github.com/repos/distri/core/events",
                "assignees_url": "https://api.github.com/repos/distri/core/assignees{/user}",
                "branches_url": "https://api.github.com/repos/distri/core/branches{/branch}",
                "tags_url": "https://api.github.com/repos/distri/core/tags",
                "blobs_url": "https://api.github.com/repos/distri/core/git/blobs{/sha}",
                "git_tags_url": "https://api.github.com/repos/distri/core/git/tags{/sha}",
                "git_refs_url": "https://api.github.com/repos/distri/core/git/refs{/sha}",
                "trees_url": "https://api.github.com/repos/distri/core/git/trees{/sha}",
                "statuses_url": "https://api.github.com/repos/distri/core/statuses/{sha}",
                "languages_url": "https://api.github.com/repos/distri/core/languages",
                "stargazers_url": "https://api.github.com/repos/distri/core/stargazers",
                "contributors_url": "https://api.github.com/repos/distri/core/contributors",
                "subscribers_url": "https://api.github.com/repos/distri/core/subscribers",
                "subscription_url": "https://api.github.com/repos/distri/core/subscription",
                "commits_url": "https://api.github.com/repos/distri/core/commits{/sha}",
                "git_commits_url": "https://api.github.com/repos/distri/core/git/commits{/sha}",
                "comments_url": "https://api.github.com/repos/distri/core/comments{/number}",
                "issue_comment_url": "https://api.github.com/repos/distri/core/issues/comments/{number}",
                "contents_url": "https://api.github.com/repos/distri/core/contents/{+path}",
                "compare_url": "https://api.github.com/repos/distri/core/compare/{base}...{head}",
                "merges_url": "https://api.github.com/repos/distri/core/merges",
                "archive_url": "https://api.github.com/repos/distri/core/{archive_format}{/ref}",
                "downloads_url": "https://api.github.com/repos/distri/core/downloads",
                "issues_url": "https://api.github.com/repos/distri/core/issues{/number}",
                "pulls_url": "https://api.github.com/repos/distri/core/pulls{/number}",
                "milestones_url": "https://api.github.com/repos/distri/core/milestones{/number}",
                "notifications_url": "https://api.github.com/repos/distri/core/notifications{?since,all,participating}",
                "labels_url": "https://api.github.com/repos/distri/core/labels{/name}",
                "releases_url": "https://api.github.com/repos/distri/core/releases{/id}",
                "created_at": "2013-10-14T17:04:33Z",
                "updated_at": "2013-12-24T00:49:21Z",
                "pushed_at": "2013-10-14T23:49:11Z",
                "git_url": "git://github.com/distri/core.git",
                "ssh_url": "git@github.com:distri/core.git",
                "clone_url": "https://github.com/distri/core.git",
                "svn_url": "https://github.com/distri/core",
                "homepage": null,
                "size": 592,
                "stargazers_count": 0,
                "watchers_count": 0,
                "language": "CoffeeScript",
                "has_issues": true,
                "has_downloads": true,
                "has_wiki": true,
                "forks_count": 0,
                "mirror_url": null,
                "open_issues_count": 0,
                "forks": 0,
                "open_issues": 0,
                "watchers": 0,
                "default_branch": "master",
                "master_branch": "master",
                "permissions": {
                  "admin": true,
                  "push": true,
                  "pull": true
                },
                "organization": {
                  "login": "distri",
                  "id": 6005125,
                  "avatar_url": "https://identicons.github.com/f90c81ffc1498e260c820082f2e7ca5f.png",
                  "gravatar_id": null,
                  "url": "https://api.github.com/users/distri",
                  "html_url": "https://github.com/distri",
                  "followers_url": "https://api.github.com/users/distri/followers",
                  "following_url": "https://api.github.com/users/distri/following{/other_user}",
                  "gists_url": "https://api.github.com/users/distri/gists{/gist_id}",
                  "starred_url": "https://api.github.com/users/distri/starred{/owner}{/repo}",
                  "subscriptions_url": "https://api.github.com/users/distri/subscriptions",
                  "organizations_url": "https://api.github.com/users/distri/orgs",
                  "repos_url": "https://api.github.com/users/distri/repos",
                  "events_url": "https://api.github.com/users/distri/events{/privacy}",
                  "received_events_url": "https://api.github.com/users/distri/received_events",
                  "type": "Organization",
                  "site_admin": false
                },
                "network_count": 0,
                "subscribers_count": 1,
                "branch": "v0.6.0",
                "defaultBranch": "master"
              },
              "dependencies": {}
            },
            "observable": {
              "source": {
                "LICENSE": {
                  "path": "LICENSE",
                  "content": "The MIT License (MIT)\n\nCopyright (c) 2014 distri\n\nPermission is hereby granted, free of charge, to any person obtaining a copy of\nthis software and associated documentation files (the \"Software\"), to deal in\nthe Software without restriction, including without limitation the rights to\nuse, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of\nthe Software, and to permit persons to whom the Software is furnished to do so,\nsubject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS\nFOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR\nCOPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER\nIN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN\nCONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.\n",
                  "mode": "100644",
                  "type": "blob"
                },
                "README.md": {
                  "path": "README.md",
                  "content": "[![Build Status](https://travis-ci.org/distri/observable.svg?branch=npm)](https://travis-ci.org/distri/observable)\n\nObservable\n==========\n\nInstallation\n------------\n\nNode\n\n    npm install o_0\n\nUsage\n-----\n\n    Observable = require \"o_0\"\n\nGet notified when the value changes.\n\n    observable = Observable 5\n\n    observable() # 5\n\n    observable.observe (newValue) ->\n      console.log newValue\n\n    observable 10 # logs 10 to console\n\nArrays\n------\n\nProxy array methods.\n\n    observable = Observable [1, 2, 3]\n\n    observable.forEach (value) ->\n      # 1, 2, 3\n\nFunctions\n---------\n\nAutomagically compute dependencies for observable functions.\n\n    firstName = Observable \"Duder\"\n    lastName = Observable \"Man\"\n\n    o = Observable ->\n      \"#{firstName()} #{lastName()}\"\n\n    o.observe (newValue) ->\n      assert.equal newValue, \"Duder Bro\"\n\n    lastName \"Bro\"\n",
                  "mode": "100644",
                  "type": "blob"
                },
                "main.coffee.md": {
                  "path": "main.coffee.md",
                  "content": "Observable\n==========\n\n`Observable` allows for observing arrays, functions, and objects.\n\nFunction dependencies are automagically observed.\n\nStandard array methods are proxied through to the underlying array.\n\n    Observable = (value, context) ->\n\nReturn the object if it is already an observable object.\n\n      return value if typeof value?.observe is \"function\"\n\nMaintain a set of listeners to observe changes and provide a helper to notify each observer.\n\n      listeners = []\n\n      notify = (newValue) ->\n        copy(listeners).forEach (listener) ->\n          listener(newValue)\n\nOur observable function is stored as a reference to `self`.\n\nIf `value` is a function compute dependencies and listen to observables that it depends on.\n\n      if typeof value is 'function'\n        fn = value\n\nOur return function is a function that holds only a cached value which is updated\nwhen it's dependencies change.\n\nThe `magicDependency` call is so other functions can depend on this computed function the\nsame way we depend on other types of observables.\n\n        self = ->\n          # Automagic dependency observation\n          magicDependency(self)\n\n          return value\n\n        self.each = (args...) ->\n          magicDependency(self)\n\n          splat(value).forEach(args...)\n\n        changed = ->\n          value = computeDependencies(self, fn, changed, context)\n          notify(value)\n\n        value = computeDependencies(self, fn, changed, context)\n\n      else\n\nWhen called with zero arguments it is treated as a getter. When called with one argument it is treated as a setter.\n\nChanges to the value will trigger notifications.\n\nThe value is always returned.\n\n        self = (newValue) ->\n          if arguments.length > 0\n            if value != newValue\n              value = newValue\n\n              notify(newValue)\n          else\n            # Automagic dependency observation\n            magicDependency(self)\n\n          return value\n\nThis `each` iterator is similar to [the Maybe monad](http://en.wikipedia.org/wiki/Monad_&#40;functional_programming&#41;#The_Maybe_monad) in that our observable may contain a single value or nothing at all.\n\n      self.each = (args...) ->\n        magicDependency(self)\n\n        if value?\n          [value].forEach(args...)\n\nIf the value is an array then proxy array methods and add notifications to mutation events.\n\n      if Array.isArray(value)\n        [\n          \"concat\"\n          \"every\"\n          \"filter\"\n          \"forEach\"\n          \"indexOf\"\n          \"join\"\n          \"lastIndexOf\"\n          \"map\"\n          \"reduce\"\n          \"reduceRight\"\n          \"slice\"\n          \"some\"\n        ].forEach (method) ->\n          self[method] = (args...) ->\n            magicDependency(self)\n            value[method](args...)\n\n        [\n          \"pop\"\n          \"push\"\n          \"reverse\"\n          \"shift\"\n          \"splice\"\n          \"sort\"\n          \"unshift\"\n        ].forEach (method) ->\n          self[method] = (args...) ->\n            notifyReturning value[method](args...)\n\n        notifyReturning = (returnValue) ->\n          notify(value)\n\n          return returnValue\n\nAdd some extra helpful methods to array observables.\n\n        extend self,\n          each: (args...) ->\n            self.forEach(args...)\n\n            return self\n\nRemove an element from the array and notify observers of changes.\n\n          remove: (object) ->\n            index = value.indexOf(object)\n\n            if index >= 0\n              notifyReturning value.splice(index, 1)[0]\n\n          get: (index) ->\n            magicDependency(self)\n            value[index]\n\n          first: ->\n            magicDependency(self)\n            value[0]\n\n          last: ->\n            magicDependency(self)\n            value[value.length-1]\n\n          size: ->\n            magicDependency(self)\n            value.length\n\n      extend self,\n        listeners: listeners\n\n        observe: (listener) ->\n          listeners.push listener\n\n        stopObserving: (fn) ->\n          remove listeners, fn\n\n        toggle: ->\n          self !value\n\n        increment: (n) ->\n          self value + n\n\n        decrement: (n) ->\n          self value - n\n\n        toString: ->\n          \"Observable(#{value})\"\n\n      return self\n\n    Observable.concat = (args...) ->\n      args = Observable(args)\n\n      o = Observable ->\n        flatten args.map(splat)\n\n      o.push = args.push\n\n      return o\n\nExport `Observable`\n\n    module.exports = Observable\n\nAppendix\n--------\n\nThe extend method adds one objects properties to another.\n\n    extend = (target, sources...) ->\n      for source in sources\n        for name of source\n          target[name] = source[name]\n\n      return target\n\nSuper hax for computing dependencies. This needs to be a shared global so that\ndifferent bundled versions of observable libraries can interoperate.\n\n    global.OBSERVABLE_ROOT_HACK = []\n\n    autoDeps = ->\n      last(global.OBSERVABLE_ROOT_HACK)\n\n    magicDependency = (self) ->\n      if observerStack = autoDeps()\n        observerStack.push self\n\n    withBase = (self, update, fn) ->\n      global.OBSERVABLE_ROOT_HACK.push(deps = [])\n\n      try\n        value = fn()\n        self._deps?.forEach (observable) ->\n          observable.stopObserving update\n\n        self._deps = deps\n\n        deps.forEach (observable) ->\n          observable.observe update\n      finally\n        global.OBSERVABLE_ROOT_HACK.pop()\n\n      return value\n\nAutomagically compute dependencies.\n\n    computeDependencies = (self, fn, update, context) ->\n      withBase self, update, ->\n        fn.call(context)\n\nRemove a value from an array.\n\n    remove = (array, value) ->\n      index = array.indexOf(value)\n\n      if index >= 0\n        array.splice(index, 1)[0]\n\n    copy = (array) ->\n      array.concat([])\n\n    get = (arg) ->\n      if typeof arg is \"function\"\n        arg()\n      else\n        arg\n\n    splat = (item) ->\n      results = []\n\n      if typeof item.forEach is \"function\"\n        item.forEach (i) ->\n          results.push i\n      else\n        result = get item\n\n        results.push result if result?\n\n      results\n\n    last = (array) ->\n      array[array.length - 1]\n\n    flatten = (array) ->\n      array.reduce (a, b) ->\n        a.concat(b)\n      , []\n",
                  "mode": "100644",
                  "type": "blob"
                },
                "pixie.cson": {
                  "path": "pixie.cson",
                  "content": "version: \"0.3.1\"\n",
                  "mode": "100644",
                  "type": "blob"
                },
                "test/observable.coffee": {
                  "path": "test/observable.coffee",
                  "content": "global.Observable = require \"../main\"\n\ndescribe 'Observable', ->\n  it 'should create an observable for an object', ->\n    n = 5\n\n    observable = Observable(n)\n\n    assert.equal(observable(), n)\n\n  it 'should fire events when setting', ->\n    string = \"yolo\"\n\n    observable = Observable(string)\n    observable.observe (newValue) ->\n      assert.equal newValue, \"4life\"\n\n    observable(\"4life\")\n\n  it 'should be idempotent', ->\n    o = Observable(5)\n\n    assert.equal o, Observable(o)\n\n  describe \"#each\", ->\n    it \"should be invoked once if there is an observable\", ->\n      o = Observable(5)\n      called = 0\n\n      o.each (value) ->\n        called += 1\n        assert.equal value, 5\n\n      assert.equal called, 1\n\n    it \"should not be invoked if observable is null\", ->\n      o = Observable(null)\n      called = 0\n\n      o.each (value) ->\n        called += 1\n\n      assert.equal called, 0\n\n  it \"should allow for stopping observation\", ->\n    observable = Observable(\"string\")\n\n    called = 0\n    fn = (newValue) ->\n      called += 1\n      assert.equal newValue, \"4life\"\n\n    observable.observe fn\n\n    observable(\"4life\")\n\n    observable.stopObserving fn\n\n    observable(\"wat\")\n\n    assert.equal called, 1\n\n  it \"should increment\", ->\n    observable = Observable 1\n\n    observable.increment(5)\n\n    assert.equal observable(), 6\n\n  it \"should decremnet\", ->\n    observable = Observable 1\n\n    observable.decrement 5\n\n    assert.equal observable(), -4\n\n  it \"should toggle\", ->\n    observable = Observable false\n\n    observable.toggle()\n    assert.equal observable(), true\n\n    observable.toggle()\n    assert.equal observable(), false\n\n  it \"should trigger when toggling\", (done) ->\n    observable = Observable true\n    observable.observe (v) ->\n      assert.equal v, false\n      done()\n\n    observable.toggle()\n\ndescribe \"Observable Array\", ->\n  it \"should proxy array methods\", ->\n    o = Observable [5]\n\n    o.map (n) ->\n      assert.equal n, 5\n\n  it \"should notify on mutation methods\", (done) ->\n    o = Observable []\n\n    o.observe (newValue) ->\n      assert.equal newValue[0], 1\n\n    o.push 1\n\n    done()\n\n  it \"should have an each method\", ->\n    o = Observable []\n\n    assert o.each\n\n  it \"#get\", ->\n    o = Observable [0, 1, 2, 3]\n\n    assert.equal o.get(2), 2\n\n  it \"#first\", ->\n    o = Observable [0, 1, 2, 3]\n\n    assert.equal o.first(), 0\n\n  it \"#last\", ->\n    o = Observable [0, 1, 2, 3]\n\n    assert.equal o.last(), 3\n\n  it \"#remove\", (done) ->\n    o = Observable [0, 1, 2, 3]\n\n    o.observe (newValue) ->\n      assert.equal newValue.length, 3\n      setTimeout ->\n        done()\n      , 0\n\n    assert.equal o.remove(2), 2\n\n  # TODO: This looks like it might be impossible\n  it \"should proxy the length property\"\n\ndescribe \"Observable functions\", ->\n  it \"should compute dependencies\", (done) ->\n    firstName = Observable \"Duder\"\n    lastName = Observable \"Man\"\n\n    o = Observable ->\n      \"#{firstName()} #{lastName()}\"\n\n    o.observe (newValue) ->\n      assert.equal newValue, \"Duder Bro\"\n\n      done()\n\n    lastName \"Bro\"\n\n  it \"should compute array#get as a dependency\", ->\n    observableArray = Observable [0, 1, 2]\n\n    observableFn = Observable ->\n      observableArray.get(0)\n\n    assert.equal observableFn(), 0\n\n    observableArray([5])\n\n    assert.equal observableFn(), 5\n\n  it \"should compute array#first as a dependency\", ->\n    observableArray = Observable [0, 1, 2]\n\n    observableFn = Observable ->\n      observableArray.first() + 1\n\n    assert.equal observableFn(), 1\n\n    observableArray([5])\n\n    assert.equal observableFn(), 6\n\n  it \"should compute array#last as a dependency\", ->\n    observableArray = Observable [0, 1, 2]\n\n    observableFn = Observable ->\n      observableArray.last()\n\n    assert.equal observableFn(), 2\n\n    observableArray.pop()\n\n    assert.equal observableFn(), 1\n\n    observableArray([5])\n\n    assert.equal observableFn(), 5\n\n  it \"should compute array#size as a dependency\", ->\n    observableArray = Observable [0, 1, 2]\n\n    observableFn = Observable ->\n      observableArray.size() * 2\n\n    assert.equal observableFn(), 6\n\n    observableArray.pop()\n    assert.equal observableFn(), 4\n    observableArray.shift()\n    assert.equal observableFn(), 2\n\n  it \"should allow double nesting\", (done) ->\n    bottom = Observable \"rad\"\n    middle = Observable ->\n      bottom()\n    top = Observable ->\n      middle()\n\n    top.observe (newValue) ->\n      assert.equal newValue, \"wat\"\n      assert.equal top(), newValue\n      assert.equal middle(), newValue\n\n      done()\n\n    bottom(\"wat\")\n\n  it \"should work with dynamic dependencies\", ->\n    observableArray = Observable []\n\n    dynamicObservable = Observable ->\n      observableArray.filter (item) ->\n        item.age() > 3\n\n    assert.equal dynamicObservable().length, 0\n\n    observableArray.push\n      age: Observable 1\n\n    observableArray()[0].age 5\n    assert.equal dynamicObservable().length, 1\n\n  it \"should work with context\", ->\n    model =\n      a: Observable \"Hello\"\n      b: Observable \"there\"\n\n    model.c = Observable ->\n      \"#{@a()} #{@b()}\"\n    , model\n\n    assert.equal model.c(), \"Hello there\"\n\n    model.b \"world\"\n\n    assert.equal model.c(), \"Hello world\"\n\n  it \"should be ok even if the function throws an exception\", ->\n    assert.throws ->\n      t = Observable ->\n        throw \"wat\"\n\n    # TODO: Should be able to find a test case that is affected by this rather that\n    # checking it directly\n    assert.equal global.OBSERVABLE_ROOT_HACK.length, 0\n\n  it \"should have an each method\", ->\n    o = Observable ->\n\n    assert o.each\n\n  it \"should not invoke when returning undefined\", ->\n    o = Observable ->\n\n    o.each ->\n      assert false\n\n  it \"should invoke when returning any defined value\", (done) ->\n    o = Observable -> 5\n\n    o.each (n) ->\n      assert.equal n, 5\n      done()\n\n  it \"should work on an array dependency\", ->\n    oA = Observable [1, 2, 3]\n\n    o = Observable ->\n      oA()[0]\n\n    last = Observable ->\n      oA()[oA().length-1]\n\n    assert.equal o(), 1\n\n    oA.unshift 0\n\n    assert.equal o(), 0\n\n    oA.push 4\n\n    assert.equal last(), 4, \"Last should be 4\"\n\n  it \"should work with multiple dependencies\", ->\n    letter = Observable \"A\"\n    checked = ->\n      l = letter()\n      @name().indexOf(l) is 0\n\n    first = {name: Observable(\"Andrew\")}\n    first.checked = Observable checked, first\n\n    second = {name: Observable(\"Benjamin\")}\n    second.checked = Observable checked, second\n\n    assert.equal first.checked(), true\n    assert.equal second.checked(), false\n\n    assert.equal letter.listeners.length, 2\n\n    letter \"B\"\n\n    assert.equal first.checked(), false\n    assert.equal second.checked(), true\n\n  it \"should work with nested observable construction\", ->\n    gen = Observable ->\n      Observable \"Duder\"\n\n    o = gen()\n\n    assert.equal o(), \"Duder\"\n\n    o(\"wat\")\n\n    assert.equal o(), \"wat\"\n\n  describe \"Scoping\", ->\n    it \"should be scoped to optional context\", (done) ->\n      model =\n        firstName: Observable \"Duder\"\n        lastName: Observable \"Man\"\n\n      model.name = Observable ->\n        \"#{@firstName()} #{@lastName()}\"\n      , model\n\n      model.name.observe (newValue) ->\n        assert.equal newValue, \"Duder Bro\"\n\n        done()\n\n      model.lastName \"Bro\"\n\n  describe \"concat\", ->\n    it \"should return an observable array that changes based on changes in inputs\", ->\n      numbers = Observable [1, 2, 3]\n      letters = Observable [\"a\", \"b\", \"c\"]\n      item = Observable({})\n      nullable = Observable null\n\n      observableArray = Observable.concat numbers, \"literal\", letters, item, nullable\n\n      assert.equal observableArray().length, 3 + 1 + 3 + 1\n\n      assert.equal observableArray()[0], 1\n      assert.equal observableArray()[3], \"literal\"\n      assert.equal observableArray()[4], \"a\"\n      assert.equal observableArray()[7], item()\n\n      numbers.push 4\n\n      assert.equal observableArray().length, 9\n\n      nullable \"cool\"\n\n      assert.equal observableArray().length, 10\n\n    it \"should work with observable functions that return arrays\", ->\n      item = Observable(\"wat\")\n\n      computedArray = Observable ->\n        [item()]\n\n      observableArray = Observable.concat computedArray, computedArray\n\n      assert.equal observableArray().length, 2\n\n      assert.equal observableArray()[1], \"wat\"\n\n      item \"yolo\"\n\n      assert.equal observableArray()[1], \"yolo\"\n\n    it \"should have a push method\", ->\n      observableArray = Observable.concat()\n\n      observable = Observable \"hey\"\n\n      observableArray.push observable\n\n      assert.equal observableArray()[0], \"hey\"\n\n      observable \"wat\"\n\n      assert.equal observableArray()[0], \"wat\"\n\n      observableArray.push \"cool\"\n      observableArray.push \"radical\"\n\n      assert.equal observableArray().length, 3\n\n    it \"should be observable\", (done) ->\n      observableArray = Observable.concat()\n\n      observableArray.observe (items) ->\n        assert.equal items.length, 3\n        done()\n\n      observableArray.push [\"A\", \"B\", \"C\"]\n\n    it \"should have an each method\", ->\n      observableArray = Observable.concat([\"A\", \"B\", \"C\"])\n\n      n = 0\n      observableArray.each () ->\n        n += 1\n\n      assert.equal n, 3\n",
                  "mode": "100644",
                  "type": "blob"
                }
              },
              "distribution": {
                "main": {
                  "path": "main",
                  "content": "(function() {\n  var Observable, autoDeps, computeDependencies, copy, extend, flatten, get, last, magicDependency, remove, splat, withBase,\n    __slice = [].slice;\n\n  Observable = function(value, context) {\n    var changed, fn, listeners, notify, notifyReturning, self;\n    if (typeof (value != null ? value.observe : void 0) === \"function\") {\n      return value;\n    }\n    listeners = [];\n    notify = function(newValue) {\n      return copy(listeners).forEach(function(listener) {\n        return listener(newValue);\n      });\n    };\n    if (typeof value === 'function') {\n      fn = value;\n      self = function() {\n        magicDependency(self);\n        return value;\n      };\n      self.each = function() {\n        var args, _ref;\n        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];\n        magicDependency(self);\n        return (_ref = splat(value)).forEach.apply(_ref, args);\n      };\n      changed = function() {\n        value = computeDependencies(self, fn, changed, context);\n        return notify(value);\n      };\n      value = computeDependencies(self, fn, changed, context);\n    } else {\n      self = function(newValue) {\n        if (arguments.length > 0) {\n          if (value !== newValue) {\n            value = newValue;\n            notify(newValue);\n          }\n        } else {\n          magicDependency(self);\n        }\n        return value;\n      };\n    }\n    self.each = function() {\n      var args, _ref;\n      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];\n      magicDependency(self);\n      if (value != null) {\n        return (_ref = [value]).forEach.apply(_ref, args);\n      }\n    };\n    if (Array.isArray(value)) {\n      [\"concat\", \"every\", \"filter\", \"forEach\", \"indexOf\", \"join\", \"lastIndexOf\", \"map\", \"reduce\", \"reduceRight\", \"slice\", \"some\"].forEach(function(method) {\n        return self[method] = function() {\n          var args;\n          args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];\n          magicDependency(self);\n          return value[method].apply(value, args);\n        };\n      });\n      [\"pop\", \"push\", \"reverse\", \"shift\", \"splice\", \"sort\", \"unshift\"].forEach(function(method) {\n        return self[method] = function() {\n          var args;\n          args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];\n          return notifyReturning(value[method].apply(value, args));\n        };\n      });\n      notifyReturning = function(returnValue) {\n        notify(value);\n        return returnValue;\n      };\n      extend(self, {\n        each: function() {\n          var args;\n          args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];\n          self.forEach.apply(self, args);\n          return self;\n        },\n        remove: function(object) {\n          var index;\n          index = value.indexOf(object);\n          if (index >= 0) {\n            return notifyReturning(value.splice(index, 1)[0]);\n          }\n        },\n        get: function(index) {\n          magicDependency(self);\n          return value[index];\n        },\n        first: function() {\n          magicDependency(self);\n          return value[0];\n        },\n        last: function() {\n          magicDependency(self);\n          return value[value.length - 1];\n        },\n        size: function() {\n          magicDependency(self);\n          return value.length;\n        }\n      });\n    }\n    extend(self, {\n      listeners: listeners,\n      observe: function(listener) {\n        return listeners.push(listener);\n      },\n      stopObserving: function(fn) {\n        return remove(listeners, fn);\n      },\n      toggle: function() {\n        return self(!value);\n      },\n      increment: function(n) {\n        return self(value + n);\n      },\n      decrement: function(n) {\n        return self(value - n);\n      },\n      toString: function() {\n        return \"Observable(\" + value + \")\";\n      }\n    });\n    return self;\n  };\n\n  Observable.concat = function() {\n    var args, o;\n    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];\n    args = Observable(args);\n    o = Observable(function() {\n      return flatten(args.map(splat));\n    });\n    o.push = args.push;\n    return o;\n  };\n\n  module.exports = Observable;\n\n  extend = function() {\n    var name, source, sources, target, _i, _len;\n    target = arguments[0], sources = 2 <= arguments.length ? __slice.call(arguments, 1) : [];\n    for (_i = 0, _len = sources.length; _i < _len; _i++) {\n      source = sources[_i];\n      for (name in source) {\n        target[name] = source[name];\n      }\n    }\n    return target;\n  };\n\n  global.OBSERVABLE_ROOT_HACK = [];\n\n  autoDeps = function() {\n    return last(global.OBSERVABLE_ROOT_HACK);\n  };\n\n  magicDependency = function(self) {\n    var observerStack;\n    if (observerStack = autoDeps()) {\n      return observerStack.push(self);\n    }\n  };\n\n  withBase = function(self, update, fn) {\n    var deps, value, _ref;\n    global.OBSERVABLE_ROOT_HACK.push(deps = []);\n    try {\n      value = fn();\n      if ((_ref = self._deps) != null) {\n        _ref.forEach(function(observable) {\n          return observable.stopObserving(update);\n        });\n      }\n      self._deps = deps;\n      deps.forEach(function(observable) {\n        return observable.observe(update);\n      });\n    } finally {\n      global.OBSERVABLE_ROOT_HACK.pop();\n    }\n    return value;\n  };\n\n  computeDependencies = function(self, fn, update, context) {\n    return withBase(self, update, function() {\n      return fn.call(context);\n    });\n  };\n\n  remove = function(array, value) {\n    var index;\n    index = array.indexOf(value);\n    if (index >= 0) {\n      return array.splice(index, 1)[0];\n    }\n  };\n\n  copy = function(array) {\n    return array.concat([]);\n  };\n\n  get = function(arg) {\n    if (typeof arg === \"function\") {\n      return arg();\n    } else {\n      return arg;\n    }\n  };\n\n  splat = function(item) {\n    var result, results;\n    results = [];\n    if (typeof item.forEach === \"function\") {\n      item.forEach(function(i) {\n        return results.push(i);\n      });\n    } else {\n      result = get(item);\n      if (result != null) {\n        results.push(result);\n      }\n    }\n    return results;\n  };\n\n  last = function(array) {\n    return array[array.length - 1];\n  };\n\n  flatten = function(array) {\n    return array.reduce(function(a, b) {\n      return a.concat(b);\n    }, []);\n  };\n\n}).call(this);\n",
                  "type": "blob"
                },
                "pixie": {
                  "path": "pixie",
                  "content": "module.exports = {\"version\":\"0.3.1\"};",
                  "type": "blob"
                },
                "test/observable": {
                  "path": "test/observable",
                  "content": "(function() {\n  global.Observable = require(\"../main\");\n\n  describe('Observable', function() {\n    it('should create an observable for an object', function() {\n      var n, observable;\n      n = 5;\n      observable = Observable(n);\n      return assert.equal(observable(), n);\n    });\n    it('should fire events when setting', function() {\n      var observable, string;\n      string = \"yolo\";\n      observable = Observable(string);\n      observable.observe(function(newValue) {\n        return assert.equal(newValue, \"4life\");\n      });\n      return observable(\"4life\");\n    });\n    it('should be idempotent', function() {\n      var o;\n      o = Observable(5);\n      return assert.equal(o, Observable(o));\n    });\n    describe(\"#each\", function() {\n      it(\"should be invoked once if there is an observable\", function() {\n        var called, o;\n        o = Observable(5);\n        called = 0;\n        o.each(function(value) {\n          called += 1;\n          return assert.equal(value, 5);\n        });\n        return assert.equal(called, 1);\n      });\n      return it(\"should not be invoked if observable is null\", function() {\n        var called, o;\n        o = Observable(null);\n        called = 0;\n        o.each(function(value) {\n          return called += 1;\n        });\n        return assert.equal(called, 0);\n      });\n    });\n    it(\"should allow for stopping observation\", function() {\n      var called, fn, observable;\n      observable = Observable(\"string\");\n      called = 0;\n      fn = function(newValue) {\n        called += 1;\n        return assert.equal(newValue, \"4life\");\n      };\n      observable.observe(fn);\n      observable(\"4life\");\n      observable.stopObserving(fn);\n      observable(\"wat\");\n      return assert.equal(called, 1);\n    });\n    it(\"should increment\", function() {\n      var observable;\n      observable = Observable(1);\n      observable.increment(5);\n      return assert.equal(observable(), 6);\n    });\n    it(\"should decremnet\", function() {\n      var observable;\n      observable = Observable(1);\n      observable.decrement(5);\n      return assert.equal(observable(), -4);\n    });\n    it(\"should toggle\", function() {\n      var observable;\n      observable = Observable(false);\n      observable.toggle();\n      assert.equal(observable(), true);\n      observable.toggle();\n      return assert.equal(observable(), false);\n    });\n    return it(\"should trigger when toggling\", function(done) {\n      var observable;\n      observable = Observable(true);\n      observable.observe(function(v) {\n        assert.equal(v, false);\n        return done();\n      });\n      return observable.toggle();\n    });\n  });\n\n  describe(\"Observable Array\", function() {\n    it(\"should proxy array methods\", function() {\n      var o;\n      o = Observable([5]);\n      return o.map(function(n) {\n        return assert.equal(n, 5);\n      });\n    });\n    it(\"should notify on mutation methods\", function(done) {\n      var o;\n      o = Observable([]);\n      o.observe(function(newValue) {\n        return assert.equal(newValue[0], 1);\n      });\n      o.push(1);\n      return done();\n    });\n    it(\"should have an each method\", function() {\n      var o;\n      o = Observable([]);\n      return assert(o.each);\n    });\n    it(\"#get\", function() {\n      var o;\n      o = Observable([0, 1, 2, 3]);\n      return assert.equal(o.get(2), 2);\n    });\n    it(\"#first\", function() {\n      var o;\n      o = Observable([0, 1, 2, 3]);\n      return assert.equal(o.first(), 0);\n    });\n    it(\"#last\", function() {\n      var o;\n      o = Observable([0, 1, 2, 3]);\n      return assert.equal(o.last(), 3);\n    });\n    it(\"#remove\", function(done) {\n      var o;\n      o = Observable([0, 1, 2, 3]);\n      o.observe(function(newValue) {\n        assert.equal(newValue.length, 3);\n        return setTimeout(function() {\n          return done();\n        }, 0);\n      });\n      return assert.equal(o.remove(2), 2);\n    });\n    return it(\"should proxy the length property\");\n  });\n\n  describe(\"Observable functions\", function() {\n    it(\"should compute dependencies\", function(done) {\n      var firstName, lastName, o;\n      firstName = Observable(\"Duder\");\n      lastName = Observable(\"Man\");\n      o = Observable(function() {\n        return \"\" + (firstName()) + \" \" + (lastName());\n      });\n      o.observe(function(newValue) {\n        assert.equal(newValue, \"Duder Bro\");\n        return done();\n      });\n      return lastName(\"Bro\");\n    });\n    it(\"should compute array#get as a dependency\", function() {\n      var observableArray, observableFn;\n      observableArray = Observable([0, 1, 2]);\n      observableFn = Observable(function() {\n        return observableArray.get(0);\n      });\n      assert.equal(observableFn(), 0);\n      observableArray([5]);\n      return assert.equal(observableFn(), 5);\n    });\n    it(\"should compute array#first as a dependency\", function() {\n      var observableArray, observableFn;\n      observableArray = Observable([0, 1, 2]);\n      observableFn = Observable(function() {\n        return observableArray.first() + 1;\n      });\n      assert.equal(observableFn(), 1);\n      observableArray([5]);\n      return assert.equal(observableFn(), 6);\n    });\n    it(\"should compute array#last as a dependency\", function() {\n      var observableArray, observableFn;\n      observableArray = Observable([0, 1, 2]);\n      observableFn = Observable(function() {\n        return observableArray.last();\n      });\n      assert.equal(observableFn(), 2);\n      observableArray.pop();\n      assert.equal(observableFn(), 1);\n      observableArray([5]);\n      return assert.equal(observableFn(), 5);\n    });\n    it(\"should compute array#size as a dependency\", function() {\n      var observableArray, observableFn;\n      observableArray = Observable([0, 1, 2]);\n      observableFn = Observable(function() {\n        return observableArray.size() * 2;\n      });\n      assert.equal(observableFn(), 6);\n      observableArray.pop();\n      assert.equal(observableFn(), 4);\n      observableArray.shift();\n      return assert.equal(observableFn(), 2);\n    });\n    it(\"should allow double nesting\", function(done) {\n      var bottom, middle, top;\n      bottom = Observable(\"rad\");\n      middle = Observable(function() {\n        return bottom();\n      });\n      top = Observable(function() {\n        return middle();\n      });\n      top.observe(function(newValue) {\n        assert.equal(newValue, \"wat\");\n        assert.equal(top(), newValue);\n        assert.equal(middle(), newValue);\n        return done();\n      });\n      return bottom(\"wat\");\n    });\n    it(\"should work with dynamic dependencies\", function() {\n      var dynamicObservable, observableArray;\n      observableArray = Observable([]);\n      dynamicObservable = Observable(function() {\n        return observableArray.filter(function(item) {\n          return item.age() > 3;\n        });\n      });\n      assert.equal(dynamicObservable().length, 0);\n      observableArray.push({\n        age: Observable(1)\n      });\n      observableArray()[0].age(5);\n      return assert.equal(dynamicObservable().length, 1);\n    });\n    it(\"should work with context\", function() {\n      var model;\n      model = {\n        a: Observable(\"Hello\"),\n        b: Observable(\"there\")\n      };\n      model.c = Observable(function() {\n        return \"\" + (this.a()) + \" \" + (this.b());\n      }, model);\n      assert.equal(model.c(), \"Hello there\");\n      model.b(\"world\");\n      return assert.equal(model.c(), \"Hello world\");\n    });\n    it(\"should be ok even if the function throws an exception\", function() {\n      assert.throws(function() {\n        var t;\n        return t = Observable(function() {\n          throw \"wat\";\n        });\n      });\n      return assert.equal(global.OBSERVABLE_ROOT_HACK.length, 0);\n    });\n    it(\"should have an each method\", function() {\n      var o;\n      o = Observable(function() {});\n      return assert(o.each);\n    });\n    it(\"should not invoke when returning undefined\", function() {\n      var o;\n      o = Observable(function() {});\n      return o.each(function() {\n        return assert(false);\n      });\n    });\n    it(\"should invoke when returning any defined value\", function(done) {\n      var o;\n      o = Observable(function() {\n        return 5;\n      });\n      return o.each(function(n) {\n        assert.equal(n, 5);\n        return done();\n      });\n    });\n    it(\"should work on an array dependency\", function() {\n      var last, o, oA;\n      oA = Observable([1, 2, 3]);\n      o = Observable(function() {\n        return oA()[0];\n      });\n      last = Observable(function() {\n        return oA()[oA().length - 1];\n      });\n      assert.equal(o(), 1);\n      oA.unshift(0);\n      assert.equal(o(), 0);\n      oA.push(4);\n      return assert.equal(last(), 4, \"Last should be 4\");\n    });\n    it(\"should work with multiple dependencies\", function() {\n      var checked, first, letter, second;\n      letter = Observable(\"A\");\n      checked = function() {\n        var l;\n        l = letter();\n        return this.name().indexOf(l) === 0;\n      };\n      first = {\n        name: Observable(\"Andrew\")\n      };\n      first.checked = Observable(checked, first);\n      second = {\n        name: Observable(\"Benjamin\")\n      };\n      second.checked = Observable(checked, second);\n      assert.equal(first.checked(), true);\n      assert.equal(second.checked(), false);\n      assert.equal(letter.listeners.length, 2);\n      letter(\"B\");\n      assert.equal(first.checked(), false);\n      return assert.equal(second.checked(), true);\n    });\n    it(\"should work with nested observable construction\", function() {\n      var gen, o;\n      gen = Observable(function() {\n        return Observable(\"Duder\");\n      });\n      o = gen();\n      assert.equal(o(), \"Duder\");\n      o(\"wat\");\n      return assert.equal(o(), \"wat\");\n    });\n    describe(\"Scoping\", function() {\n      return it(\"should be scoped to optional context\", function(done) {\n        var model;\n        model = {\n          firstName: Observable(\"Duder\"),\n          lastName: Observable(\"Man\")\n        };\n        model.name = Observable(function() {\n          return \"\" + (this.firstName()) + \" \" + (this.lastName());\n        }, model);\n        model.name.observe(function(newValue) {\n          assert.equal(newValue, \"Duder Bro\");\n          return done();\n        });\n        return model.lastName(\"Bro\");\n      });\n    });\n    return describe(\"concat\", function() {\n      it(\"should return an observable array that changes based on changes in inputs\", function() {\n        var item, letters, nullable, numbers, observableArray;\n        numbers = Observable([1, 2, 3]);\n        letters = Observable([\"a\", \"b\", \"c\"]);\n        item = Observable({});\n        nullable = Observable(null);\n        observableArray = Observable.concat(numbers, \"literal\", letters, item, nullable);\n        assert.equal(observableArray().length, 3 + 1 + 3 + 1);\n        assert.equal(observableArray()[0], 1);\n        assert.equal(observableArray()[3], \"literal\");\n        assert.equal(observableArray()[4], \"a\");\n        assert.equal(observableArray()[7], item());\n        numbers.push(4);\n        assert.equal(observableArray().length, 9);\n        nullable(\"cool\");\n        return assert.equal(observableArray().length, 10);\n      });\n      it(\"should work with observable functions that return arrays\", function() {\n        var computedArray, item, observableArray;\n        item = Observable(\"wat\");\n        computedArray = Observable(function() {\n          return [item()];\n        });\n        observableArray = Observable.concat(computedArray, computedArray);\n        assert.equal(observableArray().length, 2);\n        assert.equal(observableArray()[1], \"wat\");\n        item(\"yolo\");\n        return assert.equal(observableArray()[1], \"yolo\");\n      });\n      it(\"should have a push method\", function() {\n        var observable, observableArray;\n        observableArray = Observable.concat();\n        observable = Observable(\"hey\");\n        observableArray.push(observable);\n        assert.equal(observableArray()[0], \"hey\");\n        observable(\"wat\");\n        assert.equal(observableArray()[0], \"wat\");\n        observableArray.push(\"cool\");\n        observableArray.push(\"radical\");\n        return assert.equal(observableArray().length, 3);\n      });\n      it(\"should be observable\", function(done) {\n        var observableArray;\n        observableArray = Observable.concat();\n        observableArray.observe(function(items) {\n          assert.equal(items.length, 3);\n          return done();\n        });\n        return observableArray.push([\"A\", \"B\", \"C\"]);\n      });\n      return it(\"should have an each method\", function() {\n        var n, observableArray;\n        observableArray = Observable.concat([\"A\", \"B\", \"C\"]);\n        n = 0;\n        observableArray.each(function() {\n          return n += 1;\n        });\n        return assert.equal(n, 3);\n      });\n    });\n  });\n\n}).call(this);\n",
                  "type": "blob"
                }
              },
              "progenitor": {
                "url": "http://www.danielx.net/editor/"
              },
              "version": "0.3.1",
              "entryPoint": "main",
              "repository": {
                "branch": "v0.3.1",
                "default_branch": "master",
                "full_name": "distri/observable",
                "homepage": "http://observable.us",
                "description": "",
                "html_url": "https://github.com/distri/observable",
                "url": "https://api.github.com/repos/distri/observable",
                "publishBranch": "gh-pages"
              },
              "dependencies": {}
            }
          }
        },
        "observable": {
          "source": {
            "LICENSE": {
              "path": "LICENSE",
              "content": "The MIT License (MIT)\n\nCopyright (c) 2014 distri\n\nPermission is hereby granted, free of charge, to any person obtaining a copy of\nthis software and associated documentation files (the \"Software\"), to deal in\nthe Software without restriction, including without limitation the rights to\nuse, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of\nthe Software, and to permit persons to whom the Software is furnished to do so,\nsubject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS\nFOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR\nCOPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER\nIN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN\nCONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.\n",
              "mode": "100644",
              "type": "blob"
            },
            "README.md": {
              "path": "README.md",
              "content": "[![Build Status](https://travis-ci.org/distri/observable.svg?branch=npm)](https://travis-ci.org/distri/observable)\n\nObservable\n==========\n\nInstallation\n------------\n\nNode\n\n    npm install o_0\n\nUsage\n-----\n\n    Observable = require \"o_0\"\n\nGet notified when the value changes.\n\n    observable = Observable 5\n\n    observable() # 5\n\n    observable.observe (newValue) ->\n      console.log newValue\n\n    observable 10 # logs 10 to console\n\nArrays\n------\n\nProxy array methods.\n\n    observable = Observable [1, 2, 3]\n\n    observable.forEach (value) ->\n      # 1, 2, 3\n\nFunctions\n---------\n\nAutomagically compute dependencies for observable functions.\n\n    firstName = Observable \"Duder\"\n    lastName = Observable \"Man\"\n\n    o = Observable ->\n      \"#{firstName()} #{lastName()}\"\n\n    o.observe (newValue) ->\n      assert.equal newValue, \"Duder Bro\"\n\n    lastName \"Bro\"\n",
              "mode": "100644",
              "type": "blob"
            },
            "main.coffee.md": {
              "path": "main.coffee.md",
              "content": "Observable\n==========\n\n`Observable` allows for observing arrays, functions, and objects.\n\nFunction dependencies are automagically observed.\n\nStandard array methods are proxied through to the underlying array.\n\n    Observable = (value, context) ->\n\nReturn the object if it is already an observable object.\n\n      return value if typeof value?.observe is \"function\"\n\nMaintain a set of listeners to observe changes and provide a helper to notify each observer.\n\n      listeners = []\n\n      notify = (newValue) ->\n        copy(listeners).forEach (listener) ->\n          listener(newValue)\n\nOur observable function is stored as a reference to `self`.\n\nIf `value` is a function compute dependencies and listen to observables that it depends on.\n\n      if typeof value is 'function'\n        fn = value\n\nOur return function is a function that holds only a cached value which is updated\nwhen it's dependencies change.\n\nThe `magicDependency` call is so other functions can depend on this computed function the\nsame way we depend on other types of observables.\n\n        self = ->\n          # Automagic dependency observation\n          magicDependency(self)\n\n          return value\n\n        self.each = (args...) ->\n          magicDependency(self)\n\n          splat(value).forEach(args...)\n\n        changed = ->\n          value = computeDependencies(self, fn, changed, context)\n          notify(value)\n\n        value = computeDependencies(self, fn, changed, context)\n\n      else\n\nWhen called with zero arguments it is treated as a getter. When called with one argument it is treated as a setter.\n\nChanges to the value will trigger notifications.\n\nThe value is always returned.\n\n        self = (newValue) ->\n          if arguments.length > 0\n            if value != newValue\n              value = newValue\n\n              notify(newValue)\n          else\n            # Automagic dependency observation\n            magicDependency(self)\n\n          return value\n\nThis `each` iterator is similar to [the Maybe monad](http://en.wikipedia.org/wiki/Monad_&#40;functional_programming&#41;#The_Maybe_monad) in that our observable may contain a single value or nothing at all.\n\n      self.each = (args...) ->\n        magicDependency(self)\n\n        if value?\n          [value].forEach(args...)\n\nIf the value is an array then proxy array methods and add notifications to mutation events.\n\n      if Array.isArray(value)\n        [\n          \"concat\"\n          \"every\"\n          \"filter\"\n          \"forEach\"\n          \"indexOf\"\n          \"join\"\n          \"lastIndexOf\"\n          \"map\"\n          \"reduce\"\n          \"reduceRight\"\n          \"slice\"\n          \"some\"\n        ].forEach (method) ->\n          self[method] = (args...) ->\n            magicDependency(self)\n            value[method](args...)\n\n        [\n          \"pop\"\n          \"push\"\n          \"reverse\"\n          \"shift\"\n          \"splice\"\n          \"sort\"\n          \"unshift\"\n        ].forEach (method) ->\n          self[method] = (args...) ->\n            notifyReturning value[method](args...)\n\n        notifyReturning = (returnValue) ->\n          notify(value)\n\n          return returnValue\n\nAdd some extra helpful methods to array observables.\n\n        extend self,\n          each: (args...) ->\n            self.forEach(args...)\n\n            return self\n\nRemove an element from the array and notify observers of changes.\n\n          remove: (object) ->\n            index = value.indexOf(object)\n\n            if index >= 0\n              notifyReturning value.splice(index, 1)[0]\n\n          get: (index) ->\n            magicDependency(self)\n            value[index]\n\n          first: ->\n            magicDependency(self)\n            value[0]\n\n          last: ->\n            magicDependency(self)\n            value[value.length-1]\n\n          size: ->\n            magicDependency(self)\n            value.length\n\n      extend self,\n        listeners: listeners\n\n        observe: (listener) ->\n          listeners.push listener\n\n        stopObserving: (fn) ->\n          remove listeners, fn\n\n        toggle: ->\n          self !value\n\n        increment: (n) ->\n          self value + n\n\n        decrement: (n) ->\n          self value - n\n\n        toString: ->\n          \"Observable(#{value})\"\n\n      return self\n\n    Observable.concat = (args...) ->\n      args = Observable(args)\n\n      o = Observable ->\n        flatten args.map(splat)\n\n      o.push = args.push\n\n      return o\n\nExport `Observable`\n\n    module.exports = Observable\n\nAppendix\n--------\n\nThe extend method adds one objects properties to another.\n\n    extend = (target, sources...) ->\n      for source in sources\n        for name of source\n          target[name] = source[name]\n\n      return target\n\nSuper hax for computing dependencies. This needs to be a shared global so that\ndifferent bundled versions of observable libraries can interoperate.\n\n    global.OBSERVABLE_ROOT_HACK = []\n\n    autoDeps = ->\n      last(global.OBSERVABLE_ROOT_HACK)\n\n    magicDependency = (self) ->\n      if observerStack = autoDeps()\n        observerStack.push self\n\n    withBase = (self, update, fn) ->\n      global.OBSERVABLE_ROOT_HACK.push(deps = [])\n\n      try\n        value = fn()\n        self._deps?.forEach (observable) ->\n          observable.stopObserving update\n\n        self._deps = deps\n\n        deps.forEach (observable) ->\n          observable.observe update\n      finally\n        global.OBSERVABLE_ROOT_HACK.pop()\n\n      return value\n\nAutomagically compute dependencies.\n\n    computeDependencies = (self, fn, update, context) ->\n      withBase self, update, ->\n        fn.call(context)\n\nRemove a value from an array.\n\n    remove = (array, value) ->\n      index = array.indexOf(value)\n\n      if index >= 0\n        array.splice(index, 1)[0]\n\n    copy = (array) ->\n      array.concat([])\n\n    get = (arg) ->\n      if typeof arg is \"function\"\n        arg()\n      else\n        arg\n\n    splat = (item) ->\n      results = []\n\n      if typeof item.forEach is \"function\"\n        item.forEach (i) ->\n          results.push i\n      else\n        result = get item\n\n        results.push result if result?\n\n      results\n\n    last = (array) ->\n      array[array.length - 1]\n\n    flatten = (array) ->\n      array.reduce (a, b) ->\n        a.concat(b)\n      , []\n",
              "mode": "100644",
              "type": "blob"
            },
            "pixie.cson": {
              "path": "pixie.cson",
              "content": "version: \"0.3.1\"\n",
              "mode": "100644",
              "type": "blob"
            },
            "test/observable.coffee": {
              "path": "test/observable.coffee",
              "content": "global.Observable = require \"../main\"\n\ndescribe 'Observable', ->\n  it 'should create an observable for an object', ->\n    n = 5\n\n    observable = Observable(n)\n\n    assert.equal(observable(), n)\n\n  it 'should fire events when setting', ->\n    string = \"yolo\"\n\n    observable = Observable(string)\n    observable.observe (newValue) ->\n      assert.equal newValue, \"4life\"\n\n    observable(\"4life\")\n\n  it 'should be idempotent', ->\n    o = Observable(5)\n\n    assert.equal o, Observable(o)\n\n  describe \"#each\", ->\n    it \"should be invoked once if there is an observable\", ->\n      o = Observable(5)\n      called = 0\n\n      o.each (value) ->\n        called += 1\n        assert.equal value, 5\n\n      assert.equal called, 1\n\n    it \"should not be invoked if observable is null\", ->\n      o = Observable(null)\n      called = 0\n\n      o.each (value) ->\n        called += 1\n\n      assert.equal called, 0\n\n  it \"should allow for stopping observation\", ->\n    observable = Observable(\"string\")\n\n    called = 0\n    fn = (newValue) ->\n      called += 1\n      assert.equal newValue, \"4life\"\n\n    observable.observe fn\n\n    observable(\"4life\")\n\n    observable.stopObserving fn\n\n    observable(\"wat\")\n\n    assert.equal called, 1\n\n  it \"should increment\", ->\n    observable = Observable 1\n\n    observable.increment(5)\n\n    assert.equal observable(), 6\n\n  it \"should decremnet\", ->\n    observable = Observable 1\n\n    observable.decrement 5\n\n    assert.equal observable(), -4\n\n  it \"should toggle\", ->\n    observable = Observable false\n\n    observable.toggle()\n    assert.equal observable(), true\n\n    observable.toggle()\n    assert.equal observable(), false\n\n  it \"should trigger when toggling\", (done) ->\n    observable = Observable true\n    observable.observe (v) ->\n      assert.equal v, false\n      done()\n\n    observable.toggle()\n\ndescribe \"Observable Array\", ->\n  it \"should proxy array methods\", ->\n    o = Observable [5]\n\n    o.map (n) ->\n      assert.equal n, 5\n\n  it \"should notify on mutation methods\", (done) ->\n    o = Observable []\n\n    o.observe (newValue) ->\n      assert.equal newValue[0], 1\n\n    o.push 1\n\n    done()\n\n  it \"should have an each method\", ->\n    o = Observable []\n\n    assert o.each\n\n  it \"#get\", ->\n    o = Observable [0, 1, 2, 3]\n\n    assert.equal o.get(2), 2\n\n  it \"#first\", ->\n    o = Observable [0, 1, 2, 3]\n\n    assert.equal o.first(), 0\n\n  it \"#last\", ->\n    o = Observable [0, 1, 2, 3]\n\n    assert.equal o.last(), 3\n\n  it \"#remove\", (done) ->\n    o = Observable [0, 1, 2, 3]\n\n    o.observe (newValue) ->\n      assert.equal newValue.length, 3\n      setTimeout ->\n        done()\n      , 0\n\n    assert.equal o.remove(2), 2\n\n  # TODO: This looks like it might be impossible\n  it \"should proxy the length property\"\n\ndescribe \"Observable functions\", ->\n  it \"should compute dependencies\", (done) ->\n    firstName = Observable \"Duder\"\n    lastName = Observable \"Man\"\n\n    o = Observable ->\n      \"#{firstName()} #{lastName()}\"\n\n    o.observe (newValue) ->\n      assert.equal newValue, \"Duder Bro\"\n\n      done()\n\n    lastName \"Bro\"\n\n  it \"should compute array#get as a dependency\", ->\n    observableArray = Observable [0, 1, 2]\n\n    observableFn = Observable ->\n      observableArray.get(0)\n\n    assert.equal observableFn(), 0\n\n    observableArray([5])\n\n    assert.equal observableFn(), 5\n\n  it \"should compute array#first as a dependency\", ->\n    observableArray = Observable [0, 1, 2]\n\n    observableFn = Observable ->\n      observableArray.first() + 1\n\n    assert.equal observableFn(), 1\n\n    observableArray([5])\n\n    assert.equal observableFn(), 6\n\n  it \"should compute array#last as a dependency\", ->\n    observableArray = Observable [0, 1, 2]\n\n    observableFn = Observable ->\n      observableArray.last()\n\n    assert.equal observableFn(), 2\n\n    observableArray.pop()\n\n    assert.equal observableFn(), 1\n\n    observableArray([5])\n\n    assert.equal observableFn(), 5\n\n  it \"should compute array#size as a dependency\", ->\n    observableArray = Observable [0, 1, 2]\n\n    observableFn = Observable ->\n      observableArray.size() * 2\n\n    assert.equal observableFn(), 6\n\n    observableArray.pop()\n    assert.equal observableFn(), 4\n    observableArray.shift()\n    assert.equal observableFn(), 2\n\n  it \"should allow double nesting\", (done) ->\n    bottom = Observable \"rad\"\n    middle = Observable ->\n      bottom()\n    top = Observable ->\n      middle()\n\n    top.observe (newValue) ->\n      assert.equal newValue, \"wat\"\n      assert.equal top(), newValue\n      assert.equal middle(), newValue\n\n      done()\n\n    bottom(\"wat\")\n\n  it \"should work with dynamic dependencies\", ->\n    observableArray = Observable []\n\n    dynamicObservable = Observable ->\n      observableArray.filter (item) ->\n        item.age() > 3\n\n    assert.equal dynamicObservable().length, 0\n\n    observableArray.push\n      age: Observable 1\n\n    observableArray()[0].age 5\n    assert.equal dynamicObservable().length, 1\n\n  it \"should work with context\", ->\n    model =\n      a: Observable \"Hello\"\n      b: Observable \"there\"\n\n    model.c = Observable ->\n      \"#{@a()} #{@b()}\"\n    , model\n\n    assert.equal model.c(), \"Hello there\"\n\n    model.b \"world\"\n\n    assert.equal model.c(), \"Hello world\"\n\n  it \"should be ok even if the function throws an exception\", ->\n    assert.throws ->\n      t = Observable ->\n        throw \"wat\"\n\n    # TODO: Should be able to find a test case that is affected by this rather that\n    # checking it directly\n    assert.equal global.OBSERVABLE_ROOT_HACK.length, 0\n\n  it \"should have an each method\", ->\n    o = Observable ->\n\n    assert o.each\n\n  it \"should not invoke when returning undefined\", ->\n    o = Observable ->\n\n    o.each ->\n      assert false\n\n  it \"should invoke when returning any defined value\", (done) ->\n    o = Observable -> 5\n\n    o.each (n) ->\n      assert.equal n, 5\n      done()\n\n  it \"should work on an array dependency\", ->\n    oA = Observable [1, 2, 3]\n\n    o = Observable ->\n      oA()[0]\n\n    last = Observable ->\n      oA()[oA().length-1]\n\n    assert.equal o(), 1\n\n    oA.unshift 0\n\n    assert.equal o(), 0\n\n    oA.push 4\n\n    assert.equal last(), 4, \"Last should be 4\"\n\n  it \"should work with multiple dependencies\", ->\n    letter = Observable \"A\"\n    checked = ->\n      l = letter()\n      @name().indexOf(l) is 0\n\n    first = {name: Observable(\"Andrew\")}\n    first.checked = Observable checked, first\n\n    second = {name: Observable(\"Benjamin\")}\n    second.checked = Observable checked, second\n\n    assert.equal first.checked(), true\n    assert.equal second.checked(), false\n\n    assert.equal letter.listeners.length, 2\n\n    letter \"B\"\n\n    assert.equal first.checked(), false\n    assert.equal second.checked(), true\n\n  it \"should work with nested observable construction\", ->\n    gen = Observable ->\n      Observable \"Duder\"\n\n    o = gen()\n\n    assert.equal o(), \"Duder\"\n\n    o(\"wat\")\n\n    assert.equal o(), \"wat\"\n\n  describe \"Scoping\", ->\n    it \"should be scoped to optional context\", (done) ->\n      model =\n        firstName: Observable \"Duder\"\n        lastName: Observable \"Man\"\n\n      model.name = Observable ->\n        \"#{@firstName()} #{@lastName()}\"\n      , model\n\n      model.name.observe (newValue) ->\n        assert.equal newValue, \"Duder Bro\"\n\n        done()\n\n      model.lastName \"Bro\"\n\n  describe \"concat\", ->\n    it \"should return an observable array that changes based on changes in inputs\", ->\n      numbers = Observable [1, 2, 3]\n      letters = Observable [\"a\", \"b\", \"c\"]\n      item = Observable({})\n      nullable = Observable null\n\n      observableArray = Observable.concat numbers, \"literal\", letters, item, nullable\n\n      assert.equal observableArray().length, 3 + 1 + 3 + 1\n\n      assert.equal observableArray()[0], 1\n      assert.equal observableArray()[3], \"literal\"\n      assert.equal observableArray()[4], \"a\"\n      assert.equal observableArray()[7], item()\n\n      numbers.push 4\n\n      assert.equal observableArray().length, 9\n\n      nullable \"cool\"\n\n      assert.equal observableArray().length, 10\n\n    it \"should work with observable functions that return arrays\", ->\n      item = Observable(\"wat\")\n\n      computedArray = Observable ->\n        [item()]\n\n      observableArray = Observable.concat computedArray, computedArray\n\n      assert.equal observableArray().length, 2\n\n      assert.equal observableArray()[1], \"wat\"\n\n      item \"yolo\"\n\n      assert.equal observableArray()[1], \"yolo\"\n\n    it \"should have a push method\", ->\n      observableArray = Observable.concat()\n\n      observable = Observable \"hey\"\n\n      observableArray.push observable\n\n      assert.equal observableArray()[0], \"hey\"\n\n      observable \"wat\"\n\n      assert.equal observableArray()[0], \"wat\"\n\n      observableArray.push \"cool\"\n      observableArray.push \"radical\"\n\n      assert.equal observableArray().length, 3\n\n    it \"should be observable\", (done) ->\n      observableArray = Observable.concat()\n\n      observableArray.observe (items) ->\n        assert.equal items.length, 3\n        done()\n\n      observableArray.push [\"A\", \"B\", \"C\"]\n\n    it \"should have an each method\", ->\n      observableArray = Observable.concat([\"A\", \"B\", \"C\"])\n\n      n = 0\n      observableArray.each () ->\n        n += 1\n\n      assert.equal n, 3\n",
              "mode": "100644",
              "type": "blob"
            }
          },
          "distribution": {
            "main": {
              "path": "main",
              "content": "(function() {\n  var Observable, autoDeps, computeDependencies, copy, extend, flatten, get, last, magicDependency, remove, splat, withBase,\n    __slice = [].slice;\n\n  Observable = function(value, context) {\n    var changed, fn, listeners, notify, notifyReturning, self;\n    if (typeof (value != null ? value.observe : void 0) === \"function\") {\n      return value;\n    }\n    listeners = [];\n    notify = function(newValue) {\n      return copy(listeners).forEach(function(listener) {\n        return listener(newValue);\n      });\n    };\n    if (typeof value === 'function') {\n      fn = value;\n      self = function() {\n        magicDependency(self);\n        return value;\n      };\n      self.each = function() {\n        var args, _ref;\n        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];\n        magicDependency(self);\n        return (_ref = splat(value)).forEach.apply(_ref, args);\n      };\n      changed = function() {\n        value = computeDependencies(self, fn, changed, context);\n        return notify(value);\n      };\n      value = computeDependencies(self, fn, changed, context);\n    } else {\n      self = function(newValue) {\n        if (arguments.length > 0) {\n          if (value !== newValue) {\n            value = newValue;\n            notify(newValue);\n          }\n        } else {\n          magicDependency(self);\n        }\n        return value;\n      };\n    }\n    self.each = function() {\n      var args, _ref;\n      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];\n      magicDependency(self);\n      if (value != null) {\n        return (_ref = [value]).forEach.apply(_ref, args);\n      }\n    };\n    if (Array.isArray(value)) {\n      [\"concat\", \"every\", \"filter\", \"forEach\", \"indexOf\", \"join\", \"lastIndexOf\", \"map\", \"reduce\", \"reduceRight\", \"slice\", \"some\"].forEach(function(method) {\n        return self[method] = function() {\n          var args;\n          args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];\n          magicDependency(self);\n          return value[method].apply(value, args);\n        };\n      });\n      [\"pop\", \"push\", \"reverse\", \"shift\", \"splice\", \"sort\", \"unshift\"].forEach(function(method) {\n        return self[method] = function() {\n          var args;\n          args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];\n          return notifyReturning(value[method].apply(value, args));\n        };\n      });\n      notifyReturning = function(returnValue) {\n        notify(value);\n        return returnValue;\n      };\n      extend(self, {\n        each: function() {\n          var args;\n          args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];\n          self.forEach.apply(self, args);\n          return self;\n        },\n        remove: function(object) {\n          var index;\n          index = value.indexOf(object);\n          if (index >= 0) {\n            return notifyReturning(value.splice(index, 1)[0]);\n          }\n        },\n        get: function(index) {\n          magicDependency(self);\n          return value[index];\n        },\n        first: function() {\n          magicDependency(self);\n          return value[0];\n        },\n        last: function() {\n          magicDependency(self);\n          return value[value.length - 1];\n        },\n        size: function() {\n          magicDependency(self);\n          return value.length;\n        }\n      });\n    }\n    extend(self, {\n      listeners: listeners,\n      observe: function(listener) {\n        return listeners.push(listener);\n      },\n      stopObserving: function(fn) {\n        return remove(listeners, fn);\n      },\n      toggle: function() {\n        return self(!value);\n      },\n      increment: function(n) {\n        return self(value + n);\n      },\n      decrement: function(n) {\n        return self(value - n);\n      },\n      toString: function() {\n        return \"Observable(\" + value + \")\";\n      }\n    });\n    return self;\n  };\n\n  Observable.concat = function() {\n    var args, o;\n    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];\n    args = Observable(args);\n    o = Observable(function() {\n      return flatten(args.map(splat));\n    });\n    o.push = args.push;\n    return o;\n  };\n\n  module.exports = Observable;\n\n  extend = function() {\n    var name, source, sources, target, _i, _len;\n    target = arguments[0], sources = 2 <= arguments.length ? __slice.call(arguments, 1) : [];\n    for (_i = 0, _len = sources.length; _i < _len; _i++) {\n      source = sources[_i];\n      for (name in source) {\n        target[name] = source[name];\n      }\n    }\n    return target;\n  };\n\n  global.OBSERVABLE_ROOT_HACK = [];\n\n  autoDeps = function() {\n    return last(global.OBSERVABLE_ROOT_HACK);\n  };\n\n  magicDependency = function(self) {\n    var observerStack;\n    if (observerStack = autoDeps()) {\n      return observerStack.push(self);\n    }\n  };\n\n  withBase = function(self, update, fn) {\n    var deps, value, _ref;\n    global.OBSERVABLE_ROOT_HACK.push(deps = []);\n    try {\n      value = fn();\n      if ((_ref = self._deps) != null) {\n        _ref.forEach(function(observable) {\n          return observable.stopObserving(update);\n        });\n      }\n      self._deps = deps;\n      deps.forEach(function(observable) {\n        return observable.observe(update);\n      });\n    } finally {\n      global.OBSERVABLE_ROOT_HACK.pop();\n    }\n    return value;\n  };\n\n  computeDependencies = function(self, fn, update, context) {\n    return withBase(self, update, function() {\n      return fn.call(context);\n    });\n  };\n\n  remove = function(array, value) {\n    var index;\n    index = array.indexOf(value);\n    if (index >= 0) {\n      return array.splice(index, 1)[0];\n    }\n  };\n\n  copy = function(array) {\n    return array.concat([]);\n  };\n\n  get = function(arg) {\n    if (typeof arg === \"function\") {\n      return arg();\n    } else {\n      return arg;\n    }\n  };\n\n  splat = function(item) {\n    var result, results;\n    results = [];\n    if (typeof item.forEach === \"function\") {\n      item.forEach(function(i) {\n        return results.push(i);\n      });\n    } else {\n      result = get(item);\n      if (result != null) {\n        results.push(result);\n      }\n    }\n    return results;\n  };\n\n  last = function(array) {\n    return array[array.length - 1];\n  };\n\n  flatten = function(array) {\n    return array.reduce(function(a, b) {\n      return a.concat(b);\n    }, []);\n  };\n\n}).call(this);\n",
              "type": "blob"
            },
            "pixie": {
              "path": "pixie",
              "content": "module.exports = {\"version\":\"0.3.1\"};",
              "type": "blob"
            },
            "test/observable": {
              "path": "test/observable",
              "content": "(function() {\n  global.Observable = require(\"../main\");\n\n  describe('Observable', function() {\n    it('should create an observable for an object', function() {\n      var n, observable;\n      n = 5;\n      observable = Observable(n);\n      return assert.equal(observable(), n);\n    });\n    it('should fire events when setting', function() {\n      var observable, string;\n      string = \"yolo\";\n      observable = Observable(string);\n      observable.observe(function(newValue) {\n        return assert.equal(newValue, \"4life\");\n      });\n      return observable(\"4life\");\n    });\n    it('should be idempotent', function() {\n      var o;\n      o = Observable(5);\n      return assert.equal(o, Observable(o));\n    });\n    describe(\"#each\", function() {\n      it(\"should be invoked once if there is an observable\", function() {\n        var called, o;\n        o = Observable(5);\n        called = 0;\n        o.each(function(value) {\n          called += 1;\n          return assert.equal(value, 5);\n        });\n        return assert.equal(called, 1);\n      });\n      return it(\"should not be invoked if observable is null\", function() {\n        var called, o;\n        o = Observable(null);\n        called = 0;\n        o.each(function(value) {\n          return called += 1;\n        });\n        return assert.equal(called, 0);\n      });\n    });\n    it(\"should allow for stopping observation\", function() {\n      var called, fn, observable;\n      observable = Observable(\"string\");\n      called = 0;\n      fn = function(newValue) {\n        called += 1;\n        return assert.equal(newValue, \"4life\");\n      };\n      observable.observe(fn);\n      observable(\"4life\");\n      observable.stopObserving(fn);\n      observable(\"wat\");\n      return assert.equal(called, 1);\n    });\n    it(\"should increment\", function() {\n      var observable;\n      observable = Observable(1);\n      observable.increment(5);\n      return assert.equal(observable(), 6);\n    });\n    it(\"should decremnet\", function() {\n      var observable;\n      observable = Observable(1);\n      observable.decrement(5);\n      return assert.equal(observable(), -4);\n    });\n    it(\"should toggle\", function() {\n      var observable;\n      observable = Observable(false);\n      observable.toggle();\n      assert.equal(observable(), true);\n      observable.toggle();\n      return assert.equal(observable(), false);\n    });\n    return it(\"should trigger when toggling\", function(done) {\n      var observable;\n      observable = Observable(true);\n      observable.observe(function(v) {\n        assert.equal(v, false);\n        return done();\n      });\n      return observable.toggle();\n    });\n  });\n\n  describe(\"Observable Array\", function() {\n    it(\"should proxy array methods\", function() {\n      var o;\n      o = Observable([5]);\n      return o.map(function(n) {\n        return assert.equal(n, 5);\n      });\n    });\n    it(\"should notify on mutation methods\", function(done) {\n      var o;\n      o = Observable([]);\n      o.observe(function(newValue) {\n        return assert.equal(newValue[0], 1);\n      });\n      o.push(1);\n      return done();\n    });\n    it(\"should have an each method\", function() {\n      var o;\n      o = Observable([]);\n      return assert(o.each);\n    });\n    it(\"#get\", function() {\n      var o;\n      o = Observable([0, 1, 2, 3]);\n      return assert.equal(o.get(2), 2);\n    });\n    it(\"#first\", function() {\n      var o;\n      o = Observable([0, 1, 2, 3]);\n      return assert.equal(o.first(), 0);\n    });\n    it(\"#last\", function() {\n      var o;\n      o = Observable([0, 1, 2, 3]);\n      return assert.equal(o.last(), 3);\n    });\n    it(\"#remove\", function(done) {\n      var o;\n      o = Observable([0, 1, 2, 3]);\n      o.observe(function(newValue) {\n        assert.equal(newValue.length, 3);\n        return setTimeout(function() {\n          return done();\n        }, 0);\n      });\n      return assert.equal(o.remove(2), 2);\n    });\n    return it(\"should proxy the length property\");\n  });\n\n  describe(\"Observable functions\", function() {\n    it(\"should compute dependencies\", function(done) {\n      var firstName, lastName, o;\n      firstName = Observable(\"Duder\");\n      lastName = Observable(\"Man\");\n      o = Observable(function() {\n        return \"\" + (firstName()) + \" \" + (lastName());\n      });\n      o.observe(function(newValue) {\n        assert.equal(newValue, \"Duder Bro\");\n        return done();\n      });\n      return lastName(\"Bro\");\n    });\n    it(\"should compute array#get as a dependency\", function() {\n      var observableArray, observableFn;\n      observableArray = Observable([0, 1, 2]);\n      observableFn = Observable(function() {\n        return observableArray.get(0);\n      });\n      assert.equal(observableFn(), 0);\n      observableArray([5]);\n      return assert.equal(observableFn(), 5);\n    });\n    it(\"should compute array#first as a dependency\", function() {\n      var observableArray, observableFn;\n      observableArray = Observable([0, 1, 2]);\n      observableFn = Observable(function() {\n        return observableArray.first() + 1;\n      });\n      assert.equal(observableFn(), 1);\n      observableArray([5]);\n      return assert.equal(observableFn(), 6);\n    });\n    it(\"should compute array#last as a dependency\", function() {\n      var observableArray, observableFn;\n      observableArray = Observable([0, 1, 2]);\n      observableFn = Observable(function() {\n        return observableArray.last();\n      });\n      assert.equal(observableFn(), 2);\n      observableArray.pop();\n      assert.equal(observableFn(), 1);\n      observableArray([5]);\n      return assert.equal(observableFn(), 5);\n    });\n    it(\"should compute array#size as a dependency\", function() {\n      var observableArray, observableFn;\n      observableArray = Observable([0, 1, 2]);\n      observableFn = Observable(function() {\n        return observableArray.size() * 2;\n      });\n      assert.equal(observableFn(), 6);\n      observableArray.pop();\n      assert.equal(observableFn(), 4);\n      observableArray.shift();\n      return assert.equal(observableFn(), 2);\n    });\n    it(\"should allow double nesting\", function(done) {\n      var bottom, middle, top;\n      bottom = Observable(\"rad\");\n      middle = Observable(function() {\n        return bottom();\n      });\n      top = Observable(function() {\n        return middle();\n      });\n      top.observe(function(newValue) {\n        assert.equal(newValue, \"wat\");\n        assert.equal(top(), newValue);\n        assert.equal(middle(), newValue);\n        return done();\n      });\n      return bottom(\"wat\");\n    });\n    it(\"should work with dynamic dependencies\", function() {\n      var dynamicObservable, observableArray;\n      observableArray = Observable([]);\n      dynamicObservable = Observable(function() {\n        return observableArray.filter(function(item) {\n          return item.age() > 3;\n        });\n      });\n      assert.equal(dynamicObservable().length, 0);\n      observableArray.push({\n        age: Observable(1)\n      });\n      observableArray()[0].age(5);\n      return assert.equal(dynamicObservable().length, 1);\n    });\n    it(\"should work with context\", function() {\n      var model;\n      model = {\n        a: Observable(\"Hello\"),\n        b: Observable(\"there\")\n      };\n      model.c = Observable(function() {\n        return \"\" + (this.a()) + \" \" + (this.b());\n      }, model);\n      assert.equal(model.c(), \"Hello there\");\n      model.b(\"world\");\n      return assert.equal(model.c(), \"Hello world\");\n    });\n    it(\"should be ok even if the function throws an exception\", function() {\n      assert.throws(function() {\n        var t;\n        return t = Observable(function() {\n          throw \"wat\";\n        });\n      });\n      return assert.equal(global.OBSERVABLE_ROOT_HACK.length, 0);\n    });\n    it(\"should have an each method\", function() {\n      var o;\n      o = Observable(function() {});\n      return assert(o.each);\n    });\n    it(\"should not invoke when returning undefined\", function() {\n      var o;\n      o = Observable(function() {});\n      return o.each(function() {\n        return assert(false);\n      });\n    });\n    it(\"should invoke when returning any defined value\", function(done) {\n      var o;\n      o = Observable(function() {\n        return 5;\n      });\n      return o.each(function(n) {\n        assert.equal(n, 5);\n        return done();\n      });\n    });\n    it(\"should work on an array dependency\", function() {\n      var last, o, oA;\n      oA = Observable([1, 2, 3]);\n      o = Observable(function() {\n        return oA()[0];\n      });\n      last = Observable(function() {\n        return oA()[oA().length - 1];\n      });\n      assert.equal(o(), 1);\n      oA.unshift(0);\n      assert.equal(o(), 0);\n      oA.push(4);\n      return assert.equal(last(), 4, \"Last should be 4\");\n    });\n    it(\"should work with multiple dependencies\", function() {\n      var checked, first, letter, second;\n      letter = Observable(\"A\");\n      checked = function() {\n        var l;\n        l = letter();\n        return this.name().indexOf(l) === 0;\n      };\n      first = {\n        name: Observable(\"Andrew\")\n      };\n      first.checked = Observable(checked, first);\n      second = {\n        name: Observable(\"Benjamin\")\n      };\n      second.checked = Observable(checked, second);\n      assert.equal(first.checked(), true);\n      assert.equal(second.checked(), false);\n      assert.equal(letter.listeners.length, 2);\n      letter(\"B\");\n      assert.equal(first.checked(), false);\n      return assert.equal(second.checked(), true);\n    });\n    it(\"should work with nested observable construction\", function() {\n      var gen, o;\n      gen = Observable(function() {\n        return Observable(\"Duder\");\n      });\n      o = gen();\n      assert.equal(o(), \"Duder\");\n      o(\"wat\");\n      return assert.equal(o(), \"wat\");\n    });\n    describe(\"Scoping\", function() {\n      return it(\"should be scoped to optional context\", function(done) {\n        var model;\n        model = {\n          firstName: Observable(\"Duder\"),\n          lastName: Observable(\"Man\")\n        };\n        model.name = Observable(function() {\n          return \"\" + (this.firstName()) + \" \" + (this.lastName());\n        }, model);\n        model.name.observe(function(newValue) {\n          assert.equal(newValue, \"Duder Bro\");\n          return done();\n        });\n        return model.lastName(\"Bro\");\n      });\n    });\n    return describe(\"concat\", function() {\n      it(\"should return an observable array that changes based on changes in inputs\", function() {\n        var item, letters, nullable, numbers, observableArray;\n        numbers = Observable([1, 2, 3]);\n        letters = Observable([\"a\", \"b\", \"c\"]);\n        item = Observable({});\n        nullable = Observable(null);\n        observableArray = Observable.concat(numbers, \"literal\", letters, item, nullable);\n        assert.equal(observableArray().length, 3 + 1 + 3 + 1);\n        assert.equal(observableArray()[0], 1);\n        assert.equal(observableArray()[3], \"literal\");\n        assert.equal(observableArray()[4], \"a\");\n        assert.equal(observableArray()[7], item());\n        numbers.push(4);\n        assert.equal(observableArray().length, 9);\n        nullable(\"cool\");\n        return assert.equal(observableArray().length, 10);\n      });\n      it(\"should work with observable functions that return arrays\", function() {\n        var computedArray, item, observableArray;\n        item = Observable(\"wat\");\n        computedArray = Observable(function() {\n          return [item()];\n        });\n        observableArray = Observable.concat(computedArray, computedArray);\n        assert.equal(observableArray().length, 2);\n        assert.equal(observableArray()[1], \"wat\");\n        item(\"yolo\");\n        return assert.equal(observableArray()[1], \"yolo\");\n      });\n      it(\"should have a push method\", function() {\n        var observable, observableArray;\n        observableArray = Observable.concat();\n        observable = Observable(\"hey\");\n        observableArray.push(observable);\n        assert.equal(observableArray()[0], \"hey\");\n        observable(\"wat\");\n        assert.equal(observableArray()[0], \"wat\");\n        observableArray.push(\"cool\");\n        observableArray.push(\"radical\");\n        return assert.equal(observableArray().length, 3);\n      });\n      it(\"should be observable\", function(done) {\n        var observableArray;\n        observableArray = Observable.concat();\n        observableArray.observe(function(items) {\n          assert.equal(items.length, 3);\n          return done();\n        });\n        return observableArray.push([\"A\", \"B\", \"C\"]);\n      });\n      return it(\"should have an each method\", function() {\n        var n, observableArray;\n        observableArray = Observable.concat([\"A\", \"B\", \"C\"]);\n        n = 0;\n        observableArray.each(function() {\n          return n += 1;\n        });\n        return assert.equal(n, 3);\n      });\n    });\n  });\n\n}).call(this);\n",
              "type": "blob"
            }
          },
          "progenitor": {
            "url": "http://www.danielx.net/editor/"
          },
          "version": "0.3.1",
          "entryPoint": "main",
          "repository": {
            "branch": "v0.3.1",
            "default_branch": "master",
            "full_name": "distri/observable",
            "homepage": "http://observable.us",
            "description": "",
            "html_url": "https://github.com/distri/observable",
            "url": "https://api.github.com/repos/distri/observable",
            "publishBranch": "gh-pages"
          },
          "dependencies": {}
        },
        "util": {
          "source": {
            "LICENSE": {
              "path": "LICENSE",
              "mode": "100644",
              "content": "The MIT License (MIT)\n\nCopyright (c) 2014 \n\nPermission is hereby granted, free of charge, to any person obtaining a copy\nof this software and associated documentation files (the \"Software\"), to deal\nin the Software without restriction, including without limitation the rights\nto use, copy, modify, merge, publish, distribute, sublicense, and/or sell\ncopies of the Software, and to permit persons to whom the Software is\nfurnished to do so, subject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\nFITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\nAUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\nLIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\nOUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE\nSOFTWARE.",
              "type": "blob"
            },
            "README.md": {
              "path": "README.md",
              "mode": "100644",
              "content": "util\n====\n\nSmall utility methods for JS\n",
              "type": "blob"
            },
            "main.coffee.md": {
              "path": "main.coffee.md",
              "mode": "100644",
              "content": "Util\n====\n\n    module.exports =\n      approach: (current, target, amount) ->\n        (target - current).clamp(-amount, amount) + current\n\nApply a stylesheet idempotently.\n\n      applyStylesheet: (style, id=\"primary\") ->\n        styleNode = document.createElement(\"style\")\n        styleNode.innerHTML = style\n        styleNode.id = id\n\n        if previousStyleNode = document.head.querySelector(\"style##{id}\")\n          previousStyleNode.parentNode.removeChild(prevousStyleNode)\n\n        document.head.appendChild(styleNode)\n\n      defaults: (target, objects...) ->\n        for object in objects\n          for name of object\n            unless target.hasOwnProperty(name)\n              target[name] = object[name]\n\n        return target\n\n      extend: (target, sources...) ->\n        for source in sources\n          for name of source\n            target[name] = source[name]\n\n        return target\n",
              "type": "blob"
            },
            "pixie.cson": {
              "path": "pixie.cson",
              "mode": "100644",
              "content": "version: \"0.1.0\"\n",
              "type": "blob"
            }
          },
          "distribution": {
            "main": {
              "path": "main",
              "content": "(function() {\n  var __slice = [].slice;\n\n  module.exports = {\n    approach: function(current, target, amount) {\n      return (target - current).clamp(-amount, amount) + current;\n    },\n    applyStylesheet: function(style, id) {\n      var previousStyleNode, styleNode;\n      if (id == null) {\n        id = \"primary\";\n      }\n      styleNode = document.createElement(\"style\");\n      styleNode.innerHTML = style;\n      styleNode.id = id;\n      if (previousStyleNode = document.head.querySelector(\"style#\" + id)) {\n        previousStyleNode.parentNode.removeChild(prevousStyleNode);\n      }\n      return document.head.appendChild(styleNode);\n    },\n    defaults: function() {\n      var name, object, objects, target, _i, _len;\n      target = arguments[0], objects = 2 <= arguments.length ? __slice.call(arguments, 1) : [];\n      for (_i = 0, _len = objects.length; _i < _len; _i++) {\n        object = objects[_i];\n        for (name in object) {\n          if (!target.hasOwnProperty(name)) {\n            target[name] = object[name];\n          }\n        }\n      }\n      return target;\n    },\n    extend: function() {\n      var name, source, sources, target, _i, _len;\n      target = arguments[0], sources = 2 <= arguments.length ? __slice.call(arguments, 1) : [];\n      for (_i = 0, _len = sources.length; _i < _len; _i++) {\n        source = sources[_i];\n        for (name in source) {\n          target[name] = source[name];\n        }\n      }\n      return target;\n    }\n  };\n\n}).call(this);\n",
              "type": "blob"
            },
            "pixie": {
              "path": "pixie",
              "content": "module.exports = {\"version\":\"0.1.0\"};",
              "type": "blob"
            }
          },
          "progenitor": {
            "url": "http://strd6.github.io/editor/"
          },
          "version": "0.1.0",
          "entryPoint": "main",
          "repository": {
            "id": 18501018,
            "name": "util",
            "full_name": "distri/util",
            "owner": {
              "login": "distri",
              "id": 6005125,
              "avatar_url": "https://avatars.githubusercontent.com/u/6005125?",
              "gravatar_id": "192f3f168409e79c42107f081139d9f3",
              "url": "https://api.github.com/users/distri",
              "html_url": "https://github.com/distri",
              "followers_url": "https://api.github.com/users/distri/followers",
              "following_url": "https://api.github.com/users/distri/following{/other_user}",
              "gists_url": "https://api.github.com/users/distri/gists{/gist_id}",
              "starred_url": "https://api.github.com/users/distri/starred{/owner}{/repo}",
              "subscriptions_url": "https://api.github.com/users/distri/subscriptions",
              "organizations_url": "https://api.github.com/users/distri/orgs",
              "repos_url": "https://api.github.com/users/distri/repos",
              "events_url": "https://api.github.com/users/distri/events{/privacy}",
              "received_events_url": "https://api.github.com/users/distri/received_events",
              "type": "Organization",
              "site_admin": false
            },
            "private": false,
            "html_url": "https://github.com/distri/util",
            "description": "Small utility methods for JS",
            "fork": false,
            "url": "https://api.github.com/repos/distri/util",
            "forks_url": "https://api.github.com/repos/distri/util/forks",
            "keys_url": "https://api.github.com/repos/distri/util/keys{/key_id}",
            "collaborators_url": "https://api.github.com/repos/distri/util/collaborators{/collaborator}",
            "teams_url": "https://api.github.com/repos/distri/util/teams",
            "hooks_url": "https://api.github.com/repos/distri/util/hooks",
            "issue_events_url": "https://api.github.com/repos/distri/util/issues/events{/number}",
            "events_url": "https://api.github.com/repos/distri/util/events",
            "assignees_url": "https://api.github.com/repos/distri/util/assignees{/user}",
            "branches_url": "https://api.github.com/repos/distri/util/branches{/branch}",
            "tags_url": "https://api.github.com/repos/distri/util/tags",
            "blobs_url": "https://api.github.com/repos/distri/util/git/blobs{/sha}",
            "git_tags_url": "https://api.github.com/repos/distri/util/git/tags{/sha}",
            "git_refs_url": "https://api.github.com/repos/distri/util/git/refs{/sha}",
            "trees_url": "https://api.github.com/repos/distri/util/git/trees{/sha}",
            "statuses_url": "https://api.github.com/repos/distri/util/statuses/{sha}",
            "languages_url": "https://api.github.com/repos/distri/util/languages",
            "stargazers_url": "https://api.github.com/repos/distri/util/stargazers",
            "contributors_url": "https://api.github.com/repos/distri/util/contributors",
            "subscribers_url": "https://api.github.com/repos/distri/util/subscribers",
            "subscription_url": "https://api.github.com/repos/distri/util/subscription",
            "commits_url": "https://api.github.com/repos/distri/util/commits{/sha}",
            "git_commits_url": "https://api.github.com/repos/distri/util/git/commits{/sha}",
            "comments_url": "https://api.github.com/repos/distri/util/comments{/number}",
            "issue_comment_url": "https://api.github.com/repos/distri/util/issues/comments/{number}",
            "contents_url": "https://api.github.com/repos/distri/util/contents/{+path}",
            "compare_url": "https://api.github.com/repos/distri/util/compare/{base}...{head}",
            "merges_url": "https://api.github.com/repos/distri/util/merges",
            "archive_url": "https://api.github.com/repos/distri/util/{archive_format}{/ref}",
            "downloads_url": "https://api.github.com/repos/distri/util/downloads",
            "issues_url": "https://api.github.com/repos/distri/util/issues{/number}",
            "pulls_url": "https://api.github.com/repos/distri/util/pulls{/number}",
            "milestones_url": "https://api.github.com/repos/distri/util/milestones{/number}",
            "notifications_url": "https://api.github.com/repos/distri/util/notifications{?since,all,participating}",
            "labels_url": "https://api.github.com/repos/distri/util/labels{/name}",
            "releases_url": "https://api.github.com/repos/distri/util/releases{/id}",
            "created_at": "2014-04-06T22:42:56Z",
            "updated_at": "2014-04-06T22:42:56Z",
            "pushed_at": "2014-04-06T22:42:56Z",
            "git_url": "git://github.com/distri/util.git",
            "ssh_url": "git@github.com:distri/util.git",
            "clone_url": "https://github.com/distri/util.git",
            "svn_url": "https://github.com/distri/util",
            "homepage": null,
            "size": 0,
            "stargazers_count": 0,
            "watchers_count": 0,
            "language": null,
            "has_issues": true,
            "has_downloads": true,
            "has_wiki": true,
            "forks_count": 0,
            "mirror_url": null,
            "open_issues_count": 0,
            "forks": 0,
            "open_issues": 0,
            "watchers": 0,
            "default_branch": "master",
            "master_branch": "master",
            "permissions": {
              "admin": true,
              "push": true,
              "pull": true
            },
            "organization": {
              "login": "distri",
              "id": 6005125,
              "avatar_url": "https://avatars.githubusercontent.com/u/6005125?",
              "gravatar_id": "192f3f168409e79c42107f081139d9f3",
              "url": "https://api.github.com/users/distri",
              "html_url": "https://github.com/distri",
              "followers_url": "https://api.github.com/users/distri/followers",
              "following_url": "https://api.github.com/users/distri/following{/other_user}",
              "gists_url": "https://api.github.com/users/distri/gists{/gist_id}",
              "starred_url": "https://api.github.com/users/distri/starred{/owner}{/repo}",
              "subscriptions_url": "https://api.github.com/users/distri/subscriptions",
              "organizations_url": "https://api.github.com/users/distri/orgs",
              "repos_url": "https://api.github.com/users/distri/repos",
              "events_url": "https://api.github.com/users/distri/events{/privacy}",
              "received_events_url": "https://api.github.com/users/distri/received_events",
              "type": "Organization",
              "site_admin": false
            },
            "network_count": 0,
            "subscribers_count": 2,
            "branch": "v0.1.0",
            "publishBranch": "gh-pages"
          },
          "dependencies": {}
        }
      }
    }
  }
});