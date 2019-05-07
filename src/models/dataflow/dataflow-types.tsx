import { number, string } from "mobx-state-tree/dist/internal";

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
  blockType: InputBlockType | OutputBlockType | LogicBlockType;
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

export enum InputBlockType {
  Temperature = 0,
  Humidity = 1,
  CarbonDioxide = 2,
  Oxygen = 3,
  Light = 4,
  SoilMoisture = 5,
  ParticulateMatter = 6,
  Number = 7,
}

export enum OutputBlockType {
  Relay = 100,
  Plot = 101,
  DataStorage = 102
}

// deviating from spec, Plus, Minus, Times, Divide become Operator
// GT, LT, ET, NET become Comparator
// And, Or, Not, Nand, Xor become LogicOperator
export enum LogicBlockType {
  Timer = 200,
  Operator = 201,
  Comparator = 202,
  LogicOperator = 203
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
