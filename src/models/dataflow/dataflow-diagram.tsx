// following style guide https://basarat.gitbooks.io/typescript/docs/styleguide/styleguide.html

interface Diagram {
  name: string;
  displayedName: string;
  blocks: Block[];
  fileVersion: number;
  archived: boolean;
}

interface Block {
  id: string;
  name: string;
  blockType: SensorBlockType | OutputBlockType | LogicBlockType;
  units: string;
  sources: number[];
  inputCount: number;
  outputCount: number;
  inputType: IOType;
  outputType: IOType;
  value: number | string;
  view: Point;
  params?: Params;
}

export enum SensorBlockType { // rename to InputBlockType?
  Temperature = 0,
  Humidity,
  CarbonDioxide,
  Oxygen,
  Light,
  SoilMoisture,
  ParticulateMatter
}

export enum OutputBlockType {
  Relay = 7,
  Plot,
  DataStorage
}

// deviating from spec, Plus, Minus, Times, Divide become Operator
// GT, LT, ET, NET become Comparator
// And, Or, Not, Nand, Xor become LogicOperator
export enum LogicBlockType {
  Number = 10,
  Timer,
  Operator,
  Comparator,
  LogicOperator
}
export enum IOType { bool, number, image } // bool, number, image

interface Params {
  recordingInterval: number;
  datasetLocation: string; // not sure what this is?
  sequenceNames: string; // or is this an array?
  secondsOn: number;
  secondsOff: number;
  period: number;
}

interface Point { // display data for positioning in diagram or on a plot
  x: number;
  y: number;
}

export class DataflowDiagram implements Diagram {
  constructor(
    public name: string,
    public displayedName: string,
    public blocks: Block[],
    public fileVersion: number,
    public archived: boolean = false
  ) {
  }
}

type DataCalc = (a: number, b: number) => number;

export class DataflowBlock implements Block {
  private calc: {[op: string]: DataCalc} = {
    "+": (a: number, b: number): number => a + b,
    "-": (a: number, b: number): number => a - b,
    "*": (a: number, b: number): number => a * b,
    "/": (a: number, b: number): number => a / b,
    ">": (a: number, b: number): number => a > b ? 1 : 0,
    "<": (a: number, b: number): number => a < b ? 1 : 0,
    ">=": (a: number, b: number): number => a >= b ? 1 : 0,
    "<=": (a: number, b: number): number => a <= b ? 1 : 0,
    "AND": (a: number, b: number): number => a && b ? 1 : 0,
    "OR": (a: number, b: number): number => a || b ? 1 : 0,
    "NOT": (a: number, b: number): number => a ? 0 : 1,
    "NAND": (a: number, b: number): number => !(a && b) ? 1 : 0,
    "XOR": (a: number, b: number): number =>  !(a && b) && (a || b) ? 1 : 0,
  };

  constructor(
    public id: string,
    public name: string,
    public blockType: SensorBlockType | OutputBlockType | LogicBlockType,
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

  public isSensor() {
    return SensorBlockType[this.blockType] !== undefined;
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
    if (this.isSensor()) {
      if (this.inputCount > 0) {
        // take inputs
        val += this.inputCount;
      }
      return val;
    }

    // A logic block operates on inputs and produces a value
    else if (this.isLogic()) {
      if (this.inputCount > 1 && diagram) {
        const values: number[] = [];
        for (let i = 0; i < this.inputCount; i++) {
          const inputValue = diagram.blocks[this.sources[i]].value;
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
interface Plot {
  series: number;
  points: Point[];
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
