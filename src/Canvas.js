import {
  Clock,
  LinearFilter,
  Math as THREEMath,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  PlaneBufferGeometry,
  Scene,
  TextureLoader,
  WebGLRenderer,
} from 'three'

import Projects from './Projects'

export default class Canvas {
  constructor({ images }) {
    this.clock = new Clock()

    this.images = images

    this.createRenderer()
    this.createScene()
    this.createTextures()
  }

  createRenderer() {
    this.renderer = new WebGLRenderer({
      alpha: true,
      antialias: true,
    })

    this.renderer.setSize(window.innerWidth, window.innerHeight)

    document.body.appendChild(this.renderer.domElement)
  }

  createScene() {
    this.scene = new Scene()

    this.camera = new PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      1,
      500
    )

    this.camera.position.z = 300

    const fov = THREEMath.degToRad(this.camera.fov)
    const height = 2 * Math.tan(fov / 2) * this.camera.position.z
    const width = height * this.camera.aspect

    this.environment = {
      height,
      width,
    }
  }

  createTextures() {
    this.covers = []

    this.loader = new TextureLoader()

    this.images.forEach((cover) => {
      this.loader.load(cover, (texture) => {
        texture.generateMipmaps = false
        texture.minFilter = LinearFilter
        texture.needsUpdate = true

        this.renderer.initTexture(texture, 0)

        this.covers.push(texture)

        if (this.covers.length === this.images.length) {
          this.createProjects()
        }
      })
    })
  }

  createProjects() {
    this.projects = new Projects({
      covers: this.covers,
      environment: this.environment,
      scene: this.scene,
    })
  }

  createPlane() {
    const { height, width } = this.environment

    this.geometry = new PlaneBufferGeometry(
      width * 0.75,
      height * 0.75,
      100,
      50
    )

    this.material = new MeshBasicMaterial({ color: 0xff00ff })
    this.mesh = new Mesh(this.geometry, this.material)

    this.scene.add(this.mesh)
  }

  onTouchDown(event) {
    if (this.projects) {
      this.projects.onTouchDown(event)
    }
  }

  onTouchMove(event) {
    if (this.projects) {
      this.projects.onTouchMove(event)
    }
  }

  onTouchUp(event) {
    if (this.projects) {
      this.projects.onTouchUp(event)
    }
  }

  onWheel(event) {
    if (this.projects) {
      this.projects.onWheel(event)
    }
  }

  update() {
    const time = this.clock.getElapsedTime()

    if (this.projects) {
      this.projects.update(time)
    }

    this.renderer.render(this.scene, this.camera)
  }
}
