class Frame {
  constructor (data, path) {
    this.imagePath = path
    this.isMouseDown = false
    this.data = data
  }

  getID () {
    return this.data.id
  }

  getWidth () {
    return this.image.getBoundingClientRect().width
  }

  getHeight () {
    return this.image.getBoundingClientRect().height
  }

  remove () {
    this.hide()

    setTimeout(() => {
      this.image.remove()
    }, 400)
  }

  setPosition (x, y) {
    this.image.style.left = `${x}px`
    this.image.style.top = `${y}px`
  }

  show () {
    this.image.classList.add('is-visible')
  }

  hide () {
    this.image.classList.remove('is-visible')
  }

  load () {
    return new Promise(async(resolve) => {
      this.image = new Image()

      this.image.onload = () => { 
        this.image.draggable = false
        resolve(this)
      }

      this.image.src = `${this.imagePath}/${this.data.page}/${this.data.filename}`
    })
  }

  onMouseMove () {
    if (!this.isMouseDown) {
      return
    }

    let deltaX = event.clientX - this.mouseX
    let deltaY = event.clientY - this.mouseY
    this.left = this.elementX + deltaX 
    this.top = this.elementY + deltaY

    this.setPosition(this.left, this.top)
  }
}
