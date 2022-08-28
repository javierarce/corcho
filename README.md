# Corcho

Corcho (/ˈkoɾt͡ʃo/) is a tool that creates and sync web slideshows using the contents of a Figma file. You can then use GitHub Pages to host your slideshow on the web and have it automatically updated using GitHub Actions.

### How to run this thing

1. Create a file in Figma and add some pages with just one frame inside.
2. Fork this project and add two secrets: 
  - `FIGMA_FILE`: with the file id.
  - `FIGMA_TOKEN`: with your Figma Personal Access Token.
3. Enable:
  - GitHub pages for the `main` branch.
  - The deploy workflow (by visiting the Actions tab).

### Customization

By default the cronjob of the GitHub Action will run every hour on the hour, but you can change the scheduling to be more frequent. Here's an example of a job that gets executed every 5 minutes:

```
name: Cron
on:
  push:
    branches: [ "main" ]
  schedule:
    - cron: "*/5 * * * *"      
```

### Example

- [Figma file](https://www.figma.com/file/pCi2wnm9y4HsYNANvXRiGc/Corcho)
- [Slideshow](https://javierarce.github.io/corcho)


