var assert = require('assert');
var runDataflowProgram = require('../dataflow-engine-runner');

const dataStorageProgramJSON = JSON.stringify(require('./data/complex-with-data-storage-dataflow'));
const programDef = JSON.parse(dataStorageProgramJSON);

describe('Dataflow Engine Runner', () => {

  it('can take a fully-defined network, run the program, and return data to be saved', async () => {
    const result = await runDataflowProgram(programDef, {});

    assert(result.success);

    const tempData = result.savedNodeValues.find(n => n.node === "temp-id");
    const mathData = result.savedNodeValues.find(n => n.node === "add-id");
    assert.equal(tempData.value, 23.9);
    assert.equal(mathData.value, 25.9);
  });

  it('can set the value of sensor nodes and run the program', async () => {
    const result = await runDataflowProgram(programDef, {'7E6FEE58-tempe': 10});

    assert(result.success);

    const tempData = result.savedNodeValues.find(n => n.node === "temp-id");
    const mathData = result.savedNodeValues.find(n => n.node === "add-id");
    assert.equal(tempData.value, 10);
    assert.equal(mathData.value, 12);
  });
});
