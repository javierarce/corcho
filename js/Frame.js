class Frame {
  constructor (data) {
    this.isMouseDown = false
    this.data = data
    this.zIndex = ZINDEX
  }

  remove () {
    this.hide()

    document.removeEventListener('mousemove', this.onMouseMove.bind(this))
    document.removeEventListener('mouseup', this.onMouseExit.bind(this))

    setTimeout(() => {
      this.image.remove()
    }, 400)
  }

  draggable () {
    this.image.addEventListener('mousedown', this.onMouseDown.bind(this))
    this.image.addEventListener('mouseup', this.onMouseUp.bind(this))
    this.image.addEventListener('mouseover', this.onMouseOver.bind(this))
    document.addEventListener('mousemove', this.onMouseMove.bind(this))
    document.addEventListener('mouseup', this.onMouseExit.bind(this))
  }

  setPosition (x, y) {
    this.image.style.left = `${x}px`
    this.image.style.top = `${y}px`
    this.image.style.zIndex = this.zIndex
  }

  show () {
    this.image.classList.add('is-loaded')
  }

  hide () {
    this.image.classList.remove('is-hidden')
  }

  load () {
    return new Promise(async(resolve) => {
      this.image = new Image()

      this.image.onload = () => { 
        this.image.draggable = false
        resolve(this)
      }

      this.image.src = `img/${this.data.page}/${this.data.filename}`
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

  onMouseUp () {
    this.isMouseDown = false
  }

  onMouseDown (event) {
    this.isMouseDown = true
    this.mouseX = event.clientX
    this.mouseY = event.clientY
    this.elementX = parseInt(this.image.style.left) || 0
    this.elementY = parseInt(this.image.style.top) || 0
  }

  onMouseExit () {
    this.isMouseDown = false
    this.elementX = parseInt(this.image.style.left) || 0
    this.elementY = parseInt(this.image.style.top) || 0
  }

  onMouseOver () {
    this.zIndex = (ZINDEX + 1) % 1000
    ZINDEX = this.zIndex
    this.image.style.zIndex = this.zIndex
  }
}
