"use strict";
const EventEmitter = require('events');

class Floor extends EventEmitter {
  constructor(building) {
    super();
    this.building = building;
  }
}


module.exports = Floor;
