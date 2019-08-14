"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Emitter {
    constructor(events) {
        this.events = {};
        this.silent = false;
        this.events = events instanceof Emitter ? events.events : events.handlers;
    }
    on(names, handler) {
        const events = names instanceof Array ? names : names.split(' ');
        events.forEach(name => {
            if (!this.events[name])
                throw new Error(`The event ${name} does not exist`);
            this.events[name].push(handler);
        });
        return this;
    }
    trigger(name, params = {}) {
        if (!(name in this.events))
            throw new Error(`The event ${name} cannot be triggered`);
        return this.events[name].reduce((r, e) => {
            return (e(params) !== false) && r;
        }, true); // return false if at least one event is false        
    }
    bind(name) {
        if (this.events[name])
            throw new Error(`The event ${name} is already bound`);
        this.events[name] = [];
    }
    exist(name) {
        return Array.isArray(this.events[name]);
    }
}
exports.Emitter = Emitter;
