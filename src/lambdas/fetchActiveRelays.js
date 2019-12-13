const AWS = require('aws-sdk');
const dynamoDocClient = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event, context, callback) => {
  const result = {
    relays: []
  };
  const programs = await getActivePrograms();

  if (!programs || programs.length === 0) {
    // no active programs
  } else {
    const allRelays = [];
    programs.forEach(p => allRelays.push.apply(allRelays, p.relays));
    const uniqueRelays = [...new Set(allRelays)];
    result.relays = uniqueRelays;
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
      ProjectionExpression: "endTime, relays"
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
