# Corcho

Corcho (/ˈkoɾt͡ʃo/) is a tool that creates and sync web slideshows using the contents of a Figma file. You can then use GitHub Pages to host your slideshow on the web and have it automatically updated using GitHub Actions.

## How to run Corcho

1. Create a file in Figma and your slides as frames.
2. Create a non-expiring [Figma personal access token](https://help.figma.com/hc/en-us/articles/8085703771159-Manage-personal-access-tokens).
3. Copy the file id of your Figma file (which is the string of random alphanumeric characters found in the URL after `figma.com/design/`)

### On GitHub Pages

1. Fork this project and add two secrets:

- `FIGMA_FILE`: with the file id.
- `FIGMA_TOKEN`: with your Figma Personal Access Token.

2. Enable:

- GitHub pages for the `main` branch.
- The deploy workflow (by visiting the Actions tab).

#### Customization

By default the cronjob of the GitHub Action will run every hour on the hour,
but you can change the scheduling to be more frequent. Here's an example of a
job that gets executed every 5 minutes (which is the shortest interval allowed):

```
name: Cron
on:
  push:
    branches: [ "main" ]
  schedule:
    - cron: "*/5 * * * *" # Runs every 5 minutes
```

Also, please note that free accounts have a limit of 500 MB and 2,000
minutes of run time per month. Please check the [included storage and
minutes](https://docs.github.com/en/billing/managing-billing-for-your-products/managing-billing-for-github-actions/about-billing-for-github-actions#included-storage-and-minutes)
available for your account type.

### Locally

1. Clone this project
2. Rename the `.env.sample` file to `.env` and update it:

- `FIGMA_FILE`: with the file id.
- `FIGMA_TOKEN`: with your Figma Personal Access Token.

3. Install the dependencies with `yarn install` or `npm install`
4. Run the project with `yarn start` or `npm run start`
5. Open the `index.html` file in your browser using a local server.

## Shortcuts

| Key                                                 | Action                                            |
| --------------------------------------------------- | ------------------------------------------------- |
| <kbd>←</kbd> or <kbd>Space</kbd> + <kbd>Shift</kbd> | Previous slide                                    |
| <kbd>→</kbd> or <kbd>Space</kbd>                    | Next slide                                        |
| <kbd>J</kbd> or <kbd>Page Down</kbd>                | Next page                                         |
| <kbd>K</kbd> or <kbd>Page Up</kbd>                  | Previous page                                     |
| <kbd>Tab</kbd>                                      | Open navigation                                   |
| <kbd>F</kbd>                                        | Toggle fullscreen                                 |
| <kbd>Esc</kbd>                                      | Exit fullscreen                                   |
| <kbd>C</kbd>                                        | Toggle comments                                   |
| <kbd>R</kbd>                                        | Go to the first slide of the current presentation |

### When the navigation is open

| Key                                               | Action           |
| ------------------------------------------------- | ---------------- |
| <kbd>←</kbd> or <kbd>Tab</kbd> + <kbd>Shift</kbd> | Previous page    |
| <kbd>→</kbd> or <kbd>Tab</kbd>                    | Next page        |
| <kbd>Enter</kbd>                                  | Select page      |
| <kbd>Esc</kbd>                                    | Close navigation |

## Example

- [Figma file](https://www.figma.com/file/pCi2wnm9y4HsYNANvXRiGc/Corcho)
- [Slideshow](https://javierarce.github.io/corcho)
