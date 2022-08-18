class Comment {
  constructor (messages, className = '') {
    this.className = `${this.constructor.name} ${className}`.trim()
    this.messages = messages.reverse()
    this.isOpen = false

    this.bindEvents()
    this.render()
  }

  bindEvents () {
    document.body.addEventListener('keydown', this.onKeyDown.bind(this), this)
  }

  onKeyDown (event) {
    let key = event.key

    if (key == 'Escape') {
      this.close()
    }
  }

  show () {
    this.$element.classList.add('is-visible')
  }

  hide () {
    this.close()
    this.$element.classList.remove('is-visible')
  }

  close () {
    this.isOpen = false
    window.backdrop.hide()
    this.$element.classList.remove('is-open')
  }

  onClick (event) {
    this.isOpen = !this.isOpen

    if (this.isOpen) {
      window.backdrop.show()
    } else {
      window.backdrop.hide()
    }

    this.$element.classList.toggle('is-open', this.isOpen)
  }

  urlify (text) {
    let urlRegex = /(https?:\/\/[^\s]+)/g

    return text.replace(urlRegex, function(url) {
      return '<a href="' + url + '" target="_blank">' + url + '</a>'
    })
  }

  render () {
    this.$element = document.createElement('div')
    this.className.split(' ').filter(c => c).forEach(name => this.$element.classList.add(name))

    this.$comment = document.createElement('div')
    this.$comment.classList.add(`${this.className}__comment`)
    this.$comment.onclick = (event) => {
      event.stopPropagation()
    }

    this.messages.forEach((message) => {
      let $message= document.createElement('div')
      $message.classList.add(`${this.className}__commentMessage`)
      $message.innerHTML = this.urlify(message).replace('\n', '<br /><br />')
      this.$comment.appendChild($message)
    })

    this.$badge = document.createElement('div')
    this.$badge.classList.add(`${this.className}__badge`)
    this.$badge.textContent = this.messages.length
    this.$element.appendChild(this.$badge)

    this.$element.appendChild(this.$comment)

    this.$element.onclick = this.onClick.bind(this)
    document.body.appendChild(this.$element)

    window.backdrop.$element.addEventListener('test', this.close.bind(this))
  }
}
