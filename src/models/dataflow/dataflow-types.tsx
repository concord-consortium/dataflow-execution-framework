
export interface Diagram {
  name: string;
  displayedName: string;
  blocks: Block[];
  fileVersion: number;
  archived: boolean;
}

export interface Block {
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
  Relay = 100,
  Plot,
  DataStorage
}

// deviating from spec, Plus, Minus, Times, Divide become Operator
// GT, LT, ET, NET become Comparator
// And, Or, Not, Nand, Xor become LogicOperator
export enum LogicBlockType {
  Number = 200,
  Timer,
  Operator,
  Comparator,
  LogicOperator
}
export enum IOType { bool, number, image } // bool, number, image

export interface Params {
  recordingInterval: number;
  datasetLocation: string; // not sure what this is?
  sequenceNames: string; // or is this an array?
  secondsOn: number;
  secondsOff: number;
  period: number;
}

export interface Point { // display data for positioning in diagram or on a plot
  x: number;
  y: number;
}

export interface Plot {
  series: number;
  points: Point[];
}
