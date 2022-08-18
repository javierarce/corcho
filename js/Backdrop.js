class Backdrop {
  constructor (className = '') {
    this.className = `${this.constructor.name} ${className}`
    this.render()
  }

  show () {
    this.$element.classList.toggle('is-visible', true)
  }

  hide () {
    this.$element.classList.toggle('is-visible', false)
  }

  onClick (event) {
    event.preventDefault()
    event.stopPropagation()

    this.$element.dispatchEvent(new CustomEvent('test'))
  }

  render () {
    this.$element = document.createElement('div')
    this.className.split(' ').filter(c => c).forEach(name => this.$element.classList.add(name))

    this.$element.onclick = this.onClick.bind(this)

    document.body.appendChild(this.$element)
  }
}
