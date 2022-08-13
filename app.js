const fs = require('fs-extra')
const Extractor = require('figma-extractor')

const DATA_FILE = 'data.json'
const IMAGE_PATH= 'img'

const OPTIONS = {
  format: 'svg',
  dont_overwrite: false
}

let extractor = new Extractor(process.env.FIGMA_TOKEN, process.env.FIGMA_FILE)

fs.removeSync(IMAGE_PATH)

extractor.extract(IMAGE_PATH).then((files) => {
  fs.writeFile(DATA_FILE, JSON.stringify(files), (error, content) => {
    if (error) {
      console.error(e)
    }
  })
}).catch((e) => {
  console.error(e)
})
