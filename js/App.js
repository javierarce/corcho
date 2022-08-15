class App {
  constructor () {
    this.spinner = new Spinner()
    this.loading = false
    this.frames = []
    this.$canvas = document.querySelector('.Canvas')
    this.pages = []
    this.currentPage = 0

    this.bindEvents()
    this.fetchData()
  }

  bindEvents () {
    document.body.onkeydown = (event) => {
      let key = event.code

      if (key === 'ArrowLeft') {
        if (this.currentPage === 0) {
          this.currentPage = this.pages.length
        }
        this.currentPage = (this.currentPage-1) % this.pages.length
        this.drawPage(this.currentPage)
      } else if (key === 'ArrowRight') {
        this.currentPage = (this.currentPage+1) % this.pages.length
        this.drawPage(this.currentPage)
      }

    }
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

  getCenterPosition (img) {
    let imageRect = img.getBoundingClientRect()
    let imageWidth = imageRect.width
    let imageHeight = imageRect.height

    let bodyWidth = window.innerWidth
    let bodyHeight =  window.innerHeight

    let x = bodyWidth/2 - imageWidth/2
    let y = bodyHeight/2 - imageHeight/2

    return { x, y }
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

    let md5 = data.md5

    if (this.md5 === md5) {
      this.spinner.hide()
      this.loading = false
      return
    }

    this.md5 = md5

    this.clear()

    let pages = data.files.reduce((r, a) => {
        r[a.page] = r[a.page] || []
        r[a.page].push(a)
        return r
    }, Object.create(null))

    this.pages = Object.entries(pages)

    this.pagination = new Pagination(this.pages)
    this.pagination.$element.addEventListener('action', (event) => {
      this.drawPage(event.detail.id)
    })

    this.drawPage(0)
  }

  drawPage (id) {

    this.clear()

    this.pagination.select(id)

    let promises = []
    let page = this.pages[id]

    page[1].forEach((file, index) => {
      const frame = new Frame(file)
      this.frames.push(frame)
      promises.push(frame.load())
    })

    Promise.all(promises).then(this.loadFrames.bind(this))
  }

  clear () {
    this.frames.forEach(frame => frame.remove())
    this.frames = []
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

    this.spinner.hide()

    results.forEach((frame, index) => {
      this.$canvas.appendChild(frame.image)
      let pos = this.getCenterPosition(frame.image)
      frame.setPosition(pos.x, pos.y)
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

