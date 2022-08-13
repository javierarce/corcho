const path = require('path')
const fs = require('fs')
const Extractor = require('figma-extractor')

const DATA_FILE = 'data.json'
const IMAGE_PATH= 'img'

const OPTIONS = {
  format: 'svg',
  dont_overwrite: false
}

let extractor = new Extractor(process.env.FIGMA_TOKEN, process.env.FIGMA_FILE)

fs.readdir(IMAGE_PATH, (err, files) => {
  if (err) throw err;

  for (const file of files) {
    fs.unlink(path.join(IMAGE_PATH, file), err => {
      if (err) throw err;
    })
  }
})

extractor.extract(IMAGE_PATH).then((files) => {
  fs.writeFile(DATA_FILE, JSON.stringify(files), (error, content) => {
    if (error) {
      console.error(e)
    }
  })
}).catch((e) => {
  console.error(e)
})
