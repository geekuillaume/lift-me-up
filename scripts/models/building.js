"use strict";

module.exports = function Building() {
  this.floors = [];
  this.lifts = [];
};

module.exports.prototype.addLift = function addLift(lift) {
  this.lifts.push(lift);
};

module.exports.prototype.addFloor = function addLift(floor) {
  this.floors.push(floor);
};
