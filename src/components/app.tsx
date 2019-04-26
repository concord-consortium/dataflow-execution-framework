import { inject, observer } from "mobx-react";
import * as React from "react";
import { BaseComponent, IBaseProps } from "./base";
import {
  DataflowDiagram,
  DataflowBlock
} from "../models/dataflow/dataflow-diagram";
import {
  SensorBlockType,
  LogicBlockType,
  IOType
} from "../models/dataflow/dataflow-types";
import "./app.sass";

interface IProps extends IBaseProps {}
interface IState {}

@inject("stores")
@observer
export class AppComponent extends BaseComponent<IProps, IState> {

  public render() {
    const { ui } = this.stores;
    const a = new DataflowBlock("sensor1", "a",
      SensorBlockType.Oxygen, "things", [1], 1, 1, IOType.number, IOType.number, 10);
    const b = new DataflowBlock("sensor2", "b",
      SensorBlockType.Oxygen, "things2", [1], 1, 1, IOType.number, IOType.number, 15);
    const c = new DataflowBlock("operator1", "c",
      LogicBlockType.Operator, "logic",
      [0, 1], 2, 1, IOType.number, IOType.number, "+");
    const d = new DataflowBlock("operator2", "d",
      LogicBlockType.Operator, "logic",
      [0, 1], 2, 1, IOType.number, IOType.number, "*");
    const e = new DataflowBlock("operator3", "e",
      LogicBlockType.Comparator, "logic",
      [0, 1], 2, 1, IOType.number, IOType.number, ">");
    const f = new DataflowBlock("operator4", "f",
      LogicBlockType.LogicOperator, "logic",
      [0, 1], 2, 1, IOType.number, IOType.number, "AND");
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
