# Corcho

Corcho (/ˈkoɾt͡ʃo/) is a tool that allows you to create and sync web slideshows from a Figma file. You can then use GitHub pages to host your slideshow and have it automatically updated using GitHub Actions.

### How to run this thing

1. Create a file in Figma and add some pages with just one frame inside.
2. Fork this project and add two secrets: 
  - `FIGMA_FILE`: with the file id.
  - `FIGMA_TOKEN`: with your Figma Personal Access Token.
3. Enable:
  - GitHub pages for the `main` branch.
  - The deploy workflow (by visiting the Actions tab).

Every 5-10 minutes the slideshow will get updated with the contents of the Figma file.

### Example

- [Figma file](https://www.figma.com/file/pCi2wnm9y4HsYNANvXRiGc/Corcho)
- [Slideshow](https://javierarce.github.io/corcho)


