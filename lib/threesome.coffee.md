Three JS Starter Kit
====================

    Engine = require "./engine"
    Stats = require "stats"

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

    initStats = ->
      updateStats = new Stats
      updateStats.setMode(1)
      renderStats = new Stats
      renderStats.setMode(1)

      updateStats.domElement.style.position = 'absolute';
      updateStats.domElement.style.left = '0px';
      updateStats.domElement.style.top = '0px';

      document.body.appendChild( updateStats.domElement );

      renderStats.domElement.style.position = 'absolute';
      renderStats.domElement.style.right = '0px';
      renderStats.domElement.style.top = '0px';

      document.body.appendChild( renderStats.domElement );

      return [updateStats, renderStats]

    module.exports =
      init: (data={}, update) ->
        [updateStats, renderStats] = initStats()
    
        camera = initCamera()
        scene = initScene()

        initFloor(scene)

        renderer = new THREE.WebGLRenderer()

        bindWindowEvents(camera, renderer)
        document.body.appendChild renderer.domElement

        engine = Engine data.engine,
          update: (t, dt) ->
            # Update the scene objects!
            updateStats.begin()
            update(scene, t, dt)
            updateStats.end()

          render: (t, dt) ->
            camera.lookAt scene.position

            renderStats.begin()
            renderer.render scene, camera
            renderStats.end()

        engine.start()
