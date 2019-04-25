import { inject, observer } from "mobx-react";
import * as React from "react";
import { BaseComponent, IBaseProps } from "./base";
import { Text } from "./text";
import {
  DataflowDiagram,
  DataflowBlock,
  SensorBlockType,
  IOType,
  LogicBlockType
} from "../models/dataflow/dataflow-diagram";
import "./app.sass";

interface IProps extends IBaseProps {}
interface IState {}

@inject("stores")
@observer
export class AppComponent extends BaseComponent<IProps, IState> {

  public render() {
    const { ui } = this.stores;
    const a = new DataflowBlock("sensor1", "a",
      SensorBlockType.Oxygen, "things", [1], 1, 1, IOType.number, IOType.number, { x: 1, y: 1 }, undefined, 10);
    const b = new DataflowBlock("sensor2", "b",
      SensorBlockType.Oxygen, "things2", [1], 1, 1, IOType.number, IOType.number, { x: 2, y: 2 }, undefined, 15);
    const c = new DataflowBlock("operator1", "c",
      LogicBlockType.Operator, "logic",
      [0, 1], 2, 1, IOType.number, IOType.number, { x: 3, y: 3 }, undefined, "+");
    const d = new DataflowBlock("operator2", "d",
      LogicBlockType.Operator, "logic",
      [0, 1], 2, 1, IOType.number, IOType.number, { x: 4, y: 4 }, undefined, "*");
    const e = new DataflowBlock("operator3", "e",
      LogicBlockType.Comparator, "logic",
      [0, 1], 2, 1, IOType.number, IOType.number, { x: 5, y: 5 }, undefined, ">");
    const f = new DataflowBlock("operator4", "f",
      LogicBlockType.LogicOperator, "logic",
      [0, 1], 2, 1, IOType.number, IOType.number, { x: 6, y: 6 }, undefined, "AND");

    const diagram = new DataflowDiagram("test", "test", [a, b, c, d, e, f], 1);
    return (
      <div className="app">
        <div><span className="infoLabel">Blocks: </span>A = {a.value}, B = {b.value}</div>
        <div><span className="infoLabel">Sum A + B: </span>{c.currentValue(diagram)}</div>
        <div><span className="infoLabel">Multiply A * B: </span>{d.currentValue(diagram)}</div>
        <div><span className="infoLabel">Compare A > B: </span>{e.currentValue(diagram)}</div>
        <div><span className="infoLabel">Logic A AND B: </span>{f.currentValue(diagram)}</div>
      </div>
    );
  }
}
