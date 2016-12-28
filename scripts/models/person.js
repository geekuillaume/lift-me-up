"use strict";

const StateMachine = require('./statemachine');
const Building = require('./building');

class Person extends StateMachine {
  constructor(building, currentFloor, destinationFloor) {
    super();
    this.building = building;
    this.floor = currentFloor;
    this.lift = null;
    this.destination = destinationFloor;

    this.floor.moveTo(null, "appearing", this);

    this.state = Person.STATE_APPEARING;

    this.ticker = () => this.tick();
    building.on(Building.TICK, this.ticker);
  }

  onLiftArrivedToEnter(lift) {
    this.lift = lift;
    this.lift.moveTo(null, "enteringLift", this);
    this.floor.moveTo("waiting", "leaving", this);
    this.setState(Person.STATE_ENTERING_LIFT);
  }

  onLiftArrivedToExit(floor) {
    this.floor = floor;
    this.lift.moveTo("inLift", "exitingLift", this);
    this.floor.moveTo(null, "exiting", this);
    this.setState(Person.STATE_EXITING_LIFT);
  }

  stateAppearing() {
    this.waitForAnimation(Person.SPEED_APPEARING, this.onceAppeared.bind(this), Person.STATE_WAITING_FOR_LIFT);
  }

  onceAppeared() {
    this.floor.moveTo("appearing", "waiting", this);
  }

  stateWaitingForLift() {

  }

  stateEnteringLift() {
    this.waitForAnimation(Person.SPEED_ENTERING_LIFT, this.onceEnteredLift.bind(this), Person.STATE_IN_LIFT);
  }

  onceEnteredLift() {
    this.floor.moveTo("leaving", null, this);
    this.lift.moveTo("enteringLift", "inLift", this);
    this.floor = null;
  }

  stateExitingLift() {
    this.waitForAnimation(Person.SPEED_EXITING_LIFT, this.onceExitedLift.bind(this), Person.STATE_EXITING);
  }

  onceExitedLift() {
    this.lift.moveTo("exitingLift", null, this);
    this.lift = null;
    this.floor.moveTo(null, "exiting", this);
  }

  stateExiting() {
    this.waitForAnimation(Person.SPEED_EXITING, this.onceExiting.bind(this), Person.STATE_EXITED);
  }

  onceExiting() {
    this.floor.moveTo("exiting", null, this);
    this.floor = null;

    // No need to tick anymore.
    this.building.removeListener(Building.TICK, this.ticker);
  }

  stateExited() {
    throw new Error("Tick should not be registered on exited person.");
  }

  stateInLift() {

  }
}

Person.STATE_APPEARING = "Appearing";
Person.STATE_WAITING_FOR_LIFT = "WaitingForLift";
Person.STATE_ENTERING_LIFT = "EnteringLift";
Person.STATE_IN_LIFT = "InLift";
Person.STATE_EXITING_LIFT = "ExitingLift";
Person.STATE_EXITING = "Exiting";
Person.STATE_EXITED = "Exited";

Person.SPEED_APPEARING = 20;
Person.SPEED_EXITING = 20;
Person.SPEED_ENTERING_LIFT = 20;
Person.SPEED_EXITING_LIFT = 20;

module.exports = Person;
