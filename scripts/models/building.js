"use strict";
const EventEmitter = require('events');

class Building extends EventEmitter {
  constructor() {
    super();
    this.floors = [];
    this.lifts = [];
  }

  addLift(lift) {
    this.lifts.push(lift);
  }

  addFloor(floor) {
    this.floors.push(floor);
  }
}


module.exports = Building;
