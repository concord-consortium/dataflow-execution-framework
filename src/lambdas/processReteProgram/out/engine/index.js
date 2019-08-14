"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const component_1 = require("./component");
exports.Component = component_1.Component;
const context_1 = require("../core/context");
const recursion_1 = require("./recursion");
exports.Recursion = recursion_1.Recursion;
const state_1 = require("./state");
const validator_1 = require("../core/validator");
const events_1 = require("./events");
class Engine extends context_1.Context {
    constructor(id) {
        super(id, new events_1.EngineEvents());
        this.args = [];
        this.data = null;
        this.state = state_1.State.AVAILABLE;
        this.onAbort = () => { };
    }
    clone() {
        const engine = new Engine(this.id);
        this.components.forEach(c => engine.register(c));
        return engine;
    }
    throwError(message, data = null) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.abort();
            this.trigger('error', { message, data });
            this.processDone();
            return 'error';
        });
    }
    processStart() {
        if (this.state === state_1.State.AVAILABLE) {
            this.state = state_1.State.PROCESSED;
            return true;
        }
        if (this.state === state_1.State.ABORT) {
            return false;
        }
        console.warn(`The process is busy and has not been restarted.
                Use abort() to force it to complete`);
        return false;
    }
    processDone() {
        const success = this.state !== state_1.State.ABORT;
        this.state = state_1.State.AVAILABLE;
        if (!success) {
            this.onAbort();
            this.onAbort = () => { };
        }
        return success;
    }
    abort() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(ret => {
                if (this.state === state_1.State.PROCESSED) {
                    this.state = state_1.State.ABORT;
                    this.onAbort = ret;
                }
                else if (this.state === state_1.State.ABORT) {
                    this.onAbort();
                    this.onAbort = ret;
                }
                else
                    ret();
            });
        });
    }
    lock(node) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(res => {
                node.unlockPool = node.unlockPool || [];
                if (node.busy && !node.outputData)
                    node.unlockPool.push(res);
                else
                    res();
                node.busy = true;
            });
        });
    }
    unlock(node) {
        node.unlockPool.forEach(a => a());
        node.unlockPool = [];
        node.busy = false;
    }
    extractInputData(node) {
        return __awaiter(this, void 0, void 0, function* () {
            const obj = {};
            for (let key of Object.keys(node.inputs)) {
                const input = node.inputs[key];
                const conns = input.connections;
                const connData = yield Promise.all(conns.map((c) => __awaiter(this, void 0, void 0, function* () {
                    const prevNode = this.data.nodes[c.node];
                    const outputs = yield this.processNode(prevNode);
                    if (!outputs)
                        this.abort();
                    else
                        return outputs[c.output];
                })));
                obj[key] = connData;
            }
            return obj;
        });
    }
    processWorker(node) {
        return __awaiter(this, void 0, void 0, function* () {
            const inputData = yield this.extractInputData(node);
            const component = this.components.get(node.name);
            const outputData = {};
            try {
                yield component.worker(node, inputData, outputData, ...this.args);
            }
            catch (e) {
                this.abort();
                this.trigger('warn', e);
            }
            return outputData;
        });
    }
    processNode(node) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.state === state_1.State.ABORT || !node)
                return null;
            yield this.lock(node);
            if (!node.outputData) {
                node.outputData = yield this.processWorker(node);
            }
            this.unlock(node);
            return node.outputData;
        });
    }
    forwardProcess(node) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.state === state_1.State.ABORT)
                return null;
            return yield Promise.all(Object.keys(node.outputs).map((key) => __awaiter(this, void 0, void 0, function* () {
                const output = node.outputs[key];
                return yield Promise.all(output.connections.map((c) => __awaiter(this, void 0, void 0, function* () {
                    const nextNode = this.data.nodes[c.node];
                    yield this.processNode(nextNode);
                    yield this.forwardProcess(nextNode);
                })));
            })));
        });
    }
    copy(data) {
        data = Object.assign({}, data);
        data.nodes = Object.assign({}, data.nodes);
        Object.keys(data.nodes).forEach(key => {
            data.nodes[key] = Object.assign({}, data.nodes[key]);
        });
        return data;
    }
    validate(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const checking = validator_1.Validator.validate(this.id, data);
            const recursion = new recursion_1.Recursion(data.nodes);
            if (!checking.success)
                return yield this.throwError(checking.msg);
            const recurrentNode = recursion.detect();
            if (recurrentNode)
                return yield this.throwError('Recursion detected', recurrentNode);
            return true;
        });
    }
    processStartNode(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!id)
                return;
            let startNode = this.data.nodes[id];
            if (!startNode)
                return yield this.throwError('Node with such id not found');
            yield this.processNode(startNode);
            yield this.forwardProcess(startNode);
        });
    }
    processUnreachable() {
        return __awaiter(this, void 0, void 0, function* () {
            const data = this.data;
            for (let i in data.nodes) { // process nodes that have not been reached
                const node = data.nodes[i];
                if (typeof node.outputData === 'undefined') {
                    yield this.processNode(node);
                    yield this.forwardProcess(node);
                }
            }
        });
    }
    process(data, startId = null, ...args) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.processStart())
                return;
            if (!this.validate(data))
                return;
            this.data = this.copy(data);
            this.args = args;
            yield this.processStartNode(startId);
            yield this.processUnreachable();
            return this.processDone() ? 'success' : 'aborted';
        });
    }
}
exports.Engine = Engine;
