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
    // Show what we parsed
    const renderInputs = () => {
      const inputBlocks = [];
      for (const b of inputs) {
        inputBlocks.push(<span key={b.id}>{b.name}:{b.value ? b.value : 0}&nbsp;</span>);
      }
      return <div>Inputs: {inputBlocks}</div>;
    };
    const renderLogicBlocks = () => {
      const logicBlocks = [];
      for (const b of logic) {
        logicBlocks.push(<span key={b.id}>{b.name}:{b.value}&nbsp;</span>);
      }
      return <div>Logic blocks: {logicBlocks}</div>;
    };
    const renderOutputs = () => {
      const outputBlocks = [];
      for (const b of outputs) {
        outputBlocks.push(<span key={b.id}>{b.name}:{b.value}&nbsp;</span>);
      }
      return <div>Outputs: {outputBlocks}</div>;
    };

    const renderLogicComputedValues = () => {
      const logicBlocks = [];
      for (const b of logic) {
        if (b.sources.length > 0) {
          const i1 = inputs ? inputs[b.sources[0]] : undefined;
          const i2 = inputs && b.sources[1] ? inputs[b.sources[1]] : undefined;
          logicBlocks.push(
            <div key={b.id}>{i1 ? i1.name : ""} {b.value}
              {i2 ? i2.name : ""} {b.currentValue(currentDiagram)}
            </div>);
        }
      }
      return <div>Logic calculations: {logicBlocks}</div>;
    };
    return (
      <div className="app">
        <div>
          <div>Enter Dataflow2 JSON string:</div>
          <div><textarea defaultValue={JSON.stringify(currentDiagram)} id="sourceData" cols={120} rows={20} /></div>
          <div><input type="submit" value="submit" onClick={this.updateDiagram} /></div>
        </div>
        <hr />
        <div>{renderInputs()}</div>
        <div>{renderLogicBlocks()}</div>
        <div>{renderOutputs()}</div>
        <hr />
        <div><span className="infoLabel">Parsed Blocks: </span>{renderInputs()}</div>
        {renderLogicComputedValues()}
      </div>
    );
  }
  private updateDiagram = () => {
    const d = document.getElementById("sourceData") as HTMLInputElement;
    const newDiagram = DataflowDiagram.parseDiagram(d.value);
    console.log(newDiagram);
    if (newDiagram) {
      this.setState({ currentDiagram: newDiagram });
    }
  }
}
