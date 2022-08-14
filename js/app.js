class App {
  constructor () {
    this.spinner = new Spinner()
    this.loading = false
    this.frames = []
    this.$canvas = document.querySelector('.Canvas')

    this.fetchData()
  }

  fetchData () {
    if (this.loading) {
      return
    }

    this.loading = true
    this.spinner.show()

    fetch(`data.json?v=${Math.random() * 1000}`)
      .then((response) => response.json())
      .then(this.draw.bind(this))
      .catch((e) => {
        this.loading = false
        this.spinner.hide()
        console.error(`Error loading the data: ${e}`)
      })
  }

  getRandomPosition (img) {
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


  async draw (data) {
    this.frames.forEach((frame) => {
      frame.remove()
    })

    this.frames = []

    let promises = []

    data.forEach((d) => {
      let frame = new Frame(d)
      this.frames.push(frame)
      promises.push(frame.load())
    })

    Promise.all(promises).then(this.loadFrames.bind(this))
  }

  getTotalHeight (results) {
    let height = 0

    results.forEach((frame) => {
      let rect = frame.image.getBoundingClientRect()
      height += rect.height
    })

    return height
  }

  loadFrames (results) {
    this.loading = false
    console.log('loading frames')

    this.spinner.hide()

    let height = this.getTotalHeight(results)
    window.document.body.style.height = `${height/2}px`

    results.forEach((frame, index) => {
      let pos = this.getRandomPosition(frame.image)

      frame.setPosition(pos.x, pos.y)
      this.$canvas.appendChild(frame.image)
      frame.draggable()

      let delay = index === 0 ? 500 : Math.min(Math.random()*2000, index*500)

      setTimeout(() => {
        frame.show()
      }, delay)
    })
  }

  reposition () {
    this.frames.forEach((frame) => {
      let pos = this.getRandomPosition(frame.image)
      frame.setPosition(pos.x, pos.y)
    })
  }
}

