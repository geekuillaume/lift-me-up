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
    this.enteringLift = [];
    this.inLift = [];
    this.exitingLift = [];

    this.state = Lift.STATE_IDLE;

    // Working around scoping issues, adding "buffer" function keeping the this context intact
    building.on(Building.TICK, () => this.tick());
  }

  moveTo(oldList, newList, person) {
    if(oldList) {
      var index = this[oldList].indexOf(person);
      if(index === -1) {
        throw new Error("Can't move person from list, does not exist yet! (" + oldList + " => " + newList + ")");
      }
      this[oldList].splice(index, 1);
    }

    if(newList) {
      this[newList].push(person);
    }
  }

  onAddCommand(floor) {
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
    if(this.currentAnimationStep === 1) {
      this.once(Lift.EVENT_UNLOADED, () => {
        this.setState(Lift.STATE_LOADING);
      });

      this.currentFloor.emit(Floor.EVENT_UNLOAD_REQUEST, {
        lift: this,
        leaving: this.inLift.filter((p) => p.destination === this.currentFloor)
      });
    }
  }

  stateLoading() {
    if(this.currentAnimationStep === 1) {
      this.once(Lift.EVENT_LOADED, () => {
        this.setState(Lift.STATE_DOORS_CLOSING);
      });

      this.currentFloor.emit(Floor.EVENT_LOAD_REQUEST, {
        lift: this,
      });
    }

    if(this.enteringLift.length === 0) {
      this.setState(Lift.STATE_DOORS_CLOSING);
    }
  }
}

Lift.SPEED_MOVE_ONE_FLOOR = 20;
Lift.SPEED_DOORS_OPEN = 30;
Lift.SPEED_DOORS_CLOSE = 30;

Lift.STATE_IDLE = "Idle";
Lift.STATE_MOVING = "Moving";
Lift.STATE_DOORS_OPENING = "DoorsOpening";
Lift.STATE_UNLOADING = "Unloading";
Lift.STATE_LOADING = "Loading";
Lift.STATE_DOORS_CLOSING = "DoorsClosing";

Lift.EVENT_UNLOADED = "unloaded";
Lift.EVENT_LOADED = "loaded";


module.exports = Lift;
