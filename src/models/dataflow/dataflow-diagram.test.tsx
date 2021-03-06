import { DataflowBlock, DataflowDiagram } from "./dataflow-diagram";
import {
  InputBlockType,
  LogicBlockType,
  IOType
} from "./dataflow-types";

describe("Dataflow Block", () => {
  const a = new DataflowBlock("0", "sensor1",
    InputBlockType.Oxygen, "things", [1], 1, 1, IOType.number, IOType.number, 10);
  const b = new DataflowBlock("1", "sensor2",
    InputBlockType.Oxygen, "things2", [1], 1, 1, IOType.number, IOType.number, 15);
  const c = new DataflowBlock("2", "operator1",
    LogicBlockType.Operator, "logic",
    [0, 1], 2, 1, IOType.number, IOType.number, "+");
  const diagram = new DataflowDiagram("test", "test", [a, b, c], 1);

  it("has two inputs", () => {
    expect(a.isInput()).toBe(true);
    expect(b.isInput()).toBe(true);
    expect(c.isInput()).toBe(false);
  });

  it("has one operator", () => {
    expect(a.isLogic()).toBe(false);
    expect(b.isLogic()).toBe(false);
    expect(c.isLogic()).toBe(true);
  });

  it("has values for each input", () => {
    expect(a.value).toBe(10);
    expect(b.value).toBe(15);
  });

  it("can calculate a value", () => {
    expect(c.currentValue(diagram)).toBe(25);
  });

  it("can perform different operations", () => {
    c.blockType = LogicBlockType.Operator;
    c.value = "-";
    expect(c.currentValue(diagram)).toBe(-5);
    c.value = "*";
    expect(c.currentValue(diagram)).toBe(150);
    c.value = "/";
    expect(c.currentValue(diagram)).toBeLessThan(1);
  });

  it("can perform comparator operations", () => {
    c.blockType = LogicBlockType.Comparator;
    c.value = ">";
    expect(c.currentValue(diagram)).toBe(0);
    c.value = "<";
    expect(c.currentValue(diagram)).toBe(1);
    c.value = ">=";
    expect(c.currentValue(diagram)).toBe(0);
    c.value = "<=";
    expect(c.currentValue(diagram)).toBe(1);
  });

  it("can perform logic operations", () => {
    c.blockType = LogicBlockType.LogicOperator;
    c.value = "and";
    expect(c.currentValue(diagram)).toBe(1);
    c.value = "or";
    expect(c.currentValue(diagram)).toBe(1);
    c.value = "not";
    expect(c.currentValue(diagram)).toBe(0);
    c.value = "nand";
    expect(c.currentValue(diagram)).toBe(0);
  });

  it("can handle more advanced logic operations", () => {
    c.blockType = LogicBlockType.LogicOperator;
    c.value = "xor";
    expect(c.currentValue(diagram)).toBe(0);
    a.value = 0;
    expect(c.currentValue(diagram)).toBe(1);
    a.value = 10;
    b.value = 0;
    expect(c.currentValue(diagram)).toBe(1);
    a.value = 0;
    b.value = 0;
    expect(c.currentValue(diagram)).toBe(0);
  });

  it("can handle invalid values passed as an operator", () => {
    a.value = 10;
    b.value = 15;
    c.value = "rabbit";
    expect(c.currentValue(diagram)).toBe(NaN);
  });
});
