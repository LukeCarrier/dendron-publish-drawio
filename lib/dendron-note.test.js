const fs = require("fs");

const Counter = require("./counter");

describe("rewriteDrawioDiagramSrcs", () => {
  const { rewriteDrawioDiagramSrcs } = require("./dendron-note");
  const readFileMock = jest.spyOn(fs.promises, "readFile");
  const writeFileMock = jest.spyOn(fs.promises, "writeFile")
    .mockImplementation(() => {});
  const counterMock = jest.mock("./counter");

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("rewrites HTML files with matches", async () => {
    readFileMock.mockImplementation(async () => {
      return `<h1>My diagram</h1>
<img src="assets/diagrams/my.diagram.drawio#1" alt="My diagram">`;
    });

    const counter = new Counter();
    const diagramSrcGenerator = rewriteDrawioDiagramSrcs(
      "/dendron/.next/data/notes/l.md", "", counter);
    const diagramSrcs = [];
    for await (const diagramSrc of diagramSrcGenerator) {
      diagramSrcs.push(diagramSrc);
    }

    expect(readFileMock).toHaveBeenCalledTimes(1);
    expect(writeFileMock).toHaveBeenCalledTimes(1);
  });

  it("ignores assetsPrefix in matches", async () => {
    readFileMock.mockImplementation(async () => {
      return `<h1>My diagram</h1>
<img src="/etc/assets/diagrams/my.diagram.drawio#1" alt="My diagram">`;
    });

    const counter = new Counter();
    const diagramSrcGenerator = rewriteDrawioDiagramSrcs(
      "/dendron/.next/data/notes/l.md", "/etc", counter);
    const diagramSrcs = [];
    for await (const diagramSrc of diagramSrcGenerator) {
      diagramSrcs.push(diagramSrc);
    }

    expect(readFileMock).toHaveBeenCalledTimes(1);
    expect(writeFileMock).toHaveBeenCalledTimes(1);
  });

  it("generates match [filename, pageIndex] pairs", async () => {
    readFileMock.mockImplementation(async () => {
      return `<h1>My diagram</h1>
<img src="assets/diagrams/my.diagram.drawio#1" alt="My diagram">`;
    });

    const counter = new Counter();
    const diagramSrcGenerator = rewriteDrawioDiagramSrcs(
      "/dendron/.next/data/notes/l.md", "", counter);
    const diagramSrcs = [];
    for await (const diagramSrc of diagramSrcGenerator) {
      diagramSrcs.push(diagramSrc);
    }

    expect(diagramSrcs.length).toBe(1);
    expect(diagramSrcs).toEqual(expect.arrayContaining([
      ["assets/diagrams/my.diagram.drawio", 1],
    ]));
  });

  it("increments numFiles counter on match", async () => {
    readFileMock.mockImplementation(async () => {
      return `<h1>My diagram</h1>
<img src="assets/diagrams/my.diagram.drawio#1" alt="My diagram">`;
    });

    const counter = new Counter();
    const diagramSrcGenerator = rewriteDrawioDiagramSrcs(
      "/dendron/.next/data/notes/l.md", "", counter);
    const diagramSrcs = [];
    for await (const diagramSrc of diagramSrcGenerator) {
      diagramSrcs.push(diagramSrc);
    }

    expect(counter.total).toBe(1);
  });

  it("only rewrites files with matches", async () => {
    readFileMock.mockImplementation(async () => {
      return `<h1>My diagram</h1>
<img src="assets/diagrams/my.diagram.svg alt="My diagram">`;
    });

    const counter = new Counter();
    const diagramSrcGenerator = rewriteDrawioDiagramSrcs(
      "/dendron/.next/data/notes/l.md", "", counter);
    const diagramSrcs = [];
    for await (const diagramSrc of diagramSrcGenerator) {
      diagramSrcs.push(diagramSrc);
    }

    expect(writeFileMock).not.toHaveBeenCalled();
  });
});
