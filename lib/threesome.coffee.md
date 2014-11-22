Three JS Starter Kit
====================

    Engine = require "./engine"
    Stats = require "stats"
    Raypicker = require "./raypicker"

    require "./oculus_rift/effect"

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

    bindWindowEvents = (camera, renderer, effect) ->
      resize = ->
        renderer.setSize window.innerWidth, window.innerHeight
        effect.setSize window.innerWidth, window.innerHeight

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

    bindClickEvent = (camera, renderer, clickHandler, objectsFn) ->
      renderer.domElement.onclick = Raypicker camera, objectsFn, clickHandler

    debuggingLines = (scene) ->
      addLine = (start, end, materialProperties) ->
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

    module.exports = (options={}) ->
      {data, update, click, clickObjectsFn} = options

      click ?= ->
      clickObjectsFn ?= ->
        scene.children

      [updateStats, renderStats] = initStats()

      camera = initCamera()
      scene = initScene()

      camera.lookAt scene.position

      initFloor(scene)
      debuggingLines(scene)

      renderer = new THREE.WebGLRenderer()

      if options.oculus # Oculus Rift
        effect = new THREE.OculusRiftEffect(renderer, { worldScale: 1 })
        effect.setSize( window.innerWidth, window.innerHeight )

        require("./oculus_rift/camera_control")(camera)
      else
        effect = renderer

      bindWindowEvents(camera, renderer, effect)
      bindClickEvent camera, renderer, click, clickObjectsFn

      document.body.appendChild renderer.domElement

      engine = Engine data.engine,
        update: (t, dt) ->
          # Update the scene objects!
          updateStats.begin()
          update(scene, t, dt)
          updateStats.end()

        render: (t, dt) ->
          renderStats.begin()
          effect.render scene, camera
          renderStats.end()

      engine.start()

      extend engine,
        scene: ->
          scene
