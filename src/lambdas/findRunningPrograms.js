const AWS = require('aws-sdk');
const dynamoDocClient = new AWS.DynamoDB.DocumentClient();
const lambda = new AWS.Lambda({
  region: 'us-east-1' //change to your region
});

const iotAddress = "a2zxjwmcl3eyqd-ats.iot.us-east-1.amazonaws.com";
const iotdata = new AWS.IotData({endpoint: iotAddress});

const SENSOR_TIMEOUT = 10; // time skew in s between hub's last update time and sensor's
                           // after which we consider this sensor's data stale
const HUB_TIMEOUT = 10;    // time in s after which we consider entire hub stale

exports.handler = async (event, context, callback) => {
  const result = {
    count: 0
  };
  const programs = await getActivePrograms();

  if (!programs || programs.length === 0) {
    console.log("no active programs");
  } else {
    result.count = programs.length;

    // first collect all the sensor data we need
    const allSensorData = {};
    const allHubs = [];

    programs.forEach(p => allHubs.push.apply(allHubs, p.hubs));
    const uniqueHubs = [...new Set(allHubs)];

    for (let i = 0; i < uniqueHubs.length; i++) {
      const sensorValues = await getShadowData(uniqueHubs[i]);

      for (const sensor of Object.keys(sensorValues)) {
        if (!allSensorData[sensor] || isNaN(allSensorData[sensor]))
          allSensorData[sensor] = sensorValues[sensor];
      }
    }

    // run all the programs, passing in the sensor data

    for (let i = 0; i < programs.length; i++){

      // pass down next dataSaveTime, and update the time if necessary
      const dataSaveTime = programs[i].nextRunTime ? programs[i].nextRunTime : 0;
      if (Date.now() > dataSaveTime) {
        const saveDataInterval = Math.max(programs[i].runInterval || 0, 1000);
        const nextDataSaveTime = Date.now() + saveDataInterval;
        updateProgramNextRunTimestamp(programs[i].endTime, nextDataSaveTime);
      }

      const event = {
        program: programs[i],
        sensorData: allSensorData,
        dataSaveTime
      };

      lambda.invoke({
        FunctionName: 'arn:aws:lambda:us-east-1:816253370536:function:executeSingleDataflowProgram',
        Payload: JSON.stringify(event) // pass params
        , LogType: 'Tail'
        , InvocationType: 'Event'
      }, function (error, data) {
        if (error) {
          console.log('error', error);
        }
      });
    }
  }
  callback(null, result);
};

// Note that the endTime field in dataflow-programs was set as a key, so must be unique. This could potentially be a problem?
// though the chances of a program being created with the same timestamp to the ms are slim
async function getActivePrograms() {
  return new Promise((resolve, reject) => {
    const params = {
      TableName: "dataflow-programs",
      KeyConditionExpression: "active = :v_active AND endTime > :v_now",
      ExpressionAttributeValues: {
        ":v_active": 1,
        ":v_now": Date.now()
      },
      ProjectionExpression: "programId, nextRunTime, endTime, runInterval, hubs, program, sensors"
    };

    dynamoDocClient.query(params, function(err, data) {
      if (err) {
        console.log(err);
        reject(err);
      }
      else {
        resolve(data.Items);
      }
    });
  });
}

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
          const hubData = result.state.reported;

          // if we also have metadata, check for stale data
          const metadata = result.metadata && result.metadata && result.metadata.reported;
          if (metadata) {
            const now = Math.floor(Date.now() / 1000);
            const hubUpdateTime = hubData.time;
            const hubIsStale = now - hubUpdateTime > HUB_TIMEOUT;
            for (let sensor in hubData) {
              if (sensor === "time") continue;
              if (hubIsStale ||
                    (metadata[sensor] && metadata[sensor].timestamp
                      && hubUpdateTime - metadata[sensor].timestamp > SENSOR_TIMEOUT)) {
                hubData[sensor] = "NaN";      // have to pass string, or JSON.stringify will turn NaN to undefined
              }
            }
          }
          resolve(hubData);
        }
      }
    });
  });
}

async function updateProgramNextRunTimestamp(programTimestamp, nextDataSaveTime) {
  return new Promise((resolve, reject) => {
    const params = {
      TableName: "dataflow-programs",
      Key: {
        "active": 1,
        "endTime": programTimestamp
      },
      UpdateExpression: "SET nextRunTime = :v_next",
      ExpressionAttributeValues: {
        ":v_next": nextDataSaveTime
      },
      ReturnValues: "UPDATED_NEW"
    };
    dynamoDocClient.update(params, function(err, data) {
      if (err) {
        reject(err);
      } else {
        // console.log("success!");
        resolve(data.Items);
      }
    });
  });
}
