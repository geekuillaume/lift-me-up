"use strict";
const EventEmitter = require('events');

class Building extends EventEmitter {
  constructor() {
    super();
    this.state = Building.STATE_CREATING;
    this.floors = [];
    this.lifts = [];
  }

  addLift(lift) {
    this.lifts.push(lift);
  }

  addFloor(floor) {
    floor.number = this.floors.length;

    this.floors.push(floor);
  }

  start() {
    this.state = Building.STATE_PLAYING;
    this.emit(Building.START_LEVEL);
  }

  tick() {
    console.log(this.emit(Building.TICK));
  }

  fastForward(ticksCount) {
    while(ticksCount > 0) {
      ticksCount -= 1;
      this.tick();
    }
  }
}

Building.STATE_CREATING = "creation";
Building.STATE_PLAYING = "playing";

Building.START_LEVEL = "startLevel";
Building.TICK = "tick";

module.exports = Building;
