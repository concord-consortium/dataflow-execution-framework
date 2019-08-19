var assert = require('assert');
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
});
