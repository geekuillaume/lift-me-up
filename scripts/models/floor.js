"use strict";
const EventEmitter = require('events');

class Floor extends EventEmitter {
  constructor(building) {
    super();
    this.building = building;

    // Array of people related to this flor
    this.appearing = [];
    this.waiting = [];
    this.leaving = [];

    this.on(Floor.EVENT_UNLOAD_REQUEST, (options) => this.unloadLift(options));
  }

  unloadLift(options) {
    var lift = options.lift;


  }
}

Floor.EVENT_UNLOAD_REQUEST = "unloadRequest";


module.exports = Floor;
