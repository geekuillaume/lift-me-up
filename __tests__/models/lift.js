"use strict";

var assert = require("assert");

var Building = require('../../scripts/models/building');
var Lift = require('../../scripts/models/lift');
var Floor = require('../../scripts/models/floor');


describe("Lift model", () => {
  it("should create new lift when given a building", () => {
    var building = new Building();
    var floor = new Floor(building);
    var lift = new Lift(building, floor);

    assert.deepEqual(lift.building, building);
    assert.deepEqual(lift.currentFloor, floor);
  });

  it("should let user queue floor commands", () => {
    var building = new Building();
    var floor = new Floor(building);
    var lift = new Lift(building, floor);

    building.start();
    lift.addCommand(floor);

    assert.deepEqual(lift.queuedFloors, [floor]);
  });
});
