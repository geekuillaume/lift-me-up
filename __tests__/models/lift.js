"use strict";

var assert = require("assert");

var Building = require('../../scripts/models/building');
var Lift = require('../../scripts/models/lift');

describe("Lift model", () => {
  it("should create new lift when given a building", () => {
    var building = new Building();
    var lift = new Lift(building);

    assert.deepEqual(lift.building, building);
  });
});
