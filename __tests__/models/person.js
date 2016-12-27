"use strict";

var assert = require("assert");

var Building = require('../../scripts/models/building');
var Lift = require('../../scripts/models/lift');
var Floor = require('../../scripts/models/floor');
var Person = require('../../scripts/models/person');

describe("Person model", () => {
  it("should be carried from one floor to another", () => {
    var building = new Building();
    var ground = new Floor(building);
    var firstFloor = new Floor(building);
    var person = new Person(building, firstFloor, ground);
    building.addFloor(ground);
    building.addFloor(firstFloor);

    var lift = new Lift(building, firstFloor);

    building.start();

    // Wait for person to appear
    expect(person.state).toBe(Person.STATE_APPEARING);
    assert.deepEqual(firstFloor.appearing, [person]);
    assert.deepEqual(firstFloor.waiting, []);

    building.fastForward(Person.SPEED_APPEARING);
    expect(person.state).toBe(Person.STATE_WAITING_FOR_LIFT);
    assert.deepEqual(firstFloor.appearing, []);
    assert.deepEqual(firstFloor.waiting, [person]);

    lift.onAddCommand(firstFloor);
    building.tick();
    assert.equal(lift.state, Lift.STATE_MOVING);

    building.tick();
    assert.equal(lift.state, Lift.STATE_DOORS_OPENING);

    building.fastForward(Lift.SPEED_DOORS_OPEN);
    expect(lift.state).toBe(Lift.STATE_UNLOADING);
    assert.deepEqual(lift.enteringLift, []);
    assert.deepEqual(lift.inLift, []);

    // There is no one to offload yet, so we'll start loading next tick
    building.tick();
    expect(lift.state).toBe(Lift.STATE_LOADING);

    building.tick();
    expect(lift.state).toBe(Lift.STATE_LOADING);
    expect(person.state).toBe(Person.STATE_ENTERING_LIFT);
    assert.deepEqual(lift.enteringLift, [person]);
    assert.deepEqual(lift.inLift, []);

    building.fastForward(Person.SPEED_ENTERING_LIFT);
    expect(lift.state).toBe(Lift.STATE_DOORS_CLOSING);
    expect(person.state).toBe(Person.STATE_IN_LIFT);
    assert.deepEqual(lift.inLift, [person]);

    building.fastForward(Lift.SPEED_DOORS_CLOSE);
    expect(lift.state).toBe(Lift.STATE_IDLE);

    lift.onAddCommand(ground);
    building.tick();
    assert.equal(lift.state, Lift.STATE_MOVING);

    building.fastForward(Lift.SPEED_MOVE_ONE_FLOOR);
    expect(lift.currentFloor).toBe(ground);
    expect(lift.state).toBe(Lift.STATE_DOORS_OPENING);

    building.fastForward(Lift.SPEED_DOORS_OPEN);
    expect(lift.state).toBe(Lift.STATE_UNLOADING);

    building.tick();
    expect(person.state).toBe(Person.STATE_EXITING_LIFT);

    building.fastForward(Person.SPEED_EXITING_LIFT);
    expect(person.state).toBe(Person.STATE_EXITING);
  });
});
