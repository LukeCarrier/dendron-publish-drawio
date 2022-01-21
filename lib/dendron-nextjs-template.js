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

module.exports = {
  isDendronWorkspaceWithNextjsTemplate,
};
