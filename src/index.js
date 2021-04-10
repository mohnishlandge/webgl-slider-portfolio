import Normalize from 'normalize-wheel'

import Canvas from './Canvas'

class App {
  constructor() {
    this.images = [
      'https://images.unsplash.com/photo-1616683385067-43a22a7bb126?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1900&q=80',
      'https://images.unsplash.com/photo-1616699229111-ec94610d1530?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1900&q=80',
      'https://images.unsplash.com/photo-1616699295135-1ee1a895e07d?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1900&q=80',
      'https://images.unsplash.com/photo-1616697256726-b5b7888a7a4a?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1900&q=80',
      'https://images.unsplash.com/photo-1616697524842-b6c9e01906e5?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1900&q=80',
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
