class Spinner {
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

  render () {
    this.$element = document.createElement('div')
    this.className.split(' ').filter(c => c).forEach(name => this.$element.classList.add(name))

    document.body.appendChild(this.$element)
  }
}
