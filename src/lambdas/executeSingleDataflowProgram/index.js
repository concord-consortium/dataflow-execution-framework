const AWS = require('aws-sdk');
const dynamoDocClient = new AWS.DynamoDB.DocumentClient();
var runDataflowProgram = require('./dataflow-engine-runner');

/**
 * Executes a single dataflow program, given both a program definiton (as JSON or an object) and
 * an object representing sensor values.
 *
 * Saves all data-storage nodes to dataflow-data DynamoDB table
 *
 * @param {string} event.program.programId Unique ID of the program run
 * @param {JSON | object} event.program.program Rete network to run
 * @param {object} event.sensorData Map of sensor name keys and sensor values
 * @param {number} event.dataSaveTime Timestamp of next time data should be saved
 */
exports.handler = async (event) => {

  // run this for a single program
  const programId = event.program.programId;
  const programJSON = event.program.program;
  const sensorData = event.sensorData || {};

  if (!programId || !programJSON) {
    throw new Error("No program JSON or program id.");
  }

  const programDef = typeof programJSON === "string" ? JSON.parse(programJSON) : programJSON;

  const result = await runDataflowProgram(programDef, sensorData);

  console.log(result, programId);

  if (!result.success) {
    console.error("Failed to run program: ", programId);
  }

  if (result.savedNodeValues.length && Date.now() > event.dataSaveTime) {
    await recordDataToTable(programId, result.savedNodeValues);
  }
};

async function recordDataToTable(programId, nodeValues) {
  return new Promise((resolve, reject) => {
    const blockIds = nodeValues.map(d => d.node);
    const values = nodeValues.map(d => d.value * 1) // cast to ensure all numbers
    const params = {
      TableName: "dataflow-data",
      Item: {
        "programId": programId,
        "time": Date.now(),
        "blockIds": blockIds,
        "values": values
      }
    };
    dynamoDocClient.put(params, function(err, data) {
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
