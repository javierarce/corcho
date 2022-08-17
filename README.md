# Corcho

### How to run this thing

1. Create a Figma file and add some pages with just one frame inside
2. Grab the file ID and also generate a Personal Access Token.
3. Fork this project and add two secrets:
	1. FIGMA_FILE: for the file id
	2. FIGMA_TOKEN: for the Personal Access Token
4. Enable the GitHub pages for the main branch of the forked repo
5. Visit the Actions tab and enable the workflow
6. Wait until both the Cron workflow and the GitHub Pages workflow are finished 
7. Visit your GitHub page
