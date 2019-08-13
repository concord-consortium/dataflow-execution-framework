const AWS = require('aws-sdk');
const dynamoDocClient = new AWS.DynamoDB.DocumentClient();
const lambda = new AWS.Lambda({
  region: 'us-east-1' //change to your region
});

exports.handler = async (event) => {
  const result = {
    count: 0
  };
  const programs = await getActivePrograms();

  if (!programs || programs.length === 0) {
    console.log("no active programs");
  } else {
    result.count = programs.length;
    for (let i = 0; i < programs.length; i++){
      console.log("running: " + JSON.stringify(programs[i].programId));
      // console.log(programs[i]);
      const nextRunTime = programs[i].nextRunTime ? programs[i].nextRunTime : 0;
      const interval = programs[i].runInterval ? programs[i].runInterval : 1000;
      console.log("time since last run: " + (Date.now() - nextRunTime));
      if (Date.now() - nextRunTime > interval) {
        // update timestamp
        await updateProgramNextRunTimestamp(programs[i].endTime);

        lambda.invoke({
          FunctionName: 'arn:aws:lambda:us-east-1:816253370536:function:executeDataflowProgram',
          Payload: JSON.stringify(programs[i]) // pass params
          , LogType: 'Tail'
          , InvocationType: 'Event'
        }, function (error, data) {
          // console.log("invoke complete: ", error, data);
          if (error) {
            console.log('error', error);
          }
          // if (data) {
          //   console.log("success");
          // }
        });
      }
    }
  }
  console.log("done");
  return JSON.stringify(result);
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

async function updateProgramNextRunTimestamp(programTimestamp) {
  return new Promise((resolve, reject) => {
    const params = {
      TableName: "dataflow-programs",
      Key: {
        "active": 1,
        "endTime": programTimestamp
      },
      UpdateExpression: "SET nextRunTime = :v_next",
      ExpressionAttributeValues: {
        ":v_next": Date.now()
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
