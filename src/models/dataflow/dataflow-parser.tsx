import { SensorBlockType, LogicBlockType, OutputBlockType } from "./dataflow-types";

// convert from 2.0 format
export const ParseImportedBlock = (importedType: string, importedValue: string) => {
  let blockType = -1;
  let blockValue = importedValue;

  switch (importedType) {
    case "temperature":
      blockType = SensorBlockType.Temperature;
      break;
    case "humidity":
      blockType = SensorBlockType.Humidity;
      break;
    case "CO2":
      blockType = SensorBlockType.CarbonDioxide;
      break;
    case "O2":
      blockType = SensorBlockType.Oxygen;
      break;
    case "light":
      blockType = SensorBlockType.Light;
      break;
    case "soilmoisture":
      blockType = SensorBlockType.SoilMoisture;
      break;
    case "number":
      blockType = LogicBlockType.Number;
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
    default:
      if (!!SensorBlockType[importedType as any]) {
        blockType = SensorBlockType[importedType as keyof typeof SensorBlockType];
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
