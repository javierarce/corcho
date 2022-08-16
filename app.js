require('dotenv').config()

const fs = require('fs')
const md5 = require('md5')
const path = require('path')
const Extractor = require('figma-extractor')
 
const DATA_FILE = 'data.json'
const IMAGE_PATH= 'img'

const FIGMA_TOKEN = process.env.FIGMA_TOKEN
const FIGMA_FILE = process.env.FIGMA_FILE

const OPTIONS = {
  format: 'svg',
  use_pages_as_folders: true
}

const extractor = new Extractor(FIGMA_TOKEN, FIGMA_FILE, OPTIONS)

extractor.extract(IMAGE_PATH).then((files) => {
  let data = JSON.stringify({ md5: md5(files), files })

  console.log(data)

  fs.writeFile(DATA_FILE, data, (error, content) => {
    if (error) {
      console.error(e)
    }
  })
}).catch((e) => {
  console.error(e)
})
