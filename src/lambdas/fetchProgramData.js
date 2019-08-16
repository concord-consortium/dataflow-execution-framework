const AWS = require('aws-sdk');
const dynamoDocClient = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event, context, callback) => {
  const result = {
    count: 0
  };
  if (!event.programId) return null;

  const data = await getProgamData(event.programId, event.time, event.endTime);

  if (!data || data.length === 0) {
    console.log("no recorded data");
  } else {
    result.count = data.length;
  }
  callback(null, result);
};
// Note that the endTime field in dataflow-programs was set as a key, so must be unique. This could potentially be a problem?
// though the chances of a program being created with the same timestamp to the ms are slim
async function getProgamData(programId, eventTime, eventEndTime) {
  return new Promise((resolve, reject) => {
    const params = {
      TableName: "dataflow-data",
      KeyConditionExpression: "programId = :v_programId AND #t BETWEEN :v_time AND :v_endtime",
      ExpressionAttributeNames: {
        "#t": "time",
        "#v": "values"
      },
      ExpressionAttributeValues: {
        ":v_programId": programId,
        ":v_time": eventTime ? eventTime : 0,
        ":v_endtime": eventEndTime ? eventEndTime : Date.now()
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
