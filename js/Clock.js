class Clock {
  constructor () {
    this.dispatching = false
    this.$el = document.getElementById('clock')
    requestAnimationFrame(this.tick.bind(this))
  }

  load () {
    let limit = 60 * 1 + 30
    let timeleft = limit - (this.seconds % limit)

    if (timeleft === 1 && !this.dispatching) {
      this.dispatching = true
      this.$el.dispatchEvent(new CustomEvent('action'))
    }

    if (timeleft === limit) {
      this.dispatching = false
    }
  }

  getRemainingTime() {
    let limit = 60 * 1 + 30
    let timeleft = limit - this.seconds % limit

    return (timeleft/limit) * 100
  }

  tick () {
    const currentTime = new Date()
    this.seconds = currentTime.getMinutes() * 60 + currentTime.getSeconds()

    this.$el.style.width = `${(100-this.getRemainingTime())}%`
    requestAnimationFrame(this.tick.bind(this))
    this.load()
  }
}
