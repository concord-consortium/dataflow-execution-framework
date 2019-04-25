import { DataflowBlock, IOType, SensorBlockType, LogicBlockType, DataflowDiagram } from "./dataflow-diagram";

describe("Dataflow Block", () => {
  const a = new DataflowBlock("sensor1", "a",
    SensorBlockType.Oxygen, "things", [1], 1, 1, IOType.number, IOType.number, 10);
  const b = new DataflowBlock("sensor2", "b",
    SensorBlockType.Oxygen, "things2", [1], 1, 1, IOType.number, IOType.number, 15);
  const c = new DataflowBlock("operator1", "c",
    LogicBlockType.Operator, "logic",
    [0, 1], 2, 1, IOType.number, IOType.number, "+");
  const diagram = new DataflowDiagram("test", "test", [a, b, c], 1);

  it("has two inputs", () => {
    expect(a.isSensor()).toBe(true);
    expect(b.isSensor()).toBe(true);
    expect(c.isSensor()).toBe(false);
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
    c.value = "AND";
    expect(c.currentValue(diagram)).toBe(1);
    c.value = "OR";
    expect(c.currentValue(diagram)).toBe(1);
    c.value = "NOT";
    expect(c.currentValue(diagram)).toBe(0);
    c.value = "NAND";
    expect(c.currentValue(diagram)).toBe(0);
  });

  it("can handle more advanced logic operations", () => {
    c.blockType = LogicBlockType.LogicOperator;
    c.value = "XOR";
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
