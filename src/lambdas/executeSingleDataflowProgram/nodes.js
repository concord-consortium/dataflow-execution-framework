var rete = require('rete');

const NodeOperationTypes = [
  {
    name: "add",
    type: "math",
    method: (n1, n2) => n1 + n2,
    icon: "icon-add"
  },
  {
    name: "subtract",
    type: "math",
    method: (n1, n2) => n1 - n2,
    icon: "icon-subtract"
  },
  {
    name: "multiply",
    type: "math",
    method: (n1, n2) => n1 * n2,
    icon: "icon-multiply"
  },
  {
    name: "divide",
    type: "math",
    method: (n1, n2) => n1 / n2,
    icon: "icon-divide"
  },
  {
    name: "absolute value",
    type: "transform",
    method: (n1, n2) => Math.abs(n1),
    icon: "icon-absolute-value"
  },
  {
    name: "negation",
    type: "transform",
    method: (n1, n2) => 0 - n1,
    icon: "icon-negation"
  },
  {
    name: "not",
    type: "transform",
    method: (n1, n2) => n1 ? 0 : 1,
    icon: "icon-not"
  },
  {
    name: "greater than",
    type: "logic",
    method: (n1, n2) => +(n1 > n2),
    icon: "icon-greater-than"
  },
  {
    name: "less than",
    type: "logic",
    method: (n1, n2) => +(n1 < n2),
    icon: "icon-less-than"
  },
  {
    name: "greater than or equal to",
    type: "logic",
    method: (n1, n2) => +(n1 >= n2),
    icon: "icon-greater-than-or-equal-to"
  },
  {
    name: "less than or equal to",
    type: "logic",
    method: (n1, n2) => +(n1 <= n2),
    icon: "icon-less-than-or-equal-to"
  },
  {
    name: "equal",
    type: "logic",
    method: (n1, n2) => +(n1 === n2),
    icon: "icon-equal"
  },
  {
    name: "not equal",
    type: "logic",
    method: (n1, n2) => +(n1 !== n2),
    icon: "icon-not-equal"
  },
  {
    name: "and",
    type: "logic",
    method: (n1, n2) => n1 && n2 ? 1 : 0,
    icon: "icon-and"
  },
  {
    name: "or",
    type: "logic",
    method: (n1, n2) => n1 || n2 ? 1 : 0,
    icon: "icon-or"
  },
  {
    name: "nand",
    type: "logic",
    method: (n1, n2) => +(!(n1 && n2 ? 1 : 0)),
    icon: "icon-nand"
  },
  {
    name: "xor",
    type: "logic",
    method: (n1, n2) => +((n1 ? 1 : 0) !== (n2 ? 1 : 0)),
    icon: "icon-xor"
  }
];

const NodeGeneratorTypes = [
  {
    name: "sine",
    method: (t, p, a) => Math.round(Math.sin(t * Math.PI / (p / 2)) * a * 100) / 100,
  },
  {
    name: "square",
    method: (t, p, a) => t % p < p / 2 ? 1 * a : 0,
  },
  {
    name: "triangle",
    method: (t, p, a) => (2 * a / p) * Math.abs(t % p - p / 2),
  },
  {
    name: "noise",
    method: (t, p, a) => Math.random() * a,
  },
];

class NumberReteNodeFactory extends rete.Component {
  constructor(numSocket) {
    super("Number", numSocket);
  }

  builder(node) {
    const out1 = new rete.Output("num", "Number", this.numSocket);
    return node.addOutput(out1);
  }

  worker(node, inputs, outputs) {
    outputs.num = node.data.nodeValue;
  }
}

class MathReteNodeFactory extends rete.Component {
  constructor(numSocket) {
    super("Math", numSocket);
  }

  builder(node) {
    const inp1 = new Rete.Input("num1", "Number", this.numSocket);
    const inp2 = new Rete.Input("num2", "Number2", this.numSocket);
    const out = new Rete.Output("num", "Number", this.numSocket);

    return node
      .addInput(inp1)
      .addInput(inp2)
      .addOutput(out);
  }

  worker(node, inputs, outputs) {
    const mathOperator = node.data.mathOperator;
    let result = 0;
    const n1 = inputs.num1.length ? inputs.num1[0] : node.data.num1;
    const n2 = inputs.num2 ? (inputs.num2.length ? inputs.num2[0] : node.data.num2) : 0;

    const nodeOperationTypes = NodeOperationTypes.find(op => op.name === mathOperator);
    if (nodeOperationTypes) {
      result = nodeOperationTypes.method(n1, n2);
    }
    node._value = result;
    outputs.num = result;
  }
}

class TransformReteNodeFactory extends rete.Component {
  constructor(numSocket) {
    super("Transform", numSocket);
  }

  builder(node) {
    const inp1 = new Rete.Input("num1", "Number", this.numSocket);
    const out = new Rete.Output("num", "Number", this.numSocket);

    return node
      .addInput(inp1)
      .addOutput(out);
  }

  worker(node, inputs, outputs) {
    const transformOperator = node.data.transformOperator;
    let result = 0;
    const n1 = inputs.num1.length ? inputs.num1[0] : node.data.num1;

    const nodeOperationTypes = NodeOperationTypes.find(op => op.name === transformOperator);
    if (nodeOperationTypes) {
      result = nodeOperationTypes.method(n1, 0);
   }

    outputs.num = result;
  }
}

class LogicReteNodeFactory extends rete.Component {
  constructor(numSocket) {
    super("Logic", numSocket);
  }

  builder(node) {
    const inp1 = new Rete.Input("num1", "Number", this.numSocket);
    const inp2 = new Rete.Input("num2", "Number2", this.numSocket);
    const out = new Rete.Output("num", "Number", this.numSocket);

    return node
      .addInput(inp1)
      .addInput(inp2)
      .addOutput(out);
  }

  worker(node, inputs, outputs) {
    const logicOperator = node.data.logicOperator;
    let result = 0;
    const n1 = inputs.num1.length ? inputs.num1[0] : node.data.num1;
    const n2 = inputs.num2.length ? inputs.num2[0] : node.data.num2;

    const nodeOperationTypes = NodeOperationTypes.find(op => op.name === logicOperator);
    if (nodeOperationTypes) {
      result = nodeOperationTypes.method(n1, n2);
    }

    outputs.num = result;
  }
}

class SensorReteNodeFactory extends rete.Component {
  constructor(numSocket) {
    super("Sensor", numSocket);
  }

  builder(node) {
    const out1 = new Rete.Output("num", "Number", this.numSocket);
    return node
      .addOutput(out1);
  }

  worker(node, inputs, outputs) {
    outputs.num = node.data.nodeValue;
  }
}

class RelayReteNodeFactory extends rete.Component {
  constructor(numSocket) {
    super("Relay", numSocket);
  }

  builder(node) {
    const inp1 = new Rete.Input("num1", "Number", this.numSocket);
    return node
      .addInput(inp1);
  }

  worker(node, inputs, outputs) {
    const n1 = inputs.num1.length ? inputs.num1[0] : node.data.num1;
    const result = n1 !== 0 ? 1 : 0;

    outputs.num = result;
  }
}

class GeneratorReteNodeFactory extends rete.Component {
  constructor(numSocket) {
    super("Generator", numSocket);
  }

  builder(node) {
    const out = new Rete.Output("num", "Number", this.numSocket);

    return node
      .addOutput(out);
  }

  worker(node, inputs, outputs) {
    const generatorType = node.data.generatorType;
    const period = Number(node.data.period) * 1000; // period is given in s, but we're passing in ms
    const amplitude = Number(node.data.amplitude);

    const nodeGeneratorType = NodeGeneratorTypes.find(gt => gt.name === generatorType);

    let val = 0;
    if (nodeGeneratorType && period && amplitude) {
      const time = Date.now();
      val = nodeGeneratorType.method(time, period, amplitude);
    }

    outputs.num = val;
  }
}

class DataStorageReteNodeFactory extends rete.Component {

  constructor(numSocket) {
    super("Data Storage", numSocket);
  }

  builder(node) {
    this.inputCount = 1;
    this.inputPrefix = "num";

    if (node.data.inputKeys) {
      const keys = node.data.inputKeys;
      keys.forEach((key) => {
        const inp = new Rete.Input(key, "sequence", this.numSocket);
        const keyNum = parseInt(key.substring(this.inputPrefix.length), 10);
        this.inputCount = Math.max(this.inputCount, keyNum);

        node.addInput(inp);
      });
    } else {
      const inp = new Rete.Input(this.inputPrefix + this.inputCount, "sequence", this.numSocket);
      node.addInput(inp);
    }

    return node;
  }

  worker(node, inputs, outputs) {
    const inputValues = {};
    const inputKeys = Object.keys(inputs);
    if (inputKeys) {
      inputKeys.forEach((key) => {
        if (inputs[key].length) {
          const inputValue = { name: "sequence", val: inputs[key][0] };
          inputValues[key] = inputValue;
        }
      });
    }
  }

  addInput(node) {
    this.inputCount++;
    const input = new Rete.Input(this.inputPrefix + this.inputCount, "sequence", this.numSocket);
    node.addInput(input);
    node.data.inputKeys = Array.from(node.inputs.keys());
    node.update();
  }
}

module.exports = {
  NumberReteNodeFactory,
  MathReteNodeFactory,
  TransformReteNodeFactory,
  LogicReteNodeFactory,
  SensorReteNodeFactory,
  RelayReteNodeFactory,
  GeneratorReteNodeFactory,
  DataStorageReteNodeFactory
}