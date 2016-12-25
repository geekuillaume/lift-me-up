"use strict";

var assert = require("assert");

var Building = require('../../scripts/models/building');

describe("Building model", () => {
  it("should let user create new building with empty holders", () => {
    var building = new Building();
    assert.deepEqual(building.floors, []);
    assert.deepEqual(building.lifts, []);
  });
});
