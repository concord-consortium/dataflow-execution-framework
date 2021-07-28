const AWS = require('aws-sdk');
const dynamoDocClient = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event, context, callback) => {
  const activeStepFunctions = await getActiveStepFunctions();

  if (!activeStepFunctions || activeStepFunctions.length === 0) {
    console.log("no active step functions");
    await insertActiveStepFunction();
    callback(null);
  }

  callback(new Error("step function already running"));
};

async function getActiveStepFunctions() {
  return new Promise((resolve, reject) => {
    const params = {
      TableName: "dataflow-programs",
      KeyConditionExpression: "active = :v_active",
      ExpressionAttributeValues: {
        ":v_active": 2
      },
      ProjectionExpression: "active"
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

async function insertActiveStepFunction(program) {
  return new Promise((resolve, reject) => {
    const params = {
      TableName: "dataflow-programs",
      Item: {
        "active": 2,
        "endTime": 0
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
