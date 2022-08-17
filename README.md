# Canvas

1. Create a Figma file and add some pages with just one frame inside
2. Grab the file ID and also generate a Figma Token
3. Fork this project and add two secrets:
	1. FIGMA_FILE (for the file id)
	2. FIGMA_TOKEN (for the auth token)
4. Enable the GitHub pages for the repo

Visit your GitHub page.

### Workflow

```yaml
name: Cron
on:
  schedule:
    - cron: "*/5 * * * *"      

jobs:
  cron:
    name: Cron
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      - name: Use Node.js 15
        uses: actions/setup-node@v1
        with:
          node-version: 15

      - name: Install and run
        env:
          FIGMA_TOKEN: ${{ secrets.FIGMA_TOKEN }}
          FIGMA_FILE: ${{ secrets.FIGMA_FILE }}
        run: yarn && node app.js

      - uses: EndBug/add-and-commit@v7
        with:
          author_name: author
          author_email: email
          message: 'Cron'
```
