const fs = require("fs");

const { isDendronWorkspaceWithNextjsTemplate } = require("./dendron-nextjs-template");

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

describe("findNoteFiles", () => {});
