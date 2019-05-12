import { DataflowBlock, DataflowDiagram } from "./dataflow-diagram";
import { IOType, LogicBlockType } from "./dataflow-types";

describe("Dataflow Block", () => {
  // tslint:disable-next-line:max-line-length
  const sample = '{"name":"test","displayedName":"test","blocks":[{"id":"sensor1","name":"a","blockType":3,"units":"things","sources":[1],"inputCount":1,"outputCount":1,"inputType":1,"outputType":1,"value":21,"view":{"x":1,"y":1},"calc":{}},{"id":"sensor2","name":"b","blockType":3,"units":"things2","sources":[1],"inputCount":1,"outputCount":1,"inputType":1,"outputType":1,"value":6,"view":{"x":1,"y":1},"calc":{}},{"id":"operator1","name":"c","blockType":200,"units":"logic","sources":[0,1],"inputCount":2,"outputCount":1,"inputType":1,"outputType":1,"value":"+","view":{"x":1,"y":1},"calc":{}},{"id":"operator2","name":"d","blockType":200,"units":"logic","sources":[0,1],"inputCount":2,"outputCount":1,"inputType":1,"outputType":1,"value":"*","view":{"x":1,"y":1},"calc":{}},{"id":"operator3","name":"e","blockType":201,"units":"logic","sources":[0,1],"inputCount":2,"outputCount":1,"inputType":1,"outputType":1,"value":">","view":{"x":1,"y":1},"calc":{}},{"id":"operator4","name":"f","blockType":202,"units":"logic","sources":[0,1],"inputCount":2,"outputCount":1,"inputType":1,"outputType":1,"value":"and","view":{"x":1,"y":1},"calc":{}}],"fileVersion":1,"archived":false}';
  const diagram = DataflowDiagram.create(sample);

  it("creates a diagram", () => {
    expect(diagram.name.length).toBeGreaterThan(0);
    expect(diagram.displayedName.length).toBeGreaterThan(0);
    expect(diagram.blocks.length).toBeGreaterThan(0);
    expect(diagram.blocks.length).toBe(6);
  });

  it("has two inputs", () => {
    expect(diagram.getBlocksByType().inputs.length).toBe(2);

    const blockA = diagram.blocks[0] as DataflowBlock;
    const blockB = diagram.blocks[1] as DataflowBlock;

    expect(blockA.isInput()).toBe(true);
    expect(blockB.isInput()).toBe(true);
    expect(diagram.blocks.length).toBe(6);
  });

  it("has four logic blocks", () => {
    expect(diagram.getBlocksByType().logic.length).toBe(4);

    const blockC = diagram.blocks[2] as DataflowBlock;
    const blockD = diagram.blocks[3] as DataflowBlock;
    const blockE = diagram.blocks[4] as DataflowBlock;
    const blockF = diagram.blocks[5] as DataflowBlock;

    // Not sensors
    expect(blockC.isInput()).toBe(false);
    expect(blockD.isInput()).toBe(false);
    expect(blockE.isInput()).toBe(false);
    expect(blockF.isInput()).toBe(false);

    expect(blockC.isLogic()).toBe(true);
    expect(blockD.isLogic()).toBe(true);
    expect(blockE.isLogic()).toBe(true);
    expect(blockF.isLogic()).toBe(true);

    expect(blockC.blockType).toEqual(LogicBlockType.Operator);
    expect(blockD.blockType).toEqual(LogicBlockType.Operator);
    expect(blockE.blockType).toEqual(LogicBlockType.Comparator);
    expect(blockF.blockType).toEqual(LogicBlockType.LogicOperator);
  });

  it("has connected logic blocks", () => {
    const blockC = diagram.blocks[2] as DataflowBlock;
    const blockD = diagram.blocks[3] as DataflowBlock;
    const blockE = diagram.blocks[4] as DataflowBlock;
    const blockF = diagram.blocks[5] as DataflowBlock;

    expect(blockC.sources.length).toBe(2);
    expect(blockD.sources.length).toBe(2);
    expect(blockE.sources.length).toBe(2);
    expect(blockF.sources.length).toBe(2);

    const sourceA = diagram.blocks[blockC.sources[0]] as DataflowBlock;
    expect(sourceA.isInput()).toBe(true);
  });
});

describe("Dataflow diagram that controls a relay", () => {

  // tslint:disable-next-line:max-line-length
  const sample2 = '{ "file_version": "0.1", "blocks": [ { "id": 1, "name": "temperature", "type": "temperature", "units": "degrees C", "sources": [], "input_count": 0, "output_count": 1, "input_type": null, "output_type": "n", "has_seq": true, "params": [], "value": null, "view": { "x": 35, "y": 35 } }, { "id": 2, "name": "number", "type": "number_entry", "sources": [], "input_count": 0, "output_count": 1, "input_type": "n", "output_type": "n", "has_seq": false, "params": [], "value": 25, "view": { "x": 37, "y": 136 } }, { "id": 3, "name": "greater than", "type": "greater than", "sources": [ 1, 2 ], "input_count": 2, "output_count": 1, "input_type": "n", "output_type": "n", "has_seq": false, "params": [], "value": null, "view": { "x": 322, "y": 91 } }, { "id": 4, "name": "relay", "type": "relay", "sources": [ 3 ], "input_count": 1, "output_count": 0, "input_type": "n", "output_type": null, "has_seq": false, "params": [], "value": null, "view": { "x": 595, "y": 93 } } ], "archived": false, "displayedName": "relay", "name": "program_20190422_153940" }';

  const diagram2 = DataflowDiagram.create(sample2);

  it("creates a diagram", () => {
    expect(diagram2.name.length).toBeGreaterThan(0);
    expect(diagram2.displayedName.length).toBeGreaterThan(0);
    expect(diagram2.blocks.length).toBeGreaterThan(0);
    expect(diagram2.blocks.length).toBe(4);
  });

  it("has two inputs", () => {
    expect(diagram2.getBlocksByType().inputs.length).toBe(2);
  });

  it("has a comparator", () => {
    expect(diagram2.getBlocksByType().logic.length).toBe(1);
    expect(diagram2.getBlocksByType().logic[0].blockType).toEqual(LogicBlockType.Comparator);
  });
});
