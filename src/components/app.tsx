import { inject, observer } from "mobx-react";
import * as React from "react";
import { BaseComponent, IBaseProps } from "./base";
import {
  DataflowDiagram,
  DataflowBlock
} from "../models/dataflow/dataflow-diagram";
import {
  InputBlockType,
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
      currentDiagram: DataflowDiagram.create(sample)
    };
  }
  public render() {
    const { currentDiagram } = this.state;
    // test data
    const blocksByType = currentDiagram.getBlocksByType();

    const blocks: DataflowBlock[] = blocksByType.allBlocks;
    const inputs: DataflowBlock[] = blocksByType.inputs;
    const logic: DataflowBlock[] = blocksByType.logic;
    const outputs: DataflowBlock[] = blocksByType.outputs;

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
    const newDiagram = DataflowDiagram.create(d.value);
    if (newDiagram) {
      this.setState({ currentDiagram: newDiagram });
    }
  }
}
