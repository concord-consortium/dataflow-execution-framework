import * as abs from "./absolute value of number.json";
import * as addTwo from "./add two numbers.json";
import * as divideTwo from "./divide two numbers.json";
import * as logicComparisons from "./logical comparisons.json";
import * as logicOps from "./logical operations.json";
import * as averages from "./average blocks.json";
import * as virtualInputs from "./virtual input blocks.json";
import * as multiplyTwo from "./multiply two numbers.json";
import * as notValue from "./not value of number.json";
import * as outputBlocks from "./output blocks.json";
import * as sensors from "./sensor blocks.json";
import * as subtractTwo from "./subtract two numbers.json";

export interface Sample {
  name: string;
  data: string;
}

export const getSamples = ((): Sample[] => {
  const s = [];
  s.push({ name: "absolute value of a number", data: JSON.stringify(abs) });
  s.push({ name: "add two numbers", data: JSON.stringify(addTwo) });
  s.push({ name: "divide two numbers", data: JSON.stringify(divideTwo) });
  s.push({ name: "logical comparisons", data: JSON.stringify(logicComparisons) });
  s.push({ name: "logical operations", data: JSON.stringify(logicOps) });
  s.push({ name: "average blocks", data: JSON.stringify(averages) });
  s.push({ name: "virtual input blocks", data: JSON.stringify(virtualInputs) });
  s.push({ name: "multiply two numbers", data: JSON.stringify(multiplyTwo) });
  s.push({ name: "not value of number", data: JSON.stringify(notValue) });
  s.push({ name: "output blocks", data: JSON.stringify(outputBlocks) });
  s.push({ name: "sensors", data: JSON.stringify(sensors) });
  s.push({ name: "subtract two numbers", data: JSON.stringify(subtractTwo) });
  return s;
});
