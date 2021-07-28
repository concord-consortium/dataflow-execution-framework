module.exports = {
  "id": "dataflow@0.1.0",
  "nodes": {
    "1": {
      "id": 1,
      "data": {
        "datasetName": "my-dataset",
        "interval": 1,
        "sequence1": "my-sequence",
        "nodeValue": {
          "num1": {
            "name": "sequence",
            "val": 23.9
          }
        },
        "sequence2": "my-sequence",
        "inputKeys": [
          "num1",
          "num2"
        ]
      },
      "inputs": {
        "num1": {
          "connections": [
            {
              "node": "temp-id",
              "output": "num",
              "data": {}
            }
          ]
        },
        "num2": {
          "connections": [
            {
              "node": "add-id",
              "output": "num",
              "data": {}
            }
          ]
        },
        "num3": {
          "connections": []
        }
      },
      "outputs": {},
      "position": [
        863.10546875,
        105.98046875
      ],
      "name": "Data Storage"
    },
    "temp-id": {
      "id": "temp-id",
      "data": {
        "type": "temperature",
        "sensor": "7E6FEE58-tempe",
        "nodeValue": 23.9
      },
      "inputs": {},
      "outputs": {
        "num": {
          "connections": [
            {
              "node": "add-id",
              "input": "num1",
              "data": {}
            },
            {
              "node": 1,
              "input": "num1",
              "data": {}
            }
          ]
        }
      },
      "position": [
        5,
        0
      ],
      "name": "Sensor"
    },
    "two-id": {
      "id": "two-id",
      "data": {
        "nodeValue": 2
      },
      "inputs": {},
      "outputs": {
        "num": {
          "connections": [
            {
              "node": "add-id",
              "input": "num2",
              "data": {}
            }
          ]
        }
      },
      "position": [
        5,
        160
      ],
      "name": "Number"
    },
    "add-id": {
      "id": "add-id",
      "data": {
        "0": {
          "node": "temp-id",
          "output": "num"
        },
        "1": {
          "node": "two-id",
          "output": "num"
        },
        "mathOperator": "add",
        "num1": 0,
        "num2": 0
      },
      "inputs": {
        "num1": {
          "connections": [
            {
              "node": "temp-id",
              "output": "num",
              "data": {}
            }
          ]
        },
        "num2": {
          "connections": [
            {
              "node": "two-id",
              "output": "num",
              "data": {}
            }
          ]
        }
      },
      "outputs": {
        "num": {
          "connections": [
            {
              "node": "compare-id",
              "input": "num1",
              "data": {}
            }
          ]
        }
      },
      "position": [
        250,
        0
      ],
      "name": "Math"
    },
    "compare-id": {
      "id": "compare-id",
      "data": {
        "logicalOperator": "equals",
        "num2": 5,
        "num1": 0,
        "logicOperator": "greater than",
        "nodeValue": 1
      },
      "inputs": {
        "num1": {
          "connections": [
            {
              "node": "add-id",
              "output": "num",
              "data": {}
            }
          ]
        },
        "num2": {
          "connections": []
        }
      },
      "outputs": {
        "num": {
          "connections": []
        }
      },
      "position": [
        500,
        0
      ],
      "name": "Logic"
    },
    "generator-id": {
      "id": "generator-id",
      "data": {
        "generatorType": "sine",
        "amplitude": 1,
        "period": 10,
        "nodeValue": 0.31,
        "ticks": 9
      },
      "inputs": {},
      "outputs": {
        "num": {
          "connections": [
            {
              "node": "transform-id",
              "input": "num1",
              "data": {}
            }
          ]
        }
      },
      "position": [
        5,
        260
      ],
      "name": "Generator"
    },
    "transform-id": {
      "id": "transform-id",
      "data": {
        "0": {
          "node": "generator-id",
          "output": "num"
        },
        "transformOperator": "absolute value",
        "num1": 0,
        "nodeValue": 0.31
      },
      "inputs": {
        "num1": {
          "connections": [
            {
              "node": "generator-id",
              "output": "num",
              "data": {}
            }
          ]
        }
      },
      "outputs": {
        "num": {
          "connections": []
        }
      },
      "position": [
        250,
        270
      ],
      "name": "Transform"
    },
    "lightbulb-id":{
      "id": "lightbulb-id",
      "data":{
         "num1": 0,
         "nodeValue": 0
      },
      "inputs":{
         "num1":{
            "connections":[
               {
                  "node": "generator-id",
                  "output": "num",
                  "data": {

                  }
               }
            ]
         }
      },
      "outputs":{

      },
      "position": [
        280,
        280
      ],
      "name":"Light Bulb"
   }
  }
};