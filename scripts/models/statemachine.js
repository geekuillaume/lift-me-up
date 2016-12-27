"use strict";

const EventEmitter = require('events');
const log = require('debug')('liftmeup:statemachine');

class StateMachine extends EventEmitter {
  constructor() {
    super();
    this.currentAnimationStep = 0;
  }
  setState(state) {
    log("Setting new state to " + state);

    this.state = state;
    this.currentAnimationStep = 0;
  }

  tick() {
    this.currentAnimationStep += 1;
    // Call associated state function
    this["state" + this.state].bind(this)();
  }

  waitForAnimation(threshold, nextState) {
    if(this.currentAnimationStep >= threshold) {
      this.setState(nextState);
    }
  }
}


module.exports = StateMachine;
