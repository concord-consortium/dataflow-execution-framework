var aws = require('aws-sdk');
var sfn = new aws.StepFunctions();

exports.handler = function(event, context, callback) {

  let StateMachineArn = event.iterator.StateMachineArn;
  event = JSON.stringify(event);

  let params = {
      input: event,
      stateMachineArn: StateMachineArn
  };

  sfn.startExecution(params, function(err, data) {
      if (err) callback(err);
      else callback(null,event);
  });

}