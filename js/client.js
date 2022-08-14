let ZINDEX = 10

const onLoad = () => {
  const app = new App()
  const clock = new Clock()

  clock.$el.addEventListener('action', () => {
    app.fetchData()
  })
}

window.onload = onLoad
