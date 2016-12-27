"use strict";
const log = require('debug')('liftmeup:lift');

const StateMachine = require('./statemachine');
const Building = require('./building');
const Floor = require('./floor');

class Lift extends StateMachine {
  constructor(building, floor) {
    super();
    this.building = building;
    this.queuedFloors = [];
    this.currentFloor = floor;
    this.inLift = [];

    this.state = Lift.STATE_IDLE;

    // Working around scoping issues, adding "buffer" function keeping the this context intact
    building.on(Building.TICK, () => this.tick());
  }

  addCommand(floor) {
    log("Queuing new floor: " + floor.number);

    this.queuedFloors.push(floor);
  }

  stateIdle() {
    if(this.queuedFloors.length > 0) {
      this.setState(Lift.STATE_MOVING);
    }
  }

  stateMoving() {
    var numbersOfFloors = Math.abs(this.currentFloor.number - this.queuedFloors[0].number);

    if(this.currentAnimationStep >= numbersOfFloors * Lift.SPEED_MOVE_ONE_FLOOR) {
      // Arrived at floor
      this.currentFloor = this.queuedFloors.pop();

      // Start opening doors
      this.setState(Lift.STATE_DOORS_OPENING);
    }
  }
  stateDoorsOpening() {
    this.waitForAnimation(Lift.SPEED_DOORS_OPEN, Lift.STATE_UNLOADING);
  }

  stateDoorsClosing() {
    this.waitForAnimation(Lift.SPEED_DOORS_CLOSE, Lift.STATE_IDLE);
  }

  stateUnloading() {
    this.currentFloor.emit(Floor.EVENT_UNLOAD_REQUEST, {
      lift: this,
      leaving: this.inLift.filter((p) => p.destination === this.currentFloor)
    });
  }
}

Lift.SPEED_MOVE_ONE_FLOOR = 20;
Lift.SPEED_DOORS_OPEN = 30;
Lift.SPEED_DOORS_CLOSE = 30;

Lift.STATE_IDLE = "Idle";
Lift.STATE_MOVING = "Moving";
Lift.STATE_DOORS_OPENING = "DoorsOpening";
Lift.STATE_UNLOADING = "Unloading";
Lift.STATE_LOADING = "Koading";
Lift.STATE_DOORS_CLOSING = "DoorsClosing";


module.exports = Lift;
