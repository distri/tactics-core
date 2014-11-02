Names
=====

    ANY = "*"

    module.exports = (data) ->
      random: (options={}) ->
        predicate = (row) ->
          (!options.culture or row.culture is options.culture) and
          (!options.gender or row.gender is ANY or row.gender is options.gender)
        data.filter(predicate)
        .rand()
        .name
