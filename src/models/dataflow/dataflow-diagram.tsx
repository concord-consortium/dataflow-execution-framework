import {
  Block,
  Diagram,
  InputBlockType,
  OutputBlockType,
  LogicBlockType,
  IOType,
  Point,
  Params,
  Plot,
  DataStorage,
  DataStorageLocation,
  DataSeries
} from "./dataflow-types";
import { ParseImportedBlock } from "./dataflow-parser";

export class DataflowDiagram implements Diagram {
  public static create(serializedDiagram: string) {
    const d = JSON.parse(serializedDiagram);
    // go through blocks and find type
    const blocks = [];
    let dataStorage = null;
    for (const b of d.blocks) {
      const newBlock = DataflowBlock.create(b);
      if (newBlock.blockType === OutputBlockType.DataStorage) {
        dataStorage = new DataflowStorage(b.name, b.id, b.value as number, DataStorageLocation.firebase, []);
      }
      blocks.push(newBlock);
    }

    return new this(
      d.name ? d.name : "New Diagram",
      d.displayedName ? d.displayedName : d.name ? d.name : "New Diagram",
      blocks,
      d.file_version ? d.file_version : "0.1",
      d.archived,
      dataStorage ? dataStorage : undefined
    );
  }
  constructor(
    public name: string,
    public displayedName: string,
    public blocks: Block[],
    public fileVersion: number,
    public archived: boolean = false,
    public dataStorage?: DataStorage
  ) {
  }

  public getBlocksByType() {
    const blocks: DataflowBlock[] = [];
    const inputs: DataflowBlock[] = [];
    const logic: DataflowBlock[] = [];
    const outputs: DataflowBlock[] = [];
    for (const b of this.blocks) {
      const dfBlock = DataflowBlock.create(b);
      blocks.push(dfBlock);
      if (dfBlock.isInput()) inputs.push(dfBlock);
      if (dfBlock.isOutput()) outputs.push(dfBlock);
      if (dfBlock.isLogic()) logic.push(dfBlock);
    }
    return {
      inputs,
      logic,
      outputs,
      allBlocks: blocks
    };
  }
}

type DataCalc = (a: number, b: number) => number;

export class DataflowBlock implements Block {
  public static create(block: any) {
    if (!block.blockType && block.type) {
      const parsedBlock = ParseImportedBlock(block.type, block.value);
      block.blockType = parsedBlock.blockType;
      block.value = parsedBlock.value;
    }

    return new this(
      block.id,
      block.name,
      block.blockType,
      block.units,
      block.sources,
      block.input_count ? block.input_count : block.inputCount,
      block.output_count ? block.output_count : block.outputCount,
      block.input_type ? block.input_type : block.inputType,
      block.output_type ? block.output_type : block.outputType,
      block.value,
      block.view,
      block.params
    );
  }

  private calc: {[op: string]: DataCalc} = {
    "+": (a: number, b: number): number => a + b,
    "-": (a: number, b: number): number => a - b,
    "*": (a: number, b: number): number => a * b,
    "/": (a: number, b: number): number => a / b,
    ">": (a: number, b: number): number => a > b ? 1 : 0,
    "<": (a: number, b: number): number => a < b ? 1 : 0,
    ">=": (a: number, b: number): number => a >= b ? 1 : 0,
    "<=": (a: number, b: number): number => a <= b ? 1 : 0,
    "=": (a: number, b: number): number => a === b ? 1 : 0,
    "!=": (a: number, b: number): number => a !== b ? 1 : 0,
    "and": (a: number, b: number): number => a && b ? 1 : 0,
    "or": (a: number, b: number): number => a || b ? 1 : 0,
    "not": (a: number, b: number): number => a ? 0 : 1,
    "nand": (a: number, b: number): number => !(a && b) ? 1 : 0,
    "xor": (a: number, b: number): number =>  !(a && b) && (a || b) ? 1 : 0,
    "abs": (a: number, b: number): number =>  Math.abs(a),
  };

  constructor(
    public id: string,
    public name: string,
    public blockType: InputBlockType | OutputBlockType | LogicBlockType,
    public units: string,
    public sources: number[],
    public inputCount: number,
    public outputCount: number,
    public inputType: IOType,
    public outputType: IOType,
    public value: number | string,
    public view: Point = { x: 1, y: 1 },
    public params?: Params
  ) {
  }

  public isInput() {
    return InputBlockType[this.blockType] !== undefined;
  }
  public isOutput() {
    return OutputBlockType[this.blockType] !== undefined;
  }
  public isLogic() {
    return LogicBlockType[this.blockType] !== undefined;
  }

  public currentValue(diagram: DataflowDiagram, output?: any) {
    let val = this.value && typeof(this.value) === "number" ? this.value : 0;

    // A sensor is an input block
    if (this.isInput()) {
      if (this.inputCount > 0) {
        // take inputs
        val += this.inputCount;
      }
      return val;
    }

    // A logic block operates on inputs and produces a value
    else if (this.isLogic()) {
      if (this.inputCount > 0 && diagram) {
        const values: number[] = [];
        for (let i = 0; i < this.inputCount; i++) {
          const block = diagram.blocks.find( b => parseInt(b.id, 10) === this.sources[i] );
          const inputValue = block && block.value;
          // since a value could be a number, string or null, verify we have values
          if (inputValue && typeof (inputValue) === "number") {
            values.push(inputValue);
          }
        }
        const operator = this.value ? this.value : "+";
        // TODO: allow calc to take more than the first two values
        if (this.calc[operator]) {
          val = this.calc[operator](values[0], values[1]);
        } else {
          val = NaN;
        }
        return val;
      } else return 0;
    }
    // An output controls a relay, or records to data storage or plot
    else if (this.isOutput()) {
      switch (this.blockType) {
        case OutputBlockType.Relay:
          // a relay signal is sent based on the input value (evaluated via logic)
          return val;
        case OutputBlockType.Plot:
          (output as DataflowPlot).addPoint({ x: Date.now(), y: val });
          return;
        case OutputBlockType.DataStorage:
          // serialize data?
          return val;
      }
    }
    return val;
  }
}

export class DataflowStorage implements DataStorage {
  constructor(
    public name: string,
    public id: string,
    public interval: number,
    public location: DataStorageLocation,
    public data: DataSeries[]
  ) {
  }
  public addDataSeries(dataType: number, dataSource: number) {
    const newSeries: DataSeries = {
      dataType,
      dataSource,
      values: []
    };
    this.data.push(newSeries);
  }
}

export class DataflowPlot implements Plot{
  constructor(
    public series: number,
    public points: Point[]) {
    this.points = [];
  }
  public addPoint(nextPoint: Point) {
    this.points.push(nextPoint);
  }
  public getPlot() {
    return this.points;
  }
}
