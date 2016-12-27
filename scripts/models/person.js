"use strict";
const EventEmitter = require('events');

class Person extends EventEmitter {
  constructor(building, currentFloor, destinationFloor) {
    super();
    this.building = building;
    this.floor = currentFloor;
    this.destination = destinationFloor;
  }
}

module.exports = Person;
