import { InputBlockType, LogicBlockType, OutputBlockType } from "./dataflow-types";

// convert from 2.0 format
export const ParseImportedBlock = (importedType: string, importedValue: string) => {
  let blockType = -1;
  let blockValue = importedValue;

  switch (importedType) {
    case "temperature":
      blockType = InputBlockType.Temperature;
      break;
    case "humidity":
      blockType = InputBlockType.Humidity;
      break;
    case "CO2":
      blockType = InputBlockType.CarbonDioxide;
      break;
    case "O2":
      blockType = InputBlockType.Oxygen;
      break;
    case "light":
      blockType = InputBlockType.Light;
      break;
    case "soilmoisture":
      blockType = InputBlockType.SoilMoisture;
      break;
    case "number":
      blockType = InputBlockType.Number;
      break;
    case "number_entry":
      blockType = InputBlockType.Number;
      break;
    case "timer":
      blockType = LogicBlockType.Timer;
      break;
    case "relay":
      blockType = OutputBlockType.Relay;
      break;
    case "plus":
      blockType = LogicBlockType.Operator;
      blockValue = "+";
      break;
    case "minus":
      blockType = LogicBlockType.Operator;
      blockValue = "-";
      break;
    case "times":
      blockType = LogicBlockType.Operator;
      blockValue = "*";
      break;
    case "multiply":
      blockType = LogicBlockType.Operator;
      blockValue = "*";
      break;
    case "divided by":
      blockType = LogicBlockType.Operator;
      blockValue = "/";
      break;
    case "greater than":
      blockType = LogicBlockType.Comparator;
      blockValue = ">";
      break;
    case "less than":
      blockType = LogicBlockType.Comparator;
      blockValue = "<";
      break;
    case "equals":
      blockType = LogicBlockType.Comparator;
      blockValue = "=";
      break;
    case "not equals":
      blockType = LogicBlockType.Comparator;
      blockValue = "!=";
      break;
    case "data storage":
      blockType = OutputBlockType.DataStorage;
      break;
    case "absolute value":
      blockType = LogicBlockType.Comparator;
      blockValue = "abs";
      break;
    case "not":
      blockType = LogicBlockType.Comparator;
      blockValue = "not";
      break;
    default:
      if (!!InputBlockType[importedType as any]) {
        blockType = InputBlockType[importedType as keyof typeof InputBlockType];
      } else if (!!LogicBlockType[importedType as any]) {
        blockType = LogicBlockType[importedType as keyof typeof LogicBlockType];
      } else if (!!OutputBlockType[importedType as any]) {
        blockType = OutputBlockType[importedType as keyof typeof OutputBlockType];
      } else {
        blockType = LogicBlockType.Operator;
        blockValue = importedValue;
      }
      break;
  }
  return { blockType, value: blockValue };
};
