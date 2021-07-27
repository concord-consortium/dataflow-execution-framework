var assert = require('assert');
var lolex = require("lolex");
var polyfill = require('@babel/polyfill');
var rete = require('rete');
var nodes = require('../nodes');

var singleNodeProgram = require('./data/single-node-dataflow');
const complexProgram = require('./data/complex-dataflow');
const dataStorageProgram = require('./data/complex-with-data-storage-dataflow');

const numSocket = new rete.Socket("Number value");

describe('Engine', () => {
  var id = 'dataflow@0.1.0';
  var data = { id, nodes: {} };

  function createValidEngine() {
      let eng = new rete.Engine(id);

      eng.events['warn'] = [];
      eng.events['error'] = [];

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

      components.map(c => {
        eng.register(c);
      });

      return eng;
  }

  it('init', async () => {
      assert.doesNotThrow(createValidEngine, Error, 'valid');
      assert.throws(() => new Engine('test@0.1'), Error, 'wrong id');
  });

  describe('instance', async () => {
    let engine;

    beforeEach(() => {
        engine = createValidEngine()
    })

    it('data', async () => {
        assert.equal(await engine.process(data), 'success');
        assert.notEqual(await engine.process({ id: 'test@1.0.0', nodes: {} }), 'success', 'wrong id');
    });

    it('process start node for a single-node diagram', async () => {
      const firstId = Object.keys(singleNodeProgram.nodes)[0];
      assert.equal(await engine.process(singleNodeProgram, firstId), 'success');
    });

    it('process start node for complex diagram', async () => {
      const firstId = Object.keys(complexProgram.nodes)[0];
      assert.equal(await engine.process(complexProgram, firstId), 'success');
    });

    it('process start node for complex diagram with data storage block', async () => {
      const firstId = Object.keys(dataStorageProgram.nodes)[0];
      assert.equal(await engine.process(dataStorageProgram, firstId), 'success');
    });
  });

  describe('returning data', async () => {
    let engine;

    beforeEach(() => {
        engine = createValidEngine()
    })

    it('calculates the math node correctly', async () => {
      await engine.process(dataStorageProgram);
      assert.equal(engine.data.nodes["add-id"].outputData.num, 25.9);
    });
  });

  describe('generator nodes', async () => {
    let engine;
    let clock;

    beforeEach(() => {
      engine = createValidEngine()

      clock = lolex.install({now: 0});      // start global Date clock to 0
    })

    it('calculates the sine node correctly', async () => {
      const period = 10;
      const sineProgram = {
        id:"dataflow@0.1.0",
        nodes: {
          "sine-wave": {
            id: "sine-wave",
            data: {
              generatorType: "sine",
              amplitude: 1,
              period,
              nodeValue: 0.95
            },
            inputs: {},
            outputs: {
              num: {
                connections: []
              }
            },
            name: "Generator"
          }
        }
      };

      await engine.process(sineProgram);
      assert.equal(engine.data.nodes["sine-wave"].outputData.num, 0);

      const newTime = 2000;
      clock.tick(newTime);

      const expectedVal = Math.round(Math.sin(newTime * Math.PI / ((period * 1000) / 2)) * 1 * 100) / 100;
      await engine.process(sineProgram);
      assert.equal(engine.data.nodes["sine-wave"].outputData.num, expectedVal);
    });

    it('calculates the timer node correctly', async () => {
      const timeOn = 10;
      const timeOff = 20;
      const timerProgram = {
        id:"dataflow@0.1.0",
        nodes: {
          "my-timer": {
            id: "my-timer",
            data: {
              timeOn,
              timeOff
            },
            inputs: {},
            outputs: {
              num: {
                connections: []
              }
            },
            name: "Timer"
          }
        }
      };

      await engine.process(timerProgram);
      assert.equal(engine.data.nodes["my-timer"].outputData.num, 1);

      const newTime = 15;
      clock.tick(newTime);

      await engine.process(timerProgram);
      assert.equal(engine.data.nodes["my-timer"].outputData.num, 1);
    });
  });
});
