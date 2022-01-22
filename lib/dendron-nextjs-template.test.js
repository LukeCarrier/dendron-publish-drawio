const fs = require("fs");

const {
  isDendronWorkspaceWithNextjsTemplate,
  getPublishedNoteFiles,
} = require("./dendron-nextjs-template");

describe("isDendronWorkspaceWithNextjsTemplate", () => {
  it("returns the path to .next if it exists and is a directory", async () => {
    const isDirectory = jest.fn(() => true);
    const stat = jest.spyOn(fs.promises, "stat")
      .mockImplementation(() => {
        return { isDirectory };
      });

    expect.assertions(1);
    const nextTemplateDir = await isDendronWorkspaceWithNextjsTemplate("/dendron");
    expect(nextTemplateDir).toMatch(/dendron.*\.next/);

    stat.mockRestore();
  });

  it("returns false if .next doesn't exist or isn't a directory", async () => {
    const stat = jest.spyOn(fs.promises, "stat")
      .mockImplementation(async () => {
        return new Promise().reject(new Error("oops"));
      });

    expect.assertions(1);
    expect(await isDendronWorkspaceWithNextjsTemplate("/dendron")).toBe(false);

    stat.mockRestore();
  });
});

describe("getPublishedNoteFiles", () => {
  it("generates published note filenames", async () => {
    const opendir = jest.spyOn(fs.promises, "opendir")
      .mockImplementation(async (path) => {
        return {
          async *[Symbol.asyncIterator]() {
            yield { name: "l.html" };
            yield { name: "l.md" };
            yield { name: "l.python.html" };
            yield { name: "l.python.md" };
          }
        }
      });

    const noteFileGenerator = getPublishedNoteFiles("/dendron/.next");
    const noteFiles = [];
    for await (const noteFile of noteFileGenerator) {
      noteFiles.push(noteFile);
    }
    expect(noteFiles).toEqual(expect.arrayContaining([
      "/dendron/.next/data/fuse.json",
      "/dendron/.next/data/notes/l.html",
    ]));

    opendir.mockRestore();
  });
});
