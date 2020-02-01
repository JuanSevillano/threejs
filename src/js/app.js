import {
  Scene,
  PerspectiveCamera,
  BoxBufferGeometry,
  MeshBasicMaterial,
  MeshStandardMaterial,
  sRGBEncoding,
  TextureLoader,
  DirectionalLight,
  WebGLRenderer,
  Mesh,
  Color,
  SpotLight,
} from 'three'

import '../css/main.css'

const container = document.createElement('div')
container.id = 'container'
document.querySelector('body').appendChild(container)

const scene = new Scene()
scene.background = new Color('skyblue')

const fov = 35
const aspect = container.clientWidth / container.clientHeight
const near = 0.1
const far = 100

const camera = new PerspectiveCamera(fov, aspect, near, far)
camera.position.set(0, 0, 10)

const geometry = new BoxBufferGeometry(2, 2, 2)
const textureLoader = new TextureLoader()
const texture = textureLoader.load('textures/uv_test_bw.png')
texture.encoding = sRGBEncoding
texture.anisotropy = 16

const material = new MeshStandardMaterial({ map: texture })
const mesh = new Mesh(geometry, material)

const light = new DirectionalLight(0xffffff, 5.0)
light.position.set(10, 10, 10)

scene.add(mesh)
scene.add(light)

const renderer = new WebGLRenderer()
renderer.setSize(container.clientWidth, container.clientHeight)
renderer.setPixelRatio(window.devicePixelRatio)

container.appendChild(renderer.domElement)
renderer.setAnimationLoop(() => {
  update()
  render()
})



const update = () => {

  // increase the mesh's rotation each frame
  mesh.rotation.z += 0.01;
  mesh.rotation.x += 0.01;
  mesh.rotation.y += 0.01;

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
