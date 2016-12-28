"use strict";

class EventEmitter {
  constructor() {
    this._events = {};
  }

  emit(event, options) {
    if(!this._events[event]) {
      return;
    }

    this._events[event].forEach((l) => l.call(this, options));
  }

  on(event, listener) {
    if(!this._events[event]) {
      this._events[event] = [];
    }

    this._events[event].push(listener);
  }

  once(event, listener) {
    var realListener = function realListener(options) {
      this.removeListener(event, realListener);
      listener(options);
    };

    this.on(event, realListener);
  }

  removeListener(event, listener) {
    var index = this._events[event].indexOf(listener);
    if(index === -1) {
      console.log(this._events[event]);
      throw new Error("Listener can't be removed (does not exist)");
    }

    this._events[event].splice(index, 1);
  }
}


module.exports = EventEmitter;
