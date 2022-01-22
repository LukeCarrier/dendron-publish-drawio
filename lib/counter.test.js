const Counter = require("./counter");

describe("Counter", () => {
  it("increments on count", () => {
    const counter = new Counter();
    counter.count();
    counter.count();

    expect(counter.total).toBe(2);
  });
});
