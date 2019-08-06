const AWS = require('aws-sdk');
const dynamoDocClient = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {

  const deviceId = event.deviceId;
  console.log(event);
  if (deviceId && event.sensorData) {

    await recordDataToTable(deviceId, event.time, event.sensorData);
  } else {
    return "finished program " + JSON.stringify(event);
  }
  console.log("done");
};

async function recordDataToTable(deviceId, time, sensorData) {
  return new Promise((resolve, reject) => {
    const sensors = Object.keys(sensorData);
    const values = Object.values(sensorData);
    const allSensors = {};
    for (let i = 0; i < sensors.length; i++){
      //let sensorName = sensors[i].substring(sensors[i].indexOf("-") + 1);
      allSensors[sensors[i]] = values[i];
    }
    const params = {
      TableName: "dataflow-sensor-data",
      Item: {
        "deviceId": deviceId,
        "time": Date.now(),
        "sensorData": JSON.stringify(sensorData)
      }
    }

    Object.entries(allSensors).forEach(element => {
      params[element[0]] = element[1];
    });

    dynamodb.put(params, function(err, data) {
      if (err) {
        reject(err);
      } else {
        console.log("success!");
        resolve(data.Items);
      }
    });
  });
}
