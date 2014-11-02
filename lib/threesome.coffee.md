Three JS Starter Kit
====================

    Engine = require "./engine"

    initCamera = ->
      aspectRatio = window.innerWidth / window.innerHeight

      camera = new THREE.PerspectiveCamera(45, aspectRatio, 1, 2000)
      camera.position.set 0, 100, 200

      return camera

    initScene = ->
      lights = require "./lights"

      scene = new THREE.Scene()
      scene.add lights.ambient()
      scene.add lights.directional()

      return scene

    initFloor = (scene) ->
      Cube = require "./cube"

      [0...10].forEach (x) ->
        [0...10].forEach (z) ->
          scene.add Cube(x, z)

    bindWindowEvents = (camera, renderer) ->
      resize = ->
        renderer.setSize window.innerWidth, window.innerHeight
  
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()

      $(window).resize resize

      resize()

    module.exports =
      init: (data={}, update) ->
        camera = initCamera()
        scene = initScene()

        initFloor(scene)

        renderer = new THREE.WebGLRenderer()

        bindWindowEvents(camera, renderer)
        document.body.appendChild renderer.domElement

        engine = Engine data.engine,
          update: (t, dt) ->
            # Update the scene objects!
            update(scene, t, dt)

          render: (t, dt) ->
            camera.lookAt scene.position

            renderer.render scene, camera

        engine.start()
