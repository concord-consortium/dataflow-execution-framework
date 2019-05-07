export const sample = '{"name":"test","displayedName":"test","blocks":[{"id":"sensor1","name":"a","blockType":3,"units":"things","sources":[1],"inputCount":1,"outputCount":1,"inputType":1,"outputType":1,"value":21,"view":{"x":1,"y":1},"calc":{}},{"id":"sensor2","name":"b","blockType":3,"units":"things2","sources":[1],"inputCount":1,"outputCount":1,"inputType":1,"outputType":1,"value":6,"view":{"x":1,"y":1},"calc":{}},{"id":"operator1","name":"c","blockType":201,"units":"logic","sources":[0,1],"inputCount":2,"outputCount":1,"inputType":1,"outputType":1,"value":"+","view":{"x":1,"y":1},"calc":{}},{"id":"operator2","name":"d","blockType":201,"units":"logic","sources":[0,1],"inputCount":2,"outputCount":1,"inputType":1,"outputType":1,"value":"*","view":{"x":1,"y":1},"calc":{}},{"id":"operator3","name":"e","blockType":202,"units":"logic","sources":[0,1],"inputCount":2,"outputCount":1,"inputType":1,"outputType":1,"value":">","view":{"x":1,"y":1},"calc":{}},{"id":"operator4","name":"f","blockType":203,"units":"logic","sources":[0,1],"inputCount":2,"outputCount":1,"inputType":1,"outputType":1,"value":"and","view":{"x":1,"y":1},"calc":{}}],"fileVersion":1,"archived":false}';

export const sample2 = {
  "name": "test",
  "displayedName": "test",
  "blocks": [
    {
      "id": "sensor1", "name": "a", "blockType": 3, "units": "things", "sources": [1], "inputCount": 1, "outputCount": 1, "inputType": 1, "outputType": 1, "value": 21, "view": { "x": 1, "y": 1 }, "calc": {}
    },
    {
      "id": "sensor2", "name": "b", "blockType": 3, "units": "things2", "sources": [1], "inputCount": 1, "outputCount": 1, "inputType": 1, "outputType": 1, "value": 6, "view": { "x": 1, "y": 1 }, "calc": {}
    },
    {
      "id": "operator1", "name": "c", "blockType": 202, "units": "logic", "sources": [0, 1], "inputCount": 2, "outputCount": 1, "inputType": 1, "outputType": 1, "value": "+", "view": { "x": 1, "y": 1 }, "calc": {}
    },
    {
      "id": "operator2", "name": "d", "blockType": 202, "units": "logic", "sources": [0, 1], "inputCount": 2, "outputCount": 1, "inputType": 1, "outputType": 1, "value": "*", "view": { "x": 1, "y": 1 }, "calc": {}
    },
    {
      "id": "operator3", "name": "e", "blockType": 203, "units": "logic", "sources": [0, 1], "inputCount": 2, "outputCount": 1, "inputType": 1, "outputType": 1, "value": ">", "view": { "x": 1, "y": 1 }, "calc": {}
    },
    {
      "id": "operator4", "name": "f", "blockType": 204, "units": "logic", "sources": [0, 1], "inputCount": 2, "outputCount": 1, "inputType": 1, "outputType": 1, "value": "and", "view": { "x": 1, "y": 1 }, "calc": {}
    }], "fileVersion": 1, "archived": false
};

// example of a diagram with a data storage block
export const sample3 = '{"file_version":"0.1","blocks":[{"id":1,"name":"temperature","type":"temperature","units":"degrees C","sources":[],"input_count":0,"output_count":1,"input_type":null,"output_type":"n","has_seq":true,"params":[],"value":null,"view":{"x":32,"y":19}},{"id":2,"name":"humidity","type":"humidity","units":"percent","sources":[],"input_count":0,"output_count":1,"input_type":null,"output_type":"n","has_seq":true,"params":[],"value":null,"view":{"x":40,"y":70}},{"id":3,"name":"CO2","type":"CO2","units":"PPM","sources":[],"input_count":0,"output_count":1,"input_type":null,"output_type":"n","has_seq":true,"params":[],"value":null,"view":{"x":45,"y":105}},{"id":4,"name":"O2","type":"O2","units":"percent","sources":[],"input_count":0,"output_count":1,"input_type":null,"output_type":"n","has_seq":true,"params":[],"value":null,"view":{"x":50,"y":140}},{"id":5,"name":"light","type":"light","units":"lux","sources":[],"input_count":0,"output_count":1,"input_type":null,"output_type":"n","has_seq":true,"params":[],"value":null,"view":{"x":55,"y":175}},{"id":8,"name":"data storage","type":"data storage","sources":[1,2,3,4,5],"input_count":6,"output_count":0,"input_type":"n","output_type":null,"has_seq":false,"params":[{"name":"recording_interval","value":1,"default":1},{"name":"dataset_location","value":"christest dataset","default":"mydataset"},{"name":"sequence_names","value":{"1":"temperature","2":"humidity","3":"CO2","4":"O2","5":"light"}}],"value":615,"view":{"x":466,"y":406}}],"archived":false,"displayedName":"christest","name":"program_20181029_130647"}';

export const sample3Pretty = {
  "file_version": "0.1",
  "blocks": [
    {
      "id": 1,
      "name": "temperature",
      "type": "temperature",
      "units": "degrees C",
      "sources": [],
      "input_count": 0,
      "output_count": 1,
      "input_type": null,
      "output_type": "n",
      "has_seq": true,
      "params": [],
      "value": null,
      "view": {
        "x": 32,
        "y": 19
      }
    },
    {
      "id": 2,
      "name": "humidity",
      "type": "humidity",
      "units": "percent",
      "sources": [],
      "input_count": 0,
      "output_count": 1,
      "input_type": null,
      "output_type": "n",
      "has_seq": true,
      "params": [],
      "value": null,
      "view": {
        "x": 40,
        "y": 70
      }
    },
    {
      "id": 3,
      "name": "CO2",
      "type": "CO2",
      "units": "PPM",
      "sources": [],
      "input_count": 0,
      "output_count": 1,
      "input_type": null,
      "output_type": "n",
      "has_seq": true,
      "params": [],
      "value": null,
      "view": {
        "x": 45,
        "y": 105
      }
    },
    {
      "id": 4,
      "name": "O2",
      "type": "O2",
      "units": "percent",
      "sources": [],
      "input_count": 0,
      "output_count": 1,
      "input_type": null,
      "output_type": "n",
      "has_seq": true,
      "params": [],
      "value": null,
      "view": {
        "x": 50,
        "y": 140
      }
    },
    {
      "id": 5,
      "name": "light",
      "type": "light",
      "units": "lux",
      "sources": [],
      "input_count": 0,
      "output_count": 1,
      "input_type": null,
      "output_type": "n",
      "has_seq": true,
      "params": [],
      "value": null,
      "view": {
        "x": 55,
        "y": 175
      }
    },
    {
      "id": 8,
      "name": "data storage",
      "type": "data storage",
      "sources": [
        1,
        2,
        3,
        4,
        5
      ],
      "input_count": 6,
      "output_count": 0,
      "input_type": "n",
      "output_type": null,
      "has_seq": false,
      "params": [
        {
          "name": "recording_interval",
          "value": 1,
          "default": 1
        },
        {
          "name": "dataset_location",
          "value": "christest dataset",
          "default": "mydataset"
        },
        {
          "name": "sequence_names",
          "value": {
            "1": "temperature",
            "2": "humidity",
            "3": "CO2",
            "4": "O2",
            "5": "light"
          }
        }
      ],
      "value": 615,
      "view": {
        "x": 466,
        "y": 406
      }
    }
  ],
  "archived": false,
  "displayedName": "christest",
  "name": "program_20181029_130647"
};