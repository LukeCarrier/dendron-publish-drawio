class DiagramSet {
  constructor() {
    this.diagrams = {};
  }

  add(filename, pageIndex) {
    if (!this.diagrams.hasOwnProperty(filename)) {
      this.diagrams[filename] = new Set();
    }

    this.diagrams[filename].add(pageIndex);
  }

  *[Symbol.iterator]() {
    for (const entry of Object.entries(this.diagrams)) {
      yield entry;
    }
  }
}

module.exports = DiagramSet;
