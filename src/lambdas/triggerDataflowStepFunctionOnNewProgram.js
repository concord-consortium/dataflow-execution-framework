const aws = require('aws-sdk');
const stepfunctions = new aws.StepFunctions();

exports.handler = async (event) => {
  let newProgram = false;
  if (!event.Records) {
    return;
  }

  for (let i = 0; i < event.Records.length; i++) {
    // if we are inserting, and the new record has the "active" key of 1
    if (event.Records[i].eventName == 'INSERT' && event.Records[i].dynamodb.Keys.active.N === "1") {
      newProgram = true;
      break;
    }
  }

  if (newProgram) {
    const params = {
      stateMachineArn: process.env.STATE_MACHINE_ARN,
      input: "{}"
    };
    await launchStepFunction(params);
  }
  console.log("done");
};

async function launchStepFunction(params) {
  return new Promise((resolve, reject) => {
    stepfunctions.startExecution(params, function (err, data) {
      if (err) {
        console.log('err while executing step function');
        reject(err);
      } else {
        console.log('started execution of step function');
        resolve();
      }
    });
  });
}
