var assert = require('assert');
var runDataflowProgram = require('../dataflow-engine-runner');

const dataStorageProgramJSON = JSON.stringify(require('./data/complex-with-data-storage-dataflow'));
const relayProgramJSON = JSON.stringify(require('./data/relay'));
const dataSorageProgramDef = JSON.parse(dataStorageProgramJSON);
const relayProgramDef = JSON.parse(relayProgramJSON);

describe('Dataflow Engine Runner', () => {

  it('can take a fully-defined network, run the program, and return data to be saved', async () => {
    const result = await runDataflowProgram(dataSorageProgramDef, {});

    assert(result.success);

    const tempData = result.savedNodeValues.find(n => n.node === "temp-id");
    const mathData = result.savedNodeValues.find(n => n.node === "add-id");
    assert.equal(tempData.value, 23.9);
    assert.equal(mathData.value, 25.9);
  });

  it('can set the value of sensor nodes and run the program', async () => {
    const result = await runDataflowProgram(dataSorageProgramDef, {'7E6FEE58-tempe': 10});

    assert(result.success);

    const tempData = result.savedNodeValues.find(n => n.node === "temp-id");
    const mathData = result.savedNodeValues.find(n => n.node === "add-id");
    assert.equal(tempData.value, 10);
    assert.equal(mathData.value, 12);
  });

  it('can run a program without a data storage block', async () => {
    const result = await runDataflowProgram(relayProgramDef, {'2711-tempe': 10});

    assert(result.success);
    assert.equal(result.savedNodeValues.length, 0);
  });

  it('can run the program and set the value of relays', async () => {
    const result = await runDataflowProgram(relayProgramDef, {'2711-tempe': 10});

    assert(result.success);

    const relayData = result.relayValues.find(n => n.relay === "2713-relay");
    assert.equal(relayData.value, 0);
  });

  it('can run the program and set the value of relays 2', async () => {
    const result = await runDataflowProgram(relayProgramDef, {'2711-tempe': 20});

    assert(result.success);

    const relayData = result.relayValues.find(n => n.relay === "2713-relay");
    assert.equal(relayData.value, 1);
  });
});
