var AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB({apiVersion: '2012-08-10'});
var lambda = new AWS.Lambda({
  region: 'us-east-1' //change to your region
});

exports.handler = async (event) => {

  var programs = await getActivePrograms();

  if (!programs || programs.length === 0) {
    console.log("no active programs");
    return;
  }
  for (let i = 0; i < programs.length; i++){
    console.log("running: " + JSON.stringify(programs[i]));
    console.log(programs[i]);
    let nextRunTime = programs[i].nextRunTime ? programs[i].nextRunTime.N : 0;
    let interval = programs[i].runInterval ? programs[i].runInterval.N : 1000;
    console.log("time since last run: " + (Date.now() - nextRunTime));
    if (Date.now() - nextRunTime > interval) {
      // update timestamp
      let resUpdate = await updateProgramNextRunTimestamp(programs[i].endTime);
      let resExecute = lambda.invoke({
        FunctionName: 'executeDataflowProgram',
        Payload: JSON.stringify(event, programs[i]) // pass params
        , InvocationType: 'Event'
      }, function (error, data) {
        if (error) {
          console.log('error', error);
        }
        if (data) {
          console.log("success", JSON.stringify(data));
        }
      });
    }
  }
  console.log("done");
};
// Note that the endTime field in dataflow-programs was set as a key, so must be unique. This could potentially be a problem?
// though the chances of a program being created with the same timestamp to the ms are slim
async function getActivePrograms() {
  return new Promise((resolve, reject) => {
    let now = "" + Date.now();
    let params = {
      TableName: "dataflow-programs",
      KeyConditionExpression: "active = :v_active AND endTime > :v_now",
      ExpressionAttributeValues: {
        ":v_active": {N: "1"},
        ":v_now": {N: now}
      },
      ProjectionExpression: "programId, nextRunTime, endTime, runInterval, hubs, program, sensors"
    };

    dynamodb.query(params, function(err, data) {
      if (err)
          console.log(err);
      else {
        resolve(data.Items);
      }
    });
  });
}

async function updateProgramNextRunTimestamp(programTimestamp) {
  return new Promise((resolve, reject) => {
    let now = "" + Date.now();
    let endTime = "" + programTimestamp;
    dynamodb.updateItem({
      TableName: "dataflow-programs",
      Key: {
        "active": {N: "1"},
        "endTime": { N: endTime }
      },
      UpdateExpression: "SET nextRunTime = :v_next",
      ExpressionAttributeValues: {
        ":v_next": {N: now}
      },
      ReturnValues: "UPDATED_NEW"
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
