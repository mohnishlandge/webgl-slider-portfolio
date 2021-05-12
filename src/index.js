import Normalize from 'normalize-wheel'

import Canvas from './Canvas'

class App {
  constructor() {
    this.images = [
      'https://raw.githubusercontent.com/mohnishlandge/webgl-assets/main/Slide%2016_9%20-%201.png',
      'https://raw.githubusercontent.com/mohnishlandge/webgl-assets/main/Slide%2016_9%20-%202.png',
      'https://raw.githubusercontent.com/mohnishlandge/webgl-assets/main/Slide%2016_9%20-%203.png',
      'https://raw.githubusercontent.com/mohnishlandge/webgl-assets/main/Slide%2016_9%20-%204.png',
      'https://raw.githubusercontent.com/mohnishlandge/webgl-assets/main/Slide%2016_9%20-%205.png',
      'https://raw.githubusercontent.com/mohnishlandge/webgl-assets/main/Slide%2016_9%20-%206.png',
      'https://raw.githubusercontent.com/mohnishlandge/webgl-assets/main/Slide%2016_9%20-%207.png',
      'https://raw.githubusercontent.com/mohnishlandge/webgl-assets/main/Slide%2016_9%20-%208.png',
      'https://raw.githubusercontent.com/mohnishlandge/webgl-assets/main/Slide%2016_9%20-%209.png',
      'https://raw.githubusercontent.com/mohnishlandge/webgl-assets/main/Slide%2016_9%20-%2010.png',
    ]

    this.mouse = {
      x: 0,
      y: 0,
    }

    this.canvas = new Canvas({
      images: this.images,
    })

    this.addEventListeners()

    this.update()
  }

  onTouchDown(event) {
    event.stopPropagation()

    this.mouse.x = event.touches ? event.touches[0].clientX : event.clientX
    this.mouse.y = event.touches ? event.touches[0].clientY : event.clientY

    if (this.canvas) {
      this.canvas.onTouchDown(this.mouse)
    }
  }

  onTouchMove(event) {
    event.stopPropagation()

    this.mouse.x = event.touches ? event.touches[0].clientX : event.clientX
    this.mouse.y = event.touches ? event.touches[0].clientY : event.clientY

    if (this.canvas) {
      this.canvas.onTouchMove(this.mouse)
    }
  }

  onTouchUp(event) {
    event.stopPropagation()

    this.mouse.x = event.changedTouches
      ? event.changedTouches[0].clientX
      : event.clientX
    this.mouse.y = event.changedTouches
      ? event.changedTouches[0].clientY
      : event.clientY

    if (this.canvas) {
      this.canvas.onTouchUp(this.mouse)
    }
  }

  onWheel(event) {
    const normalized = Normalize(event)
    const speed = normalized.pixelY * 0.4

    if (this.canvas) {
      this.canvas.onWheel(speed)
    }
  }

  addEventListeners() {
    window.addEventListener('mousewheel', this.onWheel.bind(this))
    window.addEventListener('wheel', this.onWheel.bind(this))

    window.addEventListener('mousedown', this.onTouchDown.bind(this))
    window.addEventListener('mousemove', this.onTouchMove.bind(this))
    window.addEventListener('mouseup', this.onTouchUp.bind(this))

    window.addEventListener('touchstart', this.onTouchDown.bind(this))
    window.addEventListener('touchmove', this.onTouchMove.bind(this))
    window.addEventListener('touchend', this.onTouchUp.bind(this))
  }

  update() {
    if (this.canvas) {
      this.canvas.update()
    }

    window.requestAnimationFrame(this.update.bind(this))
  }
}

new App()
