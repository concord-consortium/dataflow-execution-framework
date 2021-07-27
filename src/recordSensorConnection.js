const AWS = require('aws-sdk');
const dynamoDocClient = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {

  const deviceId = event.deviceId;
  console.log(event);
  if (deviceId) {
    await recordDataToTable(deviceId, event.time);
  } else {
    return "finished program " + JSON.stringify(event);
  }
  console.log("done");
};

async function recordDataToTable(deviceId, timestamp) {
  return new Promise((resolve, reject) => {
    const params = {
      TableName: "dataflow-device-connections",
      Item: {
        "deviceId": deviceId,
        "time": timestamp
      }
    }

    dynamoDocClient.put(params, function(err, data) {
      if (err) {
        reject(err);
      } else {
        console.log("success!");
        resolve(data.Items);
      }
    });
  });
}
