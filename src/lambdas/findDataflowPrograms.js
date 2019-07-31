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
    let result = lambda.invoke({
      FunctionName: 'executeDataflowProgram',
      Payload: JSON.stringify(event, programs[i]) // pass params
      , InvocationType: 'Event'
    }, function(error, data) {
      if (error) {
        console.log('error', error);
      }
      if(data.Payload){
       console.log("success", data.Payload)
      }
      });
  }
  console.log("done");
};

async function getActivePrograms() {
  return new Promise((resolve, reject) => {
    var now = "" + Date.now();
    var params = {
      TableName: "dataflow-programs",
      KeyConditionExpression: "active = :v_active AND endTime > :v_now",
      ExpressionAttributeValues: {
        ":v_active": {N: "1"},
        ":v_now": {N: now}
      },
      ProjectionExpression: "programId, hubs, program, sensors"
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

