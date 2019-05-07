import { DataflowBlock, DataflowDiagram } from "./dataflow-diagram";

describe("Dataflow Block", () => {
  // tslint:disable-next-line:max-line-length
  const sample = '{"name":"test","displayedName":"test","blocks":[{"id":"sensor1","name":"a","blockType":3,"units":"things","sources":[1],"inputCount":1,"outputCount":1,"inputType":1,"outputType":1,"value":21,"view":{"x":1,"y":1},"calc":{}},{"id":"sensor2","name":"b","blockType":3,"units":"things2","sources":[1],"inputCount":1,"outputCount":1,"inputType":1,"outputType":1,"value":6,"view":{"x":1,"y":1},"calc":{}},{"id":"operator1","name":"c","blockType":202,"units":"logic","sources":[0,1],"inputCount":2,"outputCount":1,"inputType":1,"outputType":1,"value":"+","view":{"x":1,"y":1},"calc":{}},{"id":"operator2","name":"d","blockType":202,"units":"logic","sources":[0,1],"inputCount":2,"outputCount":1,"inputType":1,"outputType":1,"value":"*","view":{"x":1,"y":1},"calc":{}},{"id":"operator3","name":"e","blockType":203,"units":"logic","sources":[0,1],"inputCount":2,"outputCount":1,"inputType":1,"outputType":1,"value":">","view":{"x":1,"y":1},"calc":{}},{"id":"operator4","name":"f","blockType":204,"units":"logic","sources":[0,1],"inputCount":2,"outputCount":1,"inputType":1,"outputType":1,"value":"and","view":{"x":1,"y":1},"calc":{}}],"fileVersion":1,"archived":false}';
  const diagram = DataflowDiagram.create(sample);

  it("creates a diagram", () => {
    expect(diagram.name.length).toBeGreaterThan(0);
    expect(diagram.displayedName.length).toBeGreaterThan(0);
    expect(diagram.blocks.length).toBeGreaterThan(0);
    expect(diagram.blocks.length).toBe(6);
  });

  it("has two inputs", () => {
    expect(diagram.getBlocksByType().sensors.length).toBe(2);

    const blockA = diagram.blocks[0] as DataflowBlock;
    const blockB = diagram.blocks[1] as DataflowBlock;

    expect(blockA.isSensor()).toBe(true);
    expect(blockB.isSensor()).toBe(true);
    expect(diagram.blocks.length).toBe(6);
  });

  it("has four logic blocks", () => {
    expect(diagram.getBlocksByType().logic.length).toBe(4);

    const blockC = diagram.blocks[2] as DataflowBlock;
    const blockD = diagram.blocks[3] as DataflowBlock;
    const blockE = diagram.blocks[4] as DataflowBlock;
    const blockF = diagram.blocks[5] as DataflowBlock;

    // Not sensors
    expect(blockC.isSensor()).toBe(false);
    expect(blockD.isSensor()).toBe(false);
    expect(blockE.isSensor()).toBe(false);
    expect(blockF.isSensor()).toBe(false);

    expect(blockC.isLogic()).toBe(true);
    expect(blockD.isLogic()).toBe(true);
    expect(blockE.isLogic()).toBe(true);
    expect(blockF.isLogic()).toBe(true);
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
    expect(sourceA.isSensor()).toBe(true);

  });
});
