var assert = require('assert');
var polyfill = require('@babel/polyfill');
var rete = require('rete');
var addNumbers = require('./data/add-numbers');

const socketNum = new rete.Socket('Number');

class Comp1 extends rete.Component {

    constructor() {
        super('Number');
    }

    async builder(node) {
        node.addOutput(new Output('num', 'Name', socketNum))
    }

    worker() { }
}

class Comp2 extends rete.Component {

    constructor() {
        super('Add');
    }

    async builder(node) {
        node.addInput(new Input('num1', 'Name', socketNum));
        node.addInput(new Input('num2', 'Name', socketNum));
        node.addOutput(new Output('num', 'Name', socketNum))
    }

    worker() { }
}

describe('Engine', () => {
  var id = 'test@0.0.1';
  var data = { id, nodes: {} };

  function createValidEngine() {
      let eng = new rete.Engine(id);

      eng.events['warn'] = [];
      eng.events['error'] = [];
      eng.register(new Comp1());
      eng.register(new Comp2());
      return eng;
  }

  it('init', async () => {
      assert.doesNotThrow(createValidEngine, Error, 'valid')
      // assert.throws(() => {
      //     let eng = createValidEngine();

      //     eng.register({})
      // }, Error, 'object instead of component');
      assert.throws(() => new Engine('test@0.1'), Error, 'wrong id')
  });

  describe('instance', async () => {
    let engine;

    beforeEach(() => {
        engine = createValidEngine()
    })

    it('data', async () => {
        assert.equal(await engine.process(data), 'success')
        assert.notEqual(await engine.process({ id: 'test@1.0.0', nodes: {} }), 'success', 'wrong id')
    });

    it('clone', () => {
        const engineClone = engine.clone();

        assert.equal(engineClone instanceof rete.Engine, true, 'is instance')
        assert.equal(engineClone.id, engine.id, 'id')
        assert.deepEqual(engineClone.components, engine.components, 'components')
    })

    it('abort', (done) => {
        engine.process(data).then(v => {
            assert.equal(v, 'aborted', 'Check aborted process')
        }).catch(done)
        engine.abort();

        engine.process(data).then(v => {
            assert.equal(Boolean(v), false, 'Not aborted completely')
        }).then(done)
    })

    describe('process without abort', () => {
        let cw = console.warn;
        beforeEach(() => console.warn = () => {})
        afterEach(() => console.warn = cw)

        it('process warn', (done) => {
            engine.process(data)
            engine.process(data).then(r => {
                assert.equal(Boolean(r), false, 'cannot process simultaneously')
            }).then(done).catch(done)
        })
    });

    it('process start node', async () => {
        const correctId = Object.keys(addNumbers.nodes)[0];
        const wrongId = Number.POSITIVE_INFINITY;

        assert.equal(await engine.process(addNumbers, correctId), 'success');
    });
});
});
