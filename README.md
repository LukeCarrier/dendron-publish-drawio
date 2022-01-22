# Export Diagrams.net diagrams during Dendron site publishing

Node module for exporting [Diagrams.net (Draw.io)](https://about.diagrams.net/) diagrams embedded in a published [Dendron](https://dendron.so/) site to SVG.

---

## Usage

Embed your diagrams in your notes as if they were images:

```markdown
![My awesome diagram](assets/diagrams/my.awesome.diagram.drawio)
```

If your diagram has multiple pages, specify the page number (zero-indexed; defaults to 0) in the URL:

```markdown
![My awesome diagram](assets/diagrams/my.awesome.diagram.drawio#3)
```

## Installation

From the root of your Dendron workspace (where the `dendron.code-workspace` and `dendron.yml` files are), install the plugin:

```console
npm install --save-dev dendron-publish-drawio
```

Publishing a Dendron site involves running the following commands:

```console
npx dendron publish init
npx dendron publish build --wsRoot . --vault public --sitemap
cd .next/
npm run export
```

We need to add a step, between `dendron publish build` and `npm run export`:

```console
npx dendron publish init
npx dendron publish build --wsRoot . --vault public --sitemap
npx dendron-publish-drawio
cd .next/
npm run export
```

Note that if you customise Dendron's [`site:assetsPrefix`](https://wiki.dendron.so/notes/f2ed8639-a604-4a9d-b76c-41e205fb8713/#assetsprefix) option (or set it via `--overrides=assetsPrefix=...`) you'll need to set the `DENDRON_ASSETS_PREFIX` environment variable to the same value when running `dendron-publish-drawio`:

```console
export DENDRON_ASSETS_PREFIX=/etc npx dendron-publish-drawio
```
