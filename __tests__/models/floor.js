"use strict";

var assert = require("assert");

var Building = require('../../scripts/models/building');
var Floor = require('../../scripts/models/floor');

describe("Floor model", () => {
  it("should create new floor when given a building", () => {
    var building = new Building();
    var floor = new Floor(building);

    assert.deepEqual(floor.building, building);
  });
});
