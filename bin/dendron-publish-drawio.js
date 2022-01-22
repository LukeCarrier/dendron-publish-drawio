#!/usr/bin/env node
const fs = require("fs").promises;
const path = require("path");
const process = require("process");

const { exportDiagram } = require("drawio-export-puppeteer");

const Counter = require("../lib/counter");
const {
  getPublishedNoteFiles,
  isDendronWorkspaceWithNextjsTemplate,
} = require("../lib/dendron-nextjs-template");
const { rewriteDrawioDiagramSrcs } = require("../lib/dendron-note");

const ISSUES_URL = "https://github.com/LukeCarrier/dendron-publish-drawio/issues";

const FILE_ENCODING = "utf8";

// Root of the .next directory.
const WORKSPACE = process.cwd();

// Set of (filename, pageIndex, outputAssetName) tuples that need exporting to
// SVG, as referenced in notes.
const embeddedDiagrams = new Set();

async function main() {
  const templatePath = await isDendronWorkspaceWithNextjsTemplate(WORKSPACE);
  if (!templatePath) {
    console.error([
      `Couldn't find the nextjs-template directory at ${WORKSPACE}; make sure`,
      "you're running the command from the top of your Dendron workspace, and",
      "that you've run dendron publish init.",
    ].join(" "));
    process.exit(1);
  }

  try {
    let numFiles = new Counter();
    let numRefs = new Counter();
    const noteFileGenerator = getPublishedNoteFiles(templatePath);
    for await (const notePath of noteFileGenerator) {
      const diagramSrcGenerator = rewriteDrawioDiagramSrcs(notePath, numFiles);
      for await (const diagramRef of diagramSrcGenerator) {
        numRefs.count();
        embeddedDiagrams.add(diagramRef);
      }
    }
    console.info(`Rewrote ${numRefs.total} references to ${embeddedDiagrams.size} diagrams in ${numFiles.total} note file(s)`);

    for (const [filename, pageIndex] of embeddedDiagrams.values()) {
      const destFilename = `${filename}-${pageIndex}.svg`;
      console.log(`Exporting ${filename}#${pageIndex} to ${destFilename}`);
      const contents = await fs.readFile(path.join(templatePath, "public", filename), FILE_ENCODING);
      const svg = await exportDiagram(contents, pageIndex, "svg");
      await fs.writeFile(path.join(templatePath, "public", destFilename), svg, FILE_ENCODING);
    }
    console.info(`Exported ${embeddedDiagrams.size} diagram(s) to SVG`);
  } catch (err) {
    console.error(`${process.argv0}: encountered an unhandled error:`, err);
    console.error(`Please report this error at ${ISSUES_URL}`);
    process.exit(1);
  }
}

main();
