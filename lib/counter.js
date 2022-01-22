class Counter {
  constructor() {
    this._total = 0;
  }

  count() {
    this._total++;
  }

  get total() {
    return this._total;
  }
}

module.exports = Counter;
