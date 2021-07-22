const AWS = require('aws-sdk');
const dynamoDocClient = new AWS.DynamoDB.DocumentClient();
const lambda = new AWS.Lambda({
  region: 'us-east-1' //change to your region
});

const iotAddress = "a2zxjwmcl3eyqd-ats.iot.us-east-1.amazonaws.com";
const iotdata = new AWS.IotData({endpoint: iotAddress});

exports.handler = async (event, context, callback) => {
  // Of the user's specific programs, only the active ones are returned from this lambda
  // the return value "programs" contains an array of running programs.
  const result = {
    count: 0,
    programs: []
  };
  const programs = await getActiveProgramsSimple();

  if (!programs || programs.length === 0) {
    console.log("no active programs");
  } else {
    result.count = programs.length;

    // check if our programs are in the list

    for (let i = 0; i < programs.length; i++){
      console.log("Checking: " + programs[i].programId);
      if (event.programs.indexOf(programs[i].programId) > -1) {
        // program is running
        result.programs.push(programs[i].programId);
      }
    }
  }
  console.log("done");
  callback(null, result);
};

// Note that the endTime field in dataflow-programs was set as a key, so must be unique. This could potentially be a problem?
// though the chances of a program being created with the same timestamp to the ms are slim
async function getActiveProgramsSimple() {
  return new Promise((resolve, reject) => {
    const params = {
      TableName: "dataflow-programs",
      KeyConditionExpression: "active = :v_active AND endTime > :v_now",
      ExpressionAttributeValues: {
        ":v_active": 1,
        ":v_now": Date.now()
      },
      ProjectionExpression: "programId, endTime"
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
