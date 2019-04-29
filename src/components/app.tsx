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
  currentDiagram: DataflowDiagram;
}

@inject("stores")
@observer
export class AppComponent extends BaseComponent<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      currentDiagram: DataflowDiagram.parseDiagram(sample)
    };
  }
  public render() {
    const { currentDiagram } = this.state;
    // test data
    const blocks: DataflowBlock[] = [];
    const inputs: DataflowBlock[] = [];
    const logic: DataflowBlock[] = [];
    const outputs: DataflowBlock[] = [];
    for (const b of currentDiagram.blocks) {
      const dfBlock = DataflowBlock.create(b);
      blocks.push(dfBlock);
      if (dfBlock.isSensor()) inputs.push(dfBlock);
      if (dfBlock.isOutput()) outputs.push(dfBlock);
      if (dfBlock.isLogic()) logic.push(dfBlock);
    }

    return (
      <div className="app">
        <div>
          <div>Enter Dataflow2 JSON string:</div>
          <div><textarea defaultValue={JSON.stringify(currentDiagram)} id="sourceData" cols={120} rows={20} /></div>
          <div><input type="submit" value="submit" onClick={this.updateDiagram} /></div>
        </div>
        <hr />
        <div><span className="infoLabel">Parsed Blocks: </span>A = {inputs[0].value}, B = {inputs[1].value}</div>
        <div><span className="infoLabel">Sum A + B: </span>{logic[0].currentValue(currentDiagram)}</div>
        <div><span className="infoLabel">Multiply A * B: </span>{logic[1].currentValue(currentDiagram)}</div>
        <div><span className="infoLabel">Compare A > B: </span>{logic[2].currentValue(currentDiagram)}</div>
        <div><span className="infoLabel">Logic A AND B: </span>{logic[3].currentValue(currentDiagram)}</div>
      </div>
    );
  }
  private updateDiagram = () => {
    const d = document.getElementById("sourceData") as HTMLInputElement;
    this.setState({ currentDiagram: DataflowDiagram.parseDiagram(d.value) });
  }
}
