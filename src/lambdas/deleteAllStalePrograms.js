const AWS = require('aws-sdk');
const dynamoDocClient = new AWS.DynamoDB.DocumentClient();
const lambda = new AWS.Lambda({
  region: 'us-east-1' //change to your region
});

exports.handler = async (event, context, callback) => {
  const programs = await getStalePrograms();

  if (!programs || programs.length === 0) {
    callback(null);
  } else {
    const itemsToDelete = [];
    for (let i = 0; i < programs.length; i++) {
      itemsToDelete.push({
        DeleteRequest : {
          Key : {
            active: 1,
            endTime: programs[i].endTime
          }
        }
      });
    }
    while (itemsToDelete.length > 0) {
      const deletionBatch = itemsToDelete.splice(0, 25);

      var params = {
        RequestItems : {
          "dataflow-programs": deletionBatch
        }
      };

      dynamoDocClient.batchWrite(params, function(err) {
        if (err) {
            console.log(err);
            console.log('Batch delete unsuccessful ...');
        } else {
            console.log('Batch delete successful ...');
        }
      });
    }
  }
  callback(null);
};

async function getStalePrograms() {
  return new Promise((resolve, reject) => {
    const params = {
      TableName: "dataflow-programs",
      KeyConditionExpression: "active = :v_active AND endTime < :v_now",
      ExpressionAttributeValues: {
        ":v_active": 1,
        ":v_now": Date.now()
      },
      ProjectionExpression: "endTime"
    };

    dynamoDocClient.query(params, function(err, data) {
      if (err) {
        console.log(err);
        reject(err);
      }
      else {
        console.log(data.Items);
        resolve(data.Items);
      }
    });
  });
}
