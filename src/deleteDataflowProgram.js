const AWS = require('aws-sdk');
const dynamoDocClient = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  const endTime = event.endTime * 1;
  await deleteProgram(endTime);
};

async function deleteProgram(endTime) {
  return new Promise((resolve, reject) => {
    var params = {
      TableName : 'dataflow-programs',
      Key: {
        active: 1,
        endTime: endTime
      }
    };

    dynamoDocClient.delete(params, function(err, data) {
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
