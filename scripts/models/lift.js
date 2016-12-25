"use strict";
const EventEmitter = require('events');
const log = require('debug')('liftmeup:lift');

const Building = require('./building');

class Lift extends EventEmitter {
  constructor(building, floor) {
    super();
    this.building = building;
    this.queuedFloors = [];
    this.currentFloor = floor;
    this.currentAnimationStep = 0;
    this.state = Lift.STATE_IDLE;

    this.on(Building.TICK, this.tick);
  }

  addCommand(floor) {
    log("Queuing new floor: " + floor.number);

    this.queuedFloors.push(floor);
    this.idleOrMove();
  }

  idleOrMove() {
    if(this.queuedFloors.length === 0) {
      this.setNextState(Lift.STATE_IDLE);
    }
    else {
      this.setNextState(Lift.STATE_MOVING);
    }
  }

  setNextState(state) {
    log("Setting new state to " + state);

    this.state = state;
    this.currentAnimationStep = 0;
  }

  tick() {
    if(this.state === Lift.STATE_IDLE) {
      return;
    }

    this.currentAnimationStep += 1;

    if(this.state === Lift.STATE_MOVING) {
      var numbersOfFloors = Math.abs(this.currentFloor.number - this.queuedFloors[0].number);
      if(this.currentAnimationStep >= numbersOfFloors * Lift.SPEED_MOVE_ONE_FLOOR) {
        // Arrived at floor
        this.currentFloor = this.queuedFloors.pop();

        // Start opening doors
        this.setNextState(Lift.STATE_DOORS_OPENING);
      }
    }
    else if(this.state === Lift.STATE_DOORS_OPENING && this.currentAnimationStep >= Lift.SPEED_DOORS_OPEN) {
      // Doors are now open
      this.setNextState(Lift.STATE_DOORS_OPEN);
    }
    else if(this.state === Lift.STATE_DOORS_CLOSING && this.currentAnimationStep >= Lift.SPEED_DOORS_CLOSE) {
      // Doors are now closed, move to next destination if any
      this.idleOrMove();
    }
  }
}

Lift.SPEED_MOVE_ONE_FLOOR = 20;
Lift.SPEED_DOORS_OPEN = 30;
Lift.SPEED_DOORS_CLOSE = 30;

Lift.STATE_IDLE = "idle";
Lift.STATE_MOVING = "moving";
Lift.STATE_DOORS_OPENING = "opening";
Lift.STATE_DOORS_OPEN = "open";
Lift.STATE_DOORS_CLOSING = "closing";


module.exports = Lift;
