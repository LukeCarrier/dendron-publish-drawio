#!/usr/bin/env node
const fs = require("fs").promises;
const path = require("path");
const process = require("process");

const glob = require("glob-promise");
const { exportDiagram } = require("drawio-export-puppeteer");

const ISSUES_URL = "https://github.com/LukeCarrier/dendron-publish-drawio/issues";

// Matches src="some/file.drawio" and src="some/file.drawio#42"
const DIAGRAM_SRC_RE = /src="(?<filename>[a-zA-Z0-9\/\.]+\.drawio)(#(?<pageIndex>[0-9]+))?"/g;

const FILE_ENCODING = "utf8";

// Root of the .next directory.
const ROOT = path.join(process.cwd(), ".next");

// Glob patterns to match all files in the .next/ directory derived from our
// notes. Any img elements with *.drawio files as their sources will be exported
// to SVG, and these references rewritten.
const noteGlobs = [
  "{,public/}data/fuse.json",
  "{,public/}data/notes/*.{html,md}",
];

// Set of (filename, pageIndex, outputAssetName) tuples that need exporting to
// SVG, as referenced in notes.
const embeddedDiagrams = new Set();

async function main() {
  try {
    let numRewrites = 0;
    for (const noteGlob of noteGlobs) {
      const noteFiles = await glob(path.join(ROOT, noteGlob));
      for (const noteFile of noteFiles) {
        let contents = await fs.readFile(noteFile, FILE_ENCODING);
        let numMatches = 0;
        for (const match of contents.matchAll(DIAGRAM_SRC_RE)) {
          numMatches++;
          embeddedDiagrams.add([match.groups.filename, match.groups.pageIndex || 0]);
        }

        if (numMatches > 0) {
          numRewrites++;
          console.debug(`Rewriting ${numMatches} src attribute(s) in note file ${noteFile}`);
          contents = contents.replaceAll(DIAGRAM_SRC_RE, "src=\"../../$<filename>-$<pageIndex>.svg\"");
          await fs.writeFile(noteFile, contents, FILE_ENCODING);
        }
      }
    }
    console.info(`Rewrote ${numRewrites} note file(s)`);

    for (const [filename, pageIndex] of embeddedDiagrams.values()) {
      const destFilename = `${filename}-${pageIndex}.svg`;
      console.log(`Exporting ${filename}#${pageIndex} to ${destFilename}`);
      const contents = await fs.readFile(path.join(ROOT, "public", filename), FILE_ENCODING);
      const svg = await exportDiagram(contents, pageIndex, "svg");
      await fs.writeFile(path.join(ROOT, "public", destFilename), svg, FILE_ENCODING);
    }
    console.info(`Exported ${embeddedDiagrams.size} diagram(s) to SVG`);
  } catch (err) {
    console.error(`${process.argv0}: encountered an unhandled error:`, err);
    console.error(`Please report this error at ${ISSUES_URL}`);
    process.exit(1);
  }
}

main();
