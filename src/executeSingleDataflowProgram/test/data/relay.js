module.exports = {
  "id":"dataflow@0.1.0",
  "nodes":{
     "3":{
        "id":3,
        "data":{
           "type":"temperature",
           "sensor":"2711-tempe",
           "nodeValue":11.15
        },
        "inputs":{

        },
        "outputs":{
           "num":{
              "connections":[
                 {
                    "node":9,
                    "input":"num1",
                    "data":{

                    }
                 }
              ]
           }
        },
        "name":"Sensor"
     },
     "8":{
        "id":8,
        "data":{
           "nodeValue":14
        },
        "inputs":{

        },
        "outputs":{
           "num":{
              "connections":[
                 {
                    "node":9,
                    "input":"num2",
                    "data":{

                    }
                 }
              ]
           }
        },
        "name":"Number"
     },
     "9":{
        "id":9,
        "data":{
           "num1":0,
           "num2":0,
           "logicOperator":"greater than",
           "nodeValue":0
        },
        "inputs":{
           "num1":{
              "connections":[
                 {
                    "node":3,
                    "output":"num",
                    "data":{

                    }
                 }
              ]
           },
           "num2":{
              "connections":[
                 {
                    "node":8,
                    "output":"num",
                    "data":{

                    }
                 }
              ]
           }
        },
        "outputs":{
           "num":{
              "connections":[
                 {
                    "node":10,
                    "input":"num1",
                    "data":{

                    }
                 }
              ]
           }
        },
        "name":"Logic"
     },
     "10":{
        "id":10,
        "data":{
           "num1":0,
           "relayList":"2713-relay",
           "nodeValue":0
        },
        "inputs":{
           "num1":{
              "connections":[
                 {
                    "node":9,
                    "output":"num",
                    "data":{

                    }
                 }
              ]
           }
        },
        "outputs":{

        },
        "name":"Relay"
     }
  }
};