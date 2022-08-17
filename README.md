# Canvas


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

      - uses: Commit
        with:
          author_name: author
          author_email: email
          message: 'Cron'
```
