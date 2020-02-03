import {
  Scene,
  PerspectiveCamera,
  DirectionalLight,
  HemisphereLight,
  WebGLRenderer,
  AnimationMixer,
  Vector3,
  Color,
  Clock,
} from 'three'

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"

import '../css/main.css'


let container;
let scene;
let camera;
let renderer;
let controls;

const mixers = [] // saving each model animation as an action = AnimationClip 
const clock = new Clock() // Threejs clock to track animation's time 


const init = () => {
  container = document.createElement('div')
  container.id = 'container'
  document.querySelector('body').appendChild(container)

  scene = new Scene()
  scene.background = new Color('blue')

  createCamera()
  createLight()
  loadModels()
  createControls()
  createRenderer()

  // GAME LOOP!
  renderer.setAnimationLoop(() => {
    update()
    render()
  })
}

const update = () => {

  // Time between frames
  const delta = clock.getDelta()
  for (const mixer of mixers) {
    mixer.update(delta)
  }

}

const loadModels = () => {
  // Model loader 
  const loader = new GLTFLoader()
  // Callback once it's loaded
  const onLoad = (gltf, position) => {
    // Getting the model from the gltf file
    const model = gltf.scene.children[0]
    model.position.copy(position)
    model.scale.set( 0.01, 0.01, 0.01)
    //Getting the animation from gltf file 
    const animation = gltf.animations[0]
    // Attaching animation to the model
    const mixer = new AnimationMixer(model)
    mixers.push(mixer)
    // Creating the action reference (so you can play and stop the animation)
    const action = mixer.clipAction(animation)
    action.play()

    scene.add(model)
  }

  const onProgress = () => console.log('loading model...')
  const onError = error => console.log('error: ', error)

  const parrotPosition = new Vector3( 0, 0, 2.5)
  loader.load('./models/Parrot.glb', glb => onLoad(glb, parrotPosition), onProgress, onError)

  const flamingoPosition = new Vector3( -1.5, 0, 1)
  loader.load('./models/Flamingo.glb', glb => onLoad(glb, flamingoPosition), onProgress, onError)

  const storkPosition = new Vector3(0, -1.5, -1)
  loader.load('./models/Stork.glb', glb => onLoad(glb, storkPosition), onProgress, onError)
}

const createCamera = () => {

  const fov = 35
  const aspect = container.clientWidth / container.clientHeight
  const near = 1
  const far = 100
  camera = new PerspectiveCamera(fov, aspect, near, far)
  camera.position.set(-3, -1.5, 6.5 )

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
