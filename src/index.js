import Normalize from 'normalize-wheel'

import Canvas from './Canvas'

class App {
  constructor() {
    this.images = [
      'https://mir-s3-cdn-cf.behance.net/project_modules/fs/4f747b119363901.609be2e71692d.png',
      'https://mir-s3-cdn-cf.behance.net/project_modules/fs/f612d3119363901.609be2e7172c1.png',
      'https://mir-s3-cdn-cf.behance.net/project_modules/fs/3cc2c5119363901.609be2e717889.png',
      'https://mir-s3-cdn-cf.behance.net/project_modules/fs/826435119363901.609be2e714522.png',
      'https://mir-s3-cdn-cf.behance.net/project_modules/fs/37efaf119363901.609be2e6de515.png',
      'https://mir-s3-cdn-cf.behance.net/project_modules/fs/6aa849119363901.609be2e70d651.png',
      'https://mir-s3-cdn-cf.behance.net/project_modules/fs/4b3add119363901.609be2e717e95.png',
      'https://mir-s3-cdn-cf.behance.net/project_modules/fs/8e0d5a119363901.609be2e713c16.png',
      'https://mir-s3-cdn-cf.behance.net/project_modules/fs/43f3ba119363901.609be2e715b84.png',
      'https://mir-s3-cdn-cf.behance.net/project_modules/fs/c05840119363901.609be2e714cfb.png',
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
