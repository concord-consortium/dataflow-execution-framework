"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function intersect(array1, array2) {
    return array1.filter(value => -1 !== array2.indexOf(value));
}
class Recursion {
    constructor(nodes) {
        this.nodes = nodes;
    }
    extractInputNodes(node) {
        return Object.keys(node.inputs).reduce((acc, key) => {
            const { connections } = node.inputs[key];
            const nodesData = (connections || []).reduce((b, c) => {
                return [...b, this.nodes[c.node]];
            }, []);
            return [...acc, ...nodesData];
        }, []);
    }
    findSelf(list, inputNodes) {
        const inters = intersect(list, inputNodes);
        if (inters.length)
            return inters[0];
        for (let node of inputNodes) {
            let l = [node, ...list];
            let inter = this.findSelf(l, this.extractInputNodes(node));
            if (inter)
                return inter;
        }
        return null;
    }
    detect() {
        const nodesArr = Object.keys(this.nodes).map(id => this.nodes[id]);
        for (let node of nodesArr) {
            let inters = this.findSelf([node], this.extractInputNodes(node));
            if (inters)
                return inters;
        }
        return null;
    }
}
exports.Recursion = Recursion;
