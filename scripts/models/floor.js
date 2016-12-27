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
    this.exiting = [];

    this.on(Floor.EVENT_UNLOAD_REQUEST, (options) => this.unloadLift(options));
    this.on(Floor.EVENT_LOAD_REQUEST, (options) => this.loadLift(options));
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

  unloadLift(options) {
    var lift = options.lift;
    var people = options.leaving;

    if(people.length === 0) {
      lift.emit(require('./lift').EVENT_UNLOADED);
      return;
    }

    lift.inLift.forEach((p) => p.onLiftArrivedToExit(this));
  }

  loadLift(options) {
    var lift = options.lift;

    if(this.waiting.length === 0) {
      lift.emit(require('./lift').EVENT_LOADED);
      return;
    }

    this.waiting.forEach((p) => p.onLiftArrivedToEnter(lift));
  }
}

Floor.EVENT_UNLOAD_REQUEST = "unloadRequest";


module.exports = Floor;
