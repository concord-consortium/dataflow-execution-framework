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
import { sample } from "../data/sample";
import "./app.sass";

interface IProps extends IBaseProps {}
interface IState {
  currentParsedData: DataflowDiagram;
}

@inject("stores")
@observer
export class AppComponent extends BaseComponent<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      currentParsedData: DataflowDiagram.parseDiagram(sample)
    };
  }
  public render() {
    const { currentParsedData } = this.state;
    // test data
    const a2 = DataflowBlock.create(currentParsedData.blocks[0]);
    const b2 = DataflowBlock.create(currentParsedData.blocks[1]);
    const c2 = DataflowBlock.create(currentParsedData.blocks[2]);
    const d2 = DataflowBlock.create(currentParsedData.blocks[3]);
    const e2 = DataflowBlock.create(currentParsedData.blocks[4]);
    const f2 = DataflowBlock.create(currentParsedData.blocks[5]);

    return (
      <div className="app">
        <div>
          <div>Enter Dataflow2 JSON string:</div>
          <div><textarea defaultValue={JSON.stringify(currentParsedData)} id="sourceData" cols={120} rows={20} /></div>
          <div><input type="submit" value="submit" onClick={this.updateDiagram} /></div>
        </div>
        <hr />
        <div><span className="infoLabel">Parsed Blocks: </span>A = {a2.value}, B = {b2.value}</div>
        <div><span className="infoLabel">Sum A + B: </span>{c2.currentValue(currentParsedData)}</div>
        <div><span className="infoLabel">Multiply A * B: </span>{d2.currentValue(currentParsedData)}</div>
        <div><span className="infoLabel">Compare A > B: </span>{e2.currentValue(currentParsedData)}</div>
        <div><span className="infoLabel">Logic A AND B: </span>{f2.currentValue(currentParsedData)}</div>
      </div>
    );
  }
  private updateDiagram = () => {
    const d = document.getElementById("sourceData") as HTMLInputElement;
    this.setState({ currentParsedData: DataflowDiagram.parseDiagram(d.value) });
  }
}
