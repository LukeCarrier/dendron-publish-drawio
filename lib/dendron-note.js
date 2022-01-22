const fs = require("fs").promises;

const FILE_ENCODING = "utf8";

// Matches src="some/file.drawio" and src="some/file.drawio#42"
const DIAGRAM_SRC_RE = /src="(?<filename>[a-zA-Z0-9\/\.]+\.drawio)(#(?<pageIndex>[0-9]+))?"/g;

async function* rewriteDrawioDiagramSrcs(notePath, assetsPrefix, numFiles) {
  let contents = await fs.readFile(notePath, FILE_ENCODING);
  let numMatches = 0;
  for (const match of contents.matchAll(DIAGRAM_SRC_RE)) {
    numMatches++;
    const filename = assetsPrefix.length > 0 ?
      match.groups.filename.substring(assetsPrefix.length + 1) :
      match.groups.filename;
    yield [filename, parseInt(match.groups.pageIndex, 10) || 0];
  }

  if (numMatches > 0) {
    numFiles.count();
    console.debug(`Rewriting ${numMatches} src attribute(s) in note file ${notePath}`);
    contents = contents.replaceAll(DIAGRAM_SRC_RE, "src=\"../../$<filename>-$<pageIndex>.svg\"");
    await fs.writeFile(notePath, contents, FILE_ENCODING);
  }
}

module.exports = { rewriteDrawioDiagramSrcs };
