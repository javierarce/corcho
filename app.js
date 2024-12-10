require("dotenv").config();

const fs = require("fs");
const md5 = require("md5");
const Extractor = require("figma-extractor");

const DATA_FILE = "data.json";
const DATA_PATH = "data";

const FIGMA_TOKEN = process.env.FIGMA_TOKEN;
const FIGMA_FILE = process.env.FIGMA_FILE;
const PAGES = process.env.PAGES && process.env.PAGES.split(",");

const OPTIONS = {
  format: "svg",
  use_pages_as_folders: true,
  get_background_color: true,
  get_comments: true,
};

fs.rmSync(DATA_PATH, { recursive: true, force: true });

const extractor = new Extractor(FIGMA_TOKEN, FIGMA_FILE, OPTIONS);

extractor
  .extract(DATA_PATH)
  .then((files) => {
    if (PAGES) {
      files = files.filter((file) => PAGES.includes(file.page));
    }
    const data = JSON.stringify({ md5: md5(files), path: DATA_PATH, files });

    fs.writeFile(DATA_FILE, data, (error, _content) => {
      if (error) {
        console.error(e);
      }
    });
  })
  .catch((e) => {
    console.error(e);
  });
