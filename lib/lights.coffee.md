Lights
======

    exports.ambient = ->
      new THREE.AmbientLight 0x101030

    exports.directional = ->
      directionalLight = new THREE.DirectionalLight 0xffeedd
      directionalLight.position.set 5, 10, 0

      directionalLight
