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

  it("should move to next floor", () => {
    var building = new Building();
    var ground = new Floor(building);
    var firstFloor = new Floor(building);
    building.addFloor(ground);
    building.addFloor(firstFloor);

    var lift = new Lift(building, ground);

    building.start();
    lift.addCommand(firstFloor);

    expect(lift.currentFloor).toBe(ground);
    assert.deepEqual(lift.queuedFloors, [firstFloor]);
    assert.equal(lift.state, Lift.STATE_MOVING);

    building.fastForward(Lift.SPEED_MOVE_ONE_FLOOR);

    expect(lift.currentFloor).toBe(firstFloor);
    assert.deepEqual(lift.queuedFloors, []);
    expect(lift.state).toBe(Lift.STATE_DOORS_OPENING);
  });
});
