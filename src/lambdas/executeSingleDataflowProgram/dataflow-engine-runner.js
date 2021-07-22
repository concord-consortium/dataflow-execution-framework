var polyfill = require('@babel/polyfill');
var rete = require('rete');
var nodes = require('./nodes');

const nodeVirtualSensorMethods = [
  {
    type: "temperature",
    virtualValueMethod: (t) => {
      const vals = [20, 20, 20, 21, 21, 21, 20, 20, 21, 21, 21, 21, 21, 21, 21];
      return vals[t % vals.length];
    }
  },
  {
    type: "humidity",
    virtualValueMethod: (t) => {
      const vals = [60, 60, 60, 61, 61, 61, 62, 62, 62, 61, 61, 61, 61, 61, 61, 61];
      return vals[t % vals.length];
    }
  },
  {
    type: "CO2",
    virtualValueMethod: (t) => {
      const vals = [409, 409, 410, 410, 410, 410, 411, 411, 410, 410, 410, 409, 409, 411, 411];
      return vals[t % vals.length];
    }
  },
  {
    type: "O2",
    virtualValueMethod: (t) => {
      const vals = [21, 21, 21, 22, 22, 22, 21, 21, 21, 21, 22, 22, 22, 22, 22];
      return vals[t % vals.length];
    }
  },
  {
    type: "light",
    virtualValueMethod: (t) => {
      const vals = [9000, 9000, 9001, 9001, 9002, 9002, 9002, 9001, 9001, 9001, 9000, 9001, 9001, 9002, 9002];
      return vals[t % vals.length];
    }
  },
  {
    type: "particulates",
    virtualValueMethod: (t) => {
      const vals = [10, 10, 10, 10, 10, 10, 11, 11, 11, 11, 11, 11, 11, 11, 11];
      return vals[t % vals.length];
    }
  }
];

/**
 * Takes a program JSON and an object representing sensor values, and returns a set
 * blocks to save, with their values, and relay values to set.
 *
 * @param {string} programDef Serialized rete program as JS object
 * @param {Object: {[sensorID: string]: number}} sensorValues
 *
 * @returns {boolean} ret.success Whether the program ran correctly in rete
 * @returns {{node: string, value: number}[]} ret.savedNodeValues Array of objects containing node names and values
 * @returns {{relay: stringm value: number}[]} ret.relayValues Array of relay device ids and values
 */
module.exports = async function(programDef, sensorData) {
  setSensorValues(programDef, sensorData);

  const nodesToSave = getNodesToSave(programDef);
  const relays = getRelayNodes(programDef);

  const engine = getDataflowEngine();
  const result = await engine.process(programDef);

  if (result !== "success") {
    return {
      success: false
    };
  }

  const savedNodeValues = nodesToSave.map(id => ({node: id, value: engine.data.nodes[id].outputData.num}));
  const relayValues = relays.map(({id, relay}) => ({relay: relay, value: engine.data.nodes[id].outputData.num}));

  return {
    success: true,
    savedNodeValues,
    relayValues
  }
}

function setSensorValues(programDef, sensorData) {
  for (const id in programDef.nodes) {
    const node = programDef.nodes[id];
    if (node.name === "Sensor" && node.data.sensor) {
      if (!node.data.virtual) {
        if (sensorData[node.data.sensor]) {
          node.data.nodeValue = sensorData[node.data.sensor];
        }
      } else {
        const virtualSensor = nodeVirtualSensorMethods.find((s) => s.type === node.data.type);
        if (virtualSensor) {
          const time = Math.floor(Date.now() / 1000);
          const val = virtualSensor.virtualValueMethod(time);
          node.data.nodeValue = val;
        }
      }
    }
  }
}

function getDataflowEngine() {
  let engine = new rete.Engine('dataflow@0.1.0');

  engine.events['warn'] = [];
  engine.events['error'] = [];

  const numSocket = new rete.Socket("Number value");

  const components = [new nodes.NumberReteNodeFactory(numSocket),
    new nodes.MathReteNodeFactory(numSocket),
    new nodes.TransformReteNodeFactory(numSocket),
    new nodes.LogicReteNodeFactory(numSocket),
    new nodes.SensorReteNodeFactory(numSocket),
    new nodes.RelayReteNodeFactory(numSocket),
    new nodes.GeneratorReteNodeFactory(numSocket),
    new nodes.TimerReteNodeFactory(numSocket),
    new nodes.LightBulbReteNodeFactory(numSocket),
    new nodes.DataStorageReteNodeFactory(numSocket)];

  components.forEach(c => engine.register(c));

  return engine;
}

/**
 * Returns an array of node ids that connect to Data Storage nodes.
 * This makes no assumptions about the number of Data Storage nodes.
 */
function getNodesToSave(programDef) {
  const nodesToSave = [];

  for (const id in programDef.nodes) {
    const node = programDef.nodes[id];
    if (node.name === "Data Storage") {
      for (const input in node.inputs) {
        const connectedNodes = node.inputs[input].connections.map(c => c.node);
        nodesToSave.push.apply(nodesToSave, connectedNodes);
      }
    }
  }

  return nodesToSave;
}

function getRelayNodes(programDef) {
  const relays = [];
  for (const id in programDef.nodes) {
    const node = programDef.nodes[id];
    if (node.name === "Relay") {
      relays.push({id, relay: node.data.relayList});
    }
  }
  return relays;
}