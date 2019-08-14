"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const emitter_1 = require("./emitter");
const validator_1 = require("./validator");
class Context extends emitter_1.Emitter {
    constructor(id, events) {
        super(events);
        if (!validator_1.Validator.isValidId(id))
            throw new Error('ID should be valid to name@0.1.0 format');
        this.id = id;
        this.plugins = new Map();
        this.components = new Map();
    }
    use(plugin, options) {
        if (plugin.name && this.plugins.has(plugin.name))
            throw new Error(`Plugin ${plugin.name} already in use`);
        plugin.install(this, options || {});
        this.plugins.set(plugin.name, options);
    }
    register(component) {
        if (this.components.has(component.name))
            throw new Error(`Component ${component.name} already registered`);
        this.components.set(component.name, component);
        this.trigger('componentregister', component);
    }
    destroy() {
        this.trigger('destroy');
    }
}
exports.Context = Context;
