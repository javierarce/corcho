let $canvas

const getRandomPosition = (img) => {
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

const draw = async (data) => {

  let promises = []

  data.forEach((d) => {
    return new Promise(async (resolve, reject) => {
      const img = new Image()

      let promise = new Promise(async(resolve) => {
        img.onload = () => { 
          resolve(img)
        }
      })

      promises.push(promise)

      img.src = `img/${d.filename}`
      $canvas.appendChild(img)
    })
  })

  Promise.all(promises).then((results) => {
    let height = 0

    results.forEach((image) => {
      let rect = image.getBoundingClientRect()
      height+= rect.height
    })

    window.document.body.style.height = `${height/2}px`

    results.forEach((image, index) => {
      let pos = getRandomPosition(image)

      image.style.top = `${pos.y}px`
      image.style.left = `${pos.x}px`

      let delay = index === 0 ? 500 : Math.min(Math.random()*2000, index*500)

      setTimeout(() => {
        image.classList.add('is-loaded')
      }, delay)
    })
  })
}

let clock 

function getRemainingTime() {
  const currentTime = new Date()
  let seconds = currentTime.getMinutes() * 60 + currentTime.getSeconds()
  let fiveMin = 60 * 5
  let timeleft = fiveMin - seconds % fiveMin

  return (timeleft/fiveMin) * 100
}

function pad(value) {
  return ('0' + Math.floor(value)).slice(-2);
}

function showTime() {
  clock.style.width = `${Math.round(100-getRemainingTime())}px`
  
  requestAnimationFrame(showTime);
}

const onLoad = () => {
  $canvas = document.querySelector('.Canvas')
  clock = document.getElementById('clock');

  requestAnimationFrame(showTime);

  fetch('data.json')
    .then((response) => response.json())
    .then(draw)
}

window.onload = onLoad

