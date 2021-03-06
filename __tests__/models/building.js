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
    assert.equal(building.state, Building.STATE_CREATING);
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

  it("should set floor number", () => {
    var building = new Building();
    assert.deepEqual(building.floors, []);

    var ground = new Floor(building);
    var firstFloor = new Floor(building);
    building.addFloor(ground);
    building.addFloor(firstFloor);

    assert.deepEqual(building.floors, [ground, firstFloor]);
    assert.equal(ground.number, 0);
    assert.equal(firstFloor.number, 1);
  });

  it("should emit START_LEVEL on start()", (done) => {
    var building = new Building();

    building.on(Building.START_LEVEL, function() {
      assert.equal(building.state, Building.STATE_PLAYING);
      done();
    });
    building.start();
  });
});
