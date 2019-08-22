const AWS = require('aws-sdk');
const dynamoDocClient = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  const program = event.program;
  console.log(program);
  await recordProgram(program);
  console.log("done");
};

async function recordProgram(program) {
  return new Promise((resolve, reject) => {
    const nextRunTime = Date.now() + program.runInterval;
    const params = {
      TableName: "dataflow-programs",
      Item: {
        "active": 1,
        "endTime": program.endTime,
        "programId": program.programId,
        "nextRunTime": nextRunTime,
        "hubs": program.hubs,
        "sensors": program.sensors,
        "runInterval": program.runInterval,
        "program": JSON.stringify(program.program)
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
