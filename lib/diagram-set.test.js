const DiagramSet = require("./diagram-set");

describe("DiagramSet", () => {
  it("stores filename and pageIndex pairs and iterates by filename", () => {
    const diagramSet = new DiagramSet();
    diagramSet.add("test1.drawio", 1);
    diagramSet.add("test1.drawio", 2);
    diagramSet.add("test2.drawio", 3);

    const diagrams = {};
    for (const [filename, pageIndices] of diagramSet) {
      diagrams[filename] = pageIndices;
    }

    expect(diagrams).toEqual({
      "test1.drawio": new Set([1, 2]),
      "test2.drawio": new Set([3]),
    });
  });
});
