import { TweenMax } from 'gsap'
import { Mesh, PlaneBufferGeometry, ShaderMaterial, Vector2 } from 'three'

import { fragmentShader, vertexShader } from './Shaders'

import { map } from '../utils/math'

export default class extends Mesh {
  constructor({ cover, environment, index }) {
    super()

    this.index = index
    this.environment = environment

    this.location = environment.height * 1.33 * index * -1

    this.position.y = this.location

    this.createGeometry(environment)
    this.createMaterial(cover)
  }

  createGeometry({ height, width }) {
    this.geometry = new PlaneBufferGeometry(width, height, 100, 50)

    this.position.z = -0.01
  }

  createMaterial(cover) {
    this.material = new ShaderMaterial({
      depthTest: false,
      depthWrite: false,
      uniforms: {
        alpha: {
          value: 1,
        },
        displacementX: {
          value: 0,
        },
        displacementY: {
          value: 0,
        },
        distortion: {
          value: 0,
        },
        distortionX: {
          value: 1.75,
        },
        distortionY: {
          value: 2.0,
        },
        image: {
          value: cover,
        },
        imageResolution: {
          value: new Vector2(cover.image.width, cover.image.height),
        },
        resolution: {
          type: 'v2',
          value: new Vector2(window.innerWidth, window.innerHeight),
        },
        scale: {
          value: 0,
        },
        time: {
          value: 0,
        },
      },
      transparent: true,
      fragmentShader,
      vertexShader,
    })
  }

  onTouchStart() {
    TweenMax.to(this.material.uniforms.displacementY, 0.4, {
      value: 0.1,
    })
  }

  onTouchEnd() {
    TweenMax.killTweensOf(this.material.uniforms.displacementY)

    TweenMax.to(this.material.uniforms.displacementY, 0.4, {
      value: 0,
    })
  }

  onResize({ sizes }) {
    this.sizes = sizes

    if (this.geometry) {
      this.destroyGeometry()
      this.createGeometry(sizes)
    }

    if (this.material) {
      this.material.uniforms.resolution.value = new Vector2(
        sizes.screen.width,
        sizes.screen.height
      )
    }
  }

  update(scroll) {
    this.position.y = this.location + scroll

    const percent = this.position.y / this.environment.height

    const percentAbsolute = Math.abs(percent)

    this.material.uniforms.distortion.value = map(percentAbsolute, 0, 1, 0, 5)
    this.material.uniforms.scale.value = map(percent, 0, 1, 0, 0.5)

    this.position.z = map(percentAbsolute, 0, 1, -0.01, -50)
  }

  animate(time) {
    this.material.uniforms.time.value = time
  }
}
