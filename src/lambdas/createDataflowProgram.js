var AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

var iotAddress = "a2zxjwmcl3eyqd-ats.iot.us-east-1.amazonaws.com";
var iotdata = new AWS.IotData({endpoint: iotAddress});

exports.handler = async (event) => {

  //var programs = await getActivePrograms();

  //if (!programs || programs.length === 0) {
  //  console.log("no active programs");
  //  return;
  //}
  // "{"file_version":"0.1","blocks":[{"type":"sensor","source":"2711-tempe","save":true,"label":"My temperature"},{"type":"sensor","source":"2711-humid","save":true,"label":"My humidity"}]}"
  // run this for a single program
  var program = event.program;

  console.log(program);

  console.log("done");
};

async function getShadowData(hubId) {
  return new Promise((resolve, reject) => {
    iotdata.getThingShadow({
      thingName: hubId
    }, function(err, data) {
      if (err) {
        reject(err);
      } else {
        var result = JSON.parse(data.payload);
        if (result && result.state && result.state.reported) {
          resolve(result.state.reported);
        }
      }
    });
  });
}

function recordProgram(programId, sensorData) {
  return new Promise((resolve, reject) => {
    var blockIds = sensorData.map(d => d.sensorId);
    var values = sensorData.map(d => d.value);

    dynamodb.putItem({
      TableName: "dataflow-data",
      Item: {
        "programId": {
          S: programId
        },
        "time": {
          S: "" + Date.now()
        },
        "blockIds": {
          SS: blockIds
        },
        "values": {
          NS: values
        }
      }
    }, function(err, data) {
      if (err) {
        reject(err);
      } else {
        console.log("success!");
        resolve();
      }
    });
  });
}
