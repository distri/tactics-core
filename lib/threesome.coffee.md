Three JS Starter Kit
====================

    Engine = require "./engine"
    Stats = require "stats"
    Raypicker = require "./raypicker"

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

    # TODO: Parameterize better for consuming caller
    bindClickEvent = (scene, camera, renderer) ->
      objectsFn = ->
        scene.children

      renderer.domElement.onclick = Raypicker camera, objectsFn, (results) ->
        if results[0]
          {object} = results[0]

          object.material.color.setRGB rand(), rand(), rand()

    module.exports =
      init: (data={}, update) ->
        [updateStats, renderStats] = initStats()

        camera = initCamera()
        scene = initScene()

        # TODO: Remove debugging globals
        global.scene = scene
        global.camera = camera

        global.addLine = (start, end, materialProperties) ->
          materialProperties ?=
            color: 0x0000ff

          material = new THREE.LineBasicMaterial materialProperties

          geometry = new THREE.Geometry()
          geometry.vertices.push(start)
          geometry.vertices.push(end)

          line = new THREE.Line(geometry, material)
          scene.add line
        
        addLine(
          new THREE.Vector3(0, 0, 0)
          new THREE.Vector3(100, 0, 0)
          color: 0xff0000
        )
        
        addLine(
          new THREE.Vector3(0, 0, 0)
          new THREE.Vector3(0, 100, 0)
          color: 0x00ff00
        )
        
        addLine(
          new THREE.Vector3(0, 0, 0)
          new THREE.Vector3(0, 0, 100)
          color: 0x0000ff
        )

        initFloor(scene)

        renderer = new THREE.WebGLRenderer()

        bindWindowEvents(camera, renderer)
        bindClickEvent(scene, camera, renderer)
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

      click: (event) ->
        x = (event.clientX / window.innerWidth) * 2 - 1
        y = -(event_info.clientY / window.innerHeight) * 2 + 1

        mouse = new THREE.Vector3(x, y, 1)
