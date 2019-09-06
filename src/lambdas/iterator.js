exports.handler = function iterator (event, context, callback) {
  let index = event.iterator.index;
  let step = event.iterator.step;
  let max = event.iterator.max;
  let StateMachineArn = event.iterator.StateMachineArn;

  index += step

  callback(null, {
    index,
    step,
    max,
    continue: index < max,
    StateMachineArn
  });
}
