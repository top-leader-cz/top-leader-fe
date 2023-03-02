exports.format = function (msgs) {
  const results = {};
  for (const [id, msg] of Object.entries(msgs)) {
    results[id] = msg.defaultMessage;
    // results[id] = {
    //   string: msg.defaultMessage,
    //   comment: msg.description,
    // };
  }
  return results;
};
