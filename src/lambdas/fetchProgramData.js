const AWS = require('aws-sdk');
const dynamoDocClient = new AWS.DynamoDB.DocumentClient();
const lambda = new AWS.Lambda({
  region: 'us-east-1' //change to your region
});

exports.handler = async (event, context, callback) => {
  const result = {
    count: 0
  };
  if (!event.programId) return null;
  if (event.time) console.log(event.time);

  const data = await getProgamData(event.programId, event.time);

  if (!data || data.length === 0) {
    console.log("no recorded data");
  } else {
    result.count = data.length;
    console.log(data);
  }
  console.log("done");
  callback(null, result);
};
// Note that the endTime field in dataflow-programs was set as a key, so must be unique. This could potentially be a problem?
// though the chances of a program being created with the same timestamp to the ms are slim
async function getProgamData(programId, eventTime) {
  return new Promise((resolve, reject) => {
    const params = {
      TableName: "dataflow-data",
      KeyConditionExpression: "programId = :v_programId AND #t > :v_time",
      ExpressionAttributeNames: {
        "#t": "time",
        "#v": "values"
      },
      ExpressionAttributeValues: {
        ":v_programId": programId,
        ":v_time": eventTime ? eventTime : 0
      },
      ProjectionExpression: "programId, #t, blockIds, #v"
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
