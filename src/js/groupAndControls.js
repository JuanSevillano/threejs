import {
    Scene,
    PerspectiveCamera,
    CylinderBufferGeometry,
    BoxBufferGeometry,
    MeshStandardMaterial,
    DirectionalLight,
    HemisphereLight,
    WebGLRenderer,
    Mesh,
    Color,
    Group,
  } from 'three'
  
  import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
  import '../css/main.css'
  
  
  let container;
  let scene;
  let camera;
  let renderer;
  let controls;
  let train;
  
  
  const init = () => {
    container = document.createElement('div')
    container.id = 'container'
    document.querySelector('body').appendChild(container)
  
    scene = new Scene()
    scene.background = new Color('blue')
  
    createCamera()
    createLight()
    createMeshes()
    createRenderer()
    createControls()
  
    // GAME LOOP!
    renderer.setAnimationLoop(() => {
      update()
      render()
    })
  }
  
  const update = () => {
  
    // increase the mesh's rotation each frame
    train.rotation.x += 0.01;
    //train.rotation.z += 0.01; 
  
  }
  
  const createMeshes = () => {
  
    train = new Group()
    scene.add(train)
  
    const material = createMaterials()
    const geometry = createGeometries()
  
    const nose = new Mesh( geometry.nose , material.body )
    nose.rotation.z = Math.PI / 2
    nose.position.x = -1
  
    const cabin = new Mesh( geometry.cabin , material.body )
    cabin.position.set( 1.5, 0.4, 0)
  
    const chimney = new Mesh( geometry.chimney, material.detail )
    chimney.position.set( -2, 0.9, 0)
  
    const wheel0 = new Mesh( geometry.wheel, material.detail )
    wheel0.rotation.x = Math.PI / 2
    wheel0.position.set( 0.3, -0.7 , 0)
  
    const wheel1 = wheel0.clone()
    wheel1.position.set( -0.5, -0.7, 0)
  
    const wheel2 = wheel0.clone()
    wheel2.position.set( -1.3, -0.7, 0)
  
    const wheel3 = wheel0.clone()
    wheel3.position.set( -2.1, -0.7, 0)
  
    const backWheel = wheel0.clone()
    backWheel.position.set(1.5, -0.28, 0)
    backWheel.scale.set( 2.5, 1.25, 2.5)
  
    train.add(
      nose,
      cabin,
      chimney,
      wheel0,
      wheel1,
      wheel2,
      wheel3,
      backWheel
    )
  
  }
  
  const createGeometries = () => {
  
    const nose = new CylinderBufferGeometry(0.75, 0.75, 3, 12 )
    const cabin = new BoxBufferGeometry( 2, 2.25 , 1.5 )
    const chimney = new CylinderBufferGeometry( 0.3, 0.1, 0.5 )
    const wheel = new CylinderBufferGeometry( 0.3, 0.3, 1.75, 16 )
  
    return {
      nose, 
      cabin,
      chimney,
      wheel
    }
  }
  
  const createMaterials = () => {
  
    const body = new MeshStandardMaterial({ color: 0xff3333, flatShading: true })
    body.color.convertSRGBToLinear()
  
    const detail = new MeshStandardMaterial({ color: 0x333333, flatShading: true })
    body.color.convertSRGBToLinear()
  
    return {
      body,
      detail
    }
  }
  
  const createCamera = () => {
  
    const fov = 35
    const aspect = container.clientWidth / container.clientHeight
    const near = 0.1
    const far = 100
    camera = new PerspectiveCamera(fov, aspect, near, far)
    camera.position.set(-5, 5, 10)
  
  }
  
  const createLight = () => {
    const ambient = new HemisphereLight(0xddeeff, 0x0f0e0d, 5)
    const light = new DirectionalLight(0xffffff, 5)
    light.position.set(10, 10, 10)
    scene.add(ambient, light)
  }
  
  const createControls = () => {
    controls = new OrbitControls(camera, container)
  }
  
  const createRenderer = () => {
  
    renderer = new WebGLRenderer()
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
  
    renderer.gammaFactor = 2.2;
    renderer.gammaOutput = true;
    renderer.physicallyCorrectLights = true;
  
    container.appendChild(renderer.domElement)
  
  }
  
  const render = () => {
    renderer.render(scene, camera)
  }
  
  const onWindowResize = () => {
    camera.aspect = container.clientWidth / container.clientHeight
    camera.updateProjectionMatrix()
    renderer.setSize(container.clientWidth, container.clientHeight)
  }
  
  window.addEventListener('resize', onWindowResize)
  // Start whole this
  init()
  