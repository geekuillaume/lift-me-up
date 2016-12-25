"use strict";
const EventEmitter = require('events');

class Lift extends EventEmitter {
  constructor(building) {
    super();
    this.building = building;
  }
}


module.exports = Lift;
