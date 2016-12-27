"use strict";

const EventEmitter = require('events');
const log = require('debug')('liftmeup:statemachine');
const noop = function() {};

class StateMachine extends EventEmitter {
  constructor() {
    super();
    this.currentAnimationStep = 0;
  }

  setState(state) {
    if(!state) {
      throw new Error("Empty state does not exist!");
    }

    log("Setting new state to " + state);

    this.state = state;
    this.currentAnimationStep = 0;
  }

  tick() {
    this.currentAnimationStep += 1;
    // Call associated state function
    var stateFunction = this["state" + this.state];
    if(!stateFunction) {
      throw new Error("Unknown state function: " + this.state + " (looking for function state" + this.state + "())");
    }

    stateFunction.bind(this)();
  }

  waitForAnimation(threshold, cb, nextState) {
    if(!nextState) {
      nextState = cb;
      cb = noop;
    }

    if(this.currentAnimationStep >= threshold) {
      cb();
      this.setState(nextState);
    }
  }
}


module.exports = StateMachine;
