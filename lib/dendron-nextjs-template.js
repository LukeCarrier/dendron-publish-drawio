const fs = require("fs").promises;
const path = require("path");

async function isDendronWorkspaceWithNextjsTemplate(workspacePath) {
  const templatePath = path.join(workspacePath, ".next")
  try {
    const templateDir = await fs.stat(templatePath);
    return templateDir.isDirectory() ? templatePath : null;
  } catch (err) {
    return false;
  }
}

async function* getPublishedNoteFiles(templatePath) {
  yield path.join(templatePath, "data", "fuse.json");
  yield path.join(templatePath, "public", "data", "fuse.json");

  const notePaths = [
    ["data", "notes"],
    ["public", "data", "notes"],
  ]
  for (const relNotePath of notePaths) {
    const notePath = path.join(templatePath, ...relNotePath)
    const noteDir = await fs.opendir(notePath);
    for await (const note of noteDir) {
      if (note.name.endsWith("html") || note.name.endsWith("md")) {
        yield path.join(notePath, note.name);
      }
    }
  }
}

module.exports = {
  isDendronWorkspaceWithNextjsTemplate,
  getPublishedNoteFiles,
};
