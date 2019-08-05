var AWS = require('aws-sdk');
const dynamoDocClient = new AWS.DynamoDB.DocumentClient();

var iotAddress = "a2zxjwmcl3eyqd-ats.iot.us-east-1.amazonaws.com";
var iotdata = new AWS.IotData({endpoint: iotAddress});

exports.handler = async (event) => {

  // run this for a single program
  var program = event;
  console.log(program);
  if (!program.programId) program = JSON.parse(event);
  if (program.programId) {
    var programId = program.programId;
    // data has just one hub for now
    var hubId = program.hubs[0];
    var sensorIds = program.sensors;

    var sensorValues = await getShadowData(hubId);
    console.log("sensor values:");
    console.log(sensorValues);

    var saveSensorData = [];
    for (var sensor of sensorIds) {
      saveSensorData.push({ sensorId: sensor, value: sensorValues[sensor] });
    }
    console.log("saveSensorData:");
    console.log(saveSensorData);

    await recordDataToTable(programId, saveSensorData);
  } else {
    return "finished program " + JSON.stringify(event);
  }
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

async function recordDataToTable(programId, sensorData) {
  return new Promise((resolve, reject) => {
    var blockIds = sensorData.map(d => d.sensorId);
    var values = sensorData.map(d => d.value)
    let params = {
      TableName: "dataflow-data",
      Item: {
        "programId": programId,
        "time": ("" + Date.now()),
        "blockIds": blockIds,
        "values": values
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
