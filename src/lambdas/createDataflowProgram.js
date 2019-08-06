const AWS = require('aws-sdk');
const dynamoDocClient = new AWS.DynamoDB.DocumentClient();

var iotAddress = "a2zxjwmcl3eyqd-ats.iot.us-east-1.amazonaws.com";
var iotdata = new AWS.IotData({endpoint: iotAddress});

exports.handler = async (event) => {
/*
endTime:1565195992000

hubs:[
355aaff3-1b00-493a-b2ba-1df3673d7e73
]

program:
\"{\"file_version\":\"0.1\",\"blocks\":[{\"type\":\"sensor\",\"source\":\"2711-tempe\",\"save\":true,\"label\":\"My temperature\"},{\"type\":\"sensor\",\"source\":\"2711-humid\",\"save\":true,\"label\":\"My humidity\"}]}\"

programId:
test-7

runInterval:
2000

sensors: [
355aaff3-1b00-493a-b2ba-1df3673d7e73_2711-humid
355aaff3-1b00-493a-b2ba-1df3673d7e73_2711-tempe
355aaff3-1b00-493a-b2ba-1df3673d7e73_2712-CO2
]

{
  "active": {
    "N": "1"
  },
  "endTime": {
    "N": "1565195992000"
  },
  "hubs": {
    "SS": [
      "355aaff3-1b00-493a-b2ba-1df3673d7e73"
    ]
  },
  "nextRunTime": {
    "N": "1565039384379"
  },
  "program": {
    "S": "\"{\"file_version\":\"0.1\",\"blocks\":[{\"type\":\"sensor\",\"source\":\"2711-tempe\",\"save\":true,\"label\":\"My temperature\"},{\"type\":\"sensor\",\"source\":\"2711-humid\",\"save\":true,\"label\":\"My humidity\"}]}\""
  },
  "programId": {
    "S": "test-7"
  },
  "runInterval": {
    "N": "2000"
  },
  "sensors": {
    "SS": [
      "2711-humid",
      "2711-tempe",
      "2712-CO2"
    ]
  }
}

*/
  let program = event.program;

  console.log(program);
  await recordProgram(program);
  console.log("done");
};

async function recordProgram(program) {
  return new Promise((resolve, reject) => {
    let nextRunTime = Date.now() + program.runInterval;
    let params = {
      TableName: "dataflow-programs",
      Item: {
        "active": 1,
        "endTime": program.endTime,
        "programId": program.programId,
        "nextRunTime": nextRunTime,
        "hubs": dynamoDocClient.createSet(program.hubs),
        "sensors": dynamoDocClient.createSet(program.sensors),
        "runInterval": program.runInterval,
        "program": program.program
      }
    };
    dynamoDocClient.put(params, function(err, data) {
      if (err) {
        console.log("failed to save!", params);
        reject(err);
      } else {
        console.log("success!");
        resolve(data.Items);
      }
    });
  });
}
