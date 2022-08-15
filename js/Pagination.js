class Pagination {
  constructor (pages, className = '') {
    this.pages = pages
    this.className = `${this.constructor.name} ${className}`.trim()
    this.render()
  }

  show () {
    this.$element.classList.toggle('is-visible', true)
  }

  hide () {
    this.$element.classList.toggle('is-visible', false)
  }

  select (id) {
    let $pages = this.$element.querySelectorAll('[data-id]')
    $pages.forEach(($page) => {
      $page.classList.toggle('is-active', +$page.dataset.id === id)
    })
  }

  addPage (page, index) {
    let $page = document.createElement('div')
    $page.classList.add(`${this.className}__page`)
    $page.dataset.id = index

    $page.onclick = () => {
      this.select(index)
      this.$element.dispatchEvent(new CustomEvent('action', { detail: { id: index } }))
    }

    if (page.id === 0) {
      $page.classList.add('is-active')
    }
    
    this.$element.appendChild($page)
  }

  render () {
    this.$element = document.createElement('div')
    this.className.split(' ').filter(c => c).forEach(name => this.$element.classList.add(name))

    this.pages.forEach((page, index) => {
      this.addPage(page, index)
    })

    document.body.appendChild(this.$element)
  }
}
