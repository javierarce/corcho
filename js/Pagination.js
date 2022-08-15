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

  addPage (page) {
    let $page = document.createElement('div')
    $page.classList.add(`${this.className}__page`)
    $page.dataset.id = page.id

    $page.onclick = () => {
      this.select(page.id)
      this.$element.dispatchEvent(new CustomEvent('action', { detail: { id: page.id } }))
    }

    if (page.id === 0) {
      $page.classList.add('is-active')
    }
    
    this.$element.appendChild($page)
  }

  render () {
    this.$element = document.createElement('div')
    this.className.split(' ').filter(c => c).forEach(name => this.$element.classList.add(name))

    this.pages.forEach((page) => {
      this.addPage(page)
    })

    document.body.appendChild(this.$element)
  }
}
