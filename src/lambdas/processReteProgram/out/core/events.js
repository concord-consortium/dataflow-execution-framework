"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Events {
    constructor(handlers) {
        this.handlers = Object.assign({ warn: [console.warn], error: [console.error], componentregister: [], destroy: [] }, handlers);
    }
}
exports.Events = Events;
