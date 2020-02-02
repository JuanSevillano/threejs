import {
  Scene,
  PerspectiveCamera,
  BoxBufferGeometry,
  MeshBasicMaterial,
  MeshStandardMaterial,
  sRGBEncoding,
  TextureLoader,
  AmbientLight,
  DirectionalLight,
  HemisphereLight,
  WebGLRenderer,
  Mesh,
  Color,
  SpotLight,
} from 'three'

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

import textureCube from '../textures/cube_uv.jpg'

import '../css/main.css'


let container;
let scene;
let camera;
let mesh;
let renderer;
let controls;


const init = () => {
  container = document.createElement('div')
  container.id = 'container'
  document.querySelector('body').appendChild(container)

  scene = new Scene()
  scene.background = new Color('black')

  createCamera()
  createLight()
  createMesh()
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
   mesh.rotation.z += 0.01;
   mesh.rotation.x += 0.01;
   mesh.rotation.y += 0.01;

}

const createControls = () => {
  controls = new OrbitControls(camera, container)
}

const createCamera = () => {

  const fov = 35
  const aspect = container.clientWidth / container.clientHeight
  const near = 0.1
  const far = 100
  camera = new PerspectiveCamera(fov, aspect, near, far)
  camera.position.set(-4, 4, 10)

}

const createLight = () => {
  const ambient = new HemisphereLight(0xddeeff, 0x202020, 5)
  const light = new DirectionalLight(0xffffff, 5)
  light.position.set(10, 10, 10)
  scene.add(ambient, light)
}

const createMesh = () => {
  const geometry = new BoxBufferGeometry(2, 2, 2)
  const textureLoader = new TextureLoader()
  const texture = textureLoader.load(textureCube)
  texture.encoding = sRGBEncoding
  texture.anisotropy = 16

  const material = new MeshStandardMaterial({ map: texture })
  mesh = new Mesh(geometry, material)
  scene.add(mesh)
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
