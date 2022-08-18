class App {
  constructor () {
    this.spinner = new Spinner()
    this.loading = false
    this.frames = []
    this.pages = []
    this.$canvas = document.querySelector('.Canvas')
    this.currentPage = 0

    this.bindEvents()
    this.fetchData()
    this.addNavigation()
  }

  bindEvents () {
    document.body.onkeydown = (event) => {
      let key = event.key

      if (key === 'ArrowLeft') {
        this.loadPrevPage()
      } else if (key === 'ArrowRight') {
        this.loadNextPage()
      } else if (key === 'r') {
        this.fetchData()
      }
    }
  }

  loadPrevPage () {
    if (this.currentPage === 0) {
      this.currentPage = this.pages.length
    }

    this.currentPage = (this.currentPage-1) % this.pages.length
    this.drawPage(this.currentPage)
  }

  loadNextPage () {
    this.currentPage = (this.currentPage+1) % this.pages.length
    this.drawPage(this.currentPage)
  }

  updateURL () {
    if (this.currentPage === 0) {
      window.history.pushState('', this.currentPage, `/`);
    } else {
      window.history.pushState(this.currentPage, this.currentPage, `/${this.currentPage}`);
    }
  }

  addNavigation () {
    this.$left = document.createElement('div')
    this.$left.classList.add('Navigate', 'is-left')
    document.body.appendChild(this.$left)
    this.$left.onclick = this.loadPrevPage.bind(this)

    this.$right = document.createElement('div')
    this.$right.classList.add('Navigate', 'is-right')
    document.body.appendChild(this.$right)
    this.$right.onclick = this.loadNextPage.bind(this)
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
        let $error = document.createElement('div')
        $error.classList.add('Error')
        $error.innerHTML = "Oh, no"
        document.body.appendChild($error)
      })
  }

  getCenterPosition (frame) {
    let x = window.innerWidth/2 - frame.getWidth()/2
    let y = window.innerHeight/2 - frame.getHeight()/2

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
    this.imagePath = data.path

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

    this.loadPages()
    this.drawPage(this.currentPage)
  }

  drawPage (id) {

    id = id >= this.pages.length ? 0 : id

    this.pagination.select(id)
    this.frames.forEach((frame) => {
      if (frame.getID() === id) {
        frame.show()
      } else {
        frame.hide()
      }
    })
  }

  loadPages () {

    this.clear()

    let promises = []

    this.pages.forEach((page, id) => {
      page[1].forEach((file, index) => {

        const frame = new Frame({ id, ...file }, this.imagePath)
        this.frames.push(frame)
        promises.push(frame.load())
      })
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
    })
  }

  reposition () {
    this.frames.forEach((frame) => {
      let pos = this.getRandomPosition(frame.image)
      frame.setPosition(pos.x, pos.y)
    })
  }
}

