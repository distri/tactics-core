Extensions
==========

    require "cornerstone"

Temporary home for extending cornerstone builtins.

    extend global,

Adding an attrData method to the Model module.

      Model: do (oldModel=Model) ->
        (I, self) ->
          self = oldModel(I, self)

          extend self,

`attrData` models an attribute as a data object. For example if our object has
a position attribute with x and y values we can do

>     self.attrData("position", Point)

to promote the raw data into a Point data model available through a public
method named position.

            attrData: (name, DataModel) ->
              I[name] = DataModel(I[name])

              self[name] = (newValue) ->
                if arguments.length > 0
                  I[name] = DataModel(newValue)
                else
                  I[name]

          return self
