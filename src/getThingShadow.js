console.log('Loading function');

var config = {
    "thingName": '355aaff3-1b00-493a-b2ba-1df3673d7e73',
    "endpointAddress": "a2zxjwmcl3eyqd-ats.iot.us-east-1.amazonaws.com"
}

var AWS = require('aws-sdk');
var iotdata = new AWS.IotData({endpoint: config.endpointAddress});

exports.handler = function(event, context) {
    console.log('Received event:', JSON.stringify(event, null, 2));
    iotdata.getThingShadow({
        thingName: config.thingName
    }, function(err, data) {
        if (err) {
            context.fail(err);
        } else {
            console.log(data);
        }
    });
};