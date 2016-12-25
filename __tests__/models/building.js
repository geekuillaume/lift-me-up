"use strict";

var assert = require("assert");

var Building = require('../../scripts/models/building');
var Lift = require('../../scripts/models/lift');
var Floor = require('../../scripts/models/floor');

describe("Building model", () => {
  it("should create new building with empty holders", () => {
    var building = new Building();
    assert.deepEqual(building.floors, []);
    assert.deepEqual(building.lifts, []);
  });

  it("should have a working addLift() command", () => {
    var building = new Building();
    assert.deepEqual(building.lifts, []);

    var lift = new Lift(building);
    building.addLift(lift);

    assert.deepEqual(building.lifts, [lift]);
  });

  it("should have a working addFloor() command", () => {
    var building = new Building();
    assert.deepEqual(building.floors, []);

    var floor = new Floor(building);
    building.addFloor(floor);

    assert.deepEqual(building.floors, [floor]);
  });
});
