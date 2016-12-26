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

    this.stateFunctions = {};
    this.stateFunctions[Lift.STATE_IDLE] = this.stateIdle;
    this.stateFunctions[Lift.STATE_MOVING] = this.stateMoving;
    this.stateFunctions[Lift.STATE_DOORS_OPENING] = this.stateDoorsOpening;
    this.stateFunctions[Lift.STATE_DOORS_OPEN] = this.stateDoorsOpen;
    this.stateFunctions[Lift.STATE_DOORS_CLOSING] = this.stateDoorsClosing;

    var self = this;
    building.on(Building.TICK, () => {
      self.tick();
    });
  }

  addCommand(floor) {
    log("Queuing new floor: " + floor.number);

    this.queuedFloors.push(floor);
  }

  stateIdle() {
    console.log("IDLING", this.queuedFloors.length);
    if(this.queuedFloors.length > 0) {
      this.setState(Lift.STATE_MOVING);
    }
  }

  setState(state) {
    log("Setting new state to " + state);

    this.state = state;
    this.currentAnimationStep = 0;
  }

  waitForAnimation(threshold, nextState) {
    if(this.currentAnimationStep >= threshold) {
      this.setState(nextState);
    }
  }

  tick() {
    this.currentAnimationStep += 1;
    console.log("LS:" , this.state)
    this.stateFunctions[this.state].bind(this)();
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
    this.waitForAnimation(Lift.SPEED_DOORS_OPEN, Lift.STATE_DOORS_OPEN);
  }

  stateDoorsClosing() {
    this.waitForAnimation(Lift.SPEED_DOORS_CLOSE, Lift.STATE_IDLE);
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
