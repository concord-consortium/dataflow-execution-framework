const AWS = require('aws-sdk');
const dynamoDocClient = new AWS.DynamoDB.DocumentClient();

const iotAddress = "a2zxjwmcl3eyqd-ats.iot.us-east-1.amazonaws.com";
const iotdata = new AWS.IotData({endpoint: iotAddress});

exports.handler = async (event) => {

  // run this for a single program
  const program = event;
  console.log(program);
  if (!program.programId) program = JSON.parse(event);
  if (program.programId) {
    const programId = program.programId;
    const allProgramSensors = program.sensors;
    const saveSensorData = [];
    for (const hub of program.hubs) {
      const sensorValues = await getShadowData(hub);

      console.log("sensor values for hub " + hub + " :");
      console.log(sensorValues);

      for (const sensor of Object.keys(sensorValues)) {
        const hubSensorName = hub + "_" + sensor;
        if (allProgramSensors.indexOf(hubSensorName) > -1) {
          saveSensorData.push({ sensorId: hubSensorName, value: sensorValues[sensor] });
        }
      }
    }
    console.log("saveSensorData:");
    console.log(saveSensorData);
    if (saveSensorData.length > 0) {
      await recordDataToTable(programId, saveSensorData);
    }
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
        const result = JSON.parse(data.payload);
        if (result && result.state && result.state.reported) {
          resolve(result.state.reported);
        }
      }
    });
  });
}

async function recordDataToTable(programId, sensorData) {
  return new Promise((resolve, reject) => {
    const blockIds = sensorData.map(d => d.sensorId);
    const values = sensorData.map(d => d.value)
    const params = {
      TableName: "dataflow-data",
      Item: {
        "programId": programId,
        "time": Date.now(),
        "blockIds": dynamoDocClient.createSet(blockIds),
        "values": dynamoDocClient.createSet(values)
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
