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

//import Stork from '../models/Stork.glb'
//import Flamingo from '../models/Flamingo.glb'
//import Parrot from '../models/Parrot.glb'

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"

import '../css/main.css'

class App {

  constructor() {

    this.scene = new Scene()
    this.scene.background = new Color('blue')


    this.container = document.createElement('div')
    this.container.id = 'container'
    document.querySelector('body').appendChild(this.container)

    this.mixers = [] // saving each model animation as an action = AnimationClip 
    this.clock = new Clock() // Threejs clock to track animation's time 


    this.createCamera()
    this.createLight()
    this.loadModels()
    this.createRenderer()

    this.controls = new OrbitControls(this.camera, this.container)

    // GAME LOOP!
    this.renderer.setAnimationLoop(() => {
      this.update()
      this.render()
    })

    // Adding resize listener 
    window.addEventListener('resize', this.onWindowResize)
  }

  update() {
    // Time between frames
    const delta = this.clock.getDelta()
    for (const mixer of this.mixers) {
      mixer.update(delta)
    }

  }

  render() {
    this.renderer.render(this.scene, this.camera)
  }

  loadModels() {
    // Model loader 
    const loader = new GLTFLoader()
    // Callback once it's loaded
    const onLoad = (gltf, position) => {
      // Getting the model from the gltf file
      const model = gltf.scene.children[0]
      model.position.copy(position)
      model.scale.set(0.01, 0.01, 0.01)
      //Getting the animation from gltf file 
      const animation = gltf.animations[0]
      // Attaching animation to the model
      const mixer = new AnimationMixer(model)
      this.mixers.push(mixer)
      // Creating the action reference (so you can play and stop the animation)
      const action = mixer.clipAction(animation)
      action.play()

      this.scene.add(model)
    }

    const onProgress = () => console.log('loading model...')
    const onError = error => console.log('error: ', error)

    const parrotPosition = new Vector3(0, 0, 2.5)
    loader.load('./models/Parrot.glb', glb => onLoad(glb, parrotPosition), onProgress, onError)

    const flamingoPosition = new Vector3(-1.5, 0, 1)
    loader.load('./models/Flamingo.glb', glb => onLoad(glb, flamingoPosition), onProgress, onError)

    const storkPosition = new Vector3(0, -1.5, -1)
    loader.load('./models/Stork.glb', glb => onLoad(glb, storkPosition), onProgress, onError)
  }

  createLight() {
    const ambient = new HemisphereLight(0xddeeff, 0x0f0e0d, 5)
    const light = new DirectionalLight(0xffffff, 5)
    light.position.set(10, 10, 10)
    this.scene.add(ambient, light)
  }

  createCamera() {

    const fov = 35
    const aspect = container.clientWidth / container.clientHeight
    const near = 1
    const far = 100
    this.camera = new PerspectiveCamera(fov, aspect, near, far)
    this.camera.position.set(-3, -1.5, 6.5)

  }

  createRenderer() {
    this.renderer = new WebGLRenderer()
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight)
    this.renderer.setPixelRatio(window.devicePixelRatio)

    this.renderer.gammaFactor = 2.2;
    this.renderer.gammaOutput = true;
    this.renderer.physicallyCorrectLights = true;

    this.container.appendChild(this.renderer.domElement)
  }

  onWindowResize() {
    this.camera.aspect = this.container.clientWidth / this.container.clientHeight
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight)
  }

}

const instance = new App();
export default instance; 