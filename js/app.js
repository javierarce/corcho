let $canvas
let loading = false

let frames = []
let ZINDEX = 10

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

    this.image.remove()
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
    this.image.classList.remove('is-loaded')
  }

  load () {
    return new Promise(async(resolve) => {
      this.image = new Image()

      this.image.onload = () => { 
        this.image.draggable = false
        resolve(this)
      }

      this.image.src = `img/${this.data.filename}`
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


const draggable = (frame) => {
  frame.draggable()
}

const getRandomPosition = (img) => {
  let imageRect = img.getBoundingClientRect()
  let imageWidth = imageRect.width
  let imageHeight = imageRect.height

  let rect = window.document.body.getBoundingClientRect()
  let bodyWidth = Math.max(rect.width, window.innerWidth)
  let bodyHeight = Math.max(rect.height, window.innerHeight)

  let x = Math.round(Math.random() * (bodyWidth - imageWidth))
  let y = Math.round(Math.random() * (bodyHeight - imageHeight))

  return { x, y }
}


const draw = async (data) => {
  frames.forEach((frame) => {
    frame.remove()
  })

  frames = []

  let promises = []

  data.forEach((d) => {

    let frame = new Frame(d)
    frames.push(frame)
    promises.push(frame.load())
  })

  Promise.all(promises).then((results) => {
    loading = false

    let height = 0

    results.forEach((frame) => {
      let rect = frame.image.getBoundingClientRect()
      height+= rect.height
    })

    window.document.body.style.height = `${height/2}px`

    results.forEach((frame, index) => {
      let pos = getRandomPosition(frame.image)

      frame.setPosition(pos.x, pos.y)
      $canvas.appendChild(frame.image)
      frame.draggable()

      let delay = index === 0 ? 500 : Math.min(Math.random()*2000, index*500)

      setTimeout(() => {
        frame.show()
      }, delay)
    })
  })
}

const reposition = () => {
  frames.forEach((frame) => {
    let pos = getRandomPosition(frame.image)
    frame.setPosition(pos.x, pos.y)
  })
}

window.r = reposition
let clock 

function load() {
  const currentTime = new Date()
  let seconds = currentTime.getMinutes() * 60 + currentTime.getSeconds()
  let limit = 60 * 1 + 30
  let timeleft = limit - seconds % limit

  if (timeleft < 3) {
    fetchData()
  }
}

function getRemainingTime() {
  const currentTime = new Date()
  let seconds = currentTime.getMinutes() * 60 + currentTime.getSeconds()
  let limit = 60 * 1 + 30
  let timeleft = limit - seconds % limit

  return (timeleft/limit) * 100
}

function pad(value) {
  return ('0' + Math.floor(value)).slice(-2)
}

function showTime() {
  clock.style.width = `${(100-getRemainingTime())}%`
  requestAnimationFrame(showTime)
  load()
}

const fetchData = () => {
  if (loading) {
    return
  }

  loading = true

  fetch(`data.json?v=${Math.random() * 1000}`)
    .then((response) => response.json())
    .then(draw)
    .catch((e) => {
      loading = false
      console.error('Error loading the data')
    })
}

const onLoad = () => {
  $canvas = document.querySelector('.Canvas')
  clock = document.getElementById('clock')

  requestAnimationFrame(showTime)
  fetchData()
}

window.onload = onLoad

