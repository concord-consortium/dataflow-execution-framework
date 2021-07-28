const AWS = require('aws-sdk');
const dynamoDocClient = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event, context, callback) => {
  const programs = await getStalePrograms();

  if (!programs || programs.length === 0) {
    callback(null);
  } else {
    const allDeletionRequests = programs.map(program => (
      {
        DeleteRequest : {
          Key : {
            active: 1,
            endTime: program.endTime
          }
        }
      }
    ));

    while (allDeletionRequests.length > 0) {
      // `batchWrite` can only handle 25 items at a time
      const deletionBatch = allDeletionRequests.splice(0, 25);

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
        console.log(`found ${data.Items.length} stale programs`);
        resolve(data.Items);
      }
    });
  });
}
