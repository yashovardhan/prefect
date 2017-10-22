var markdownlint = require("markdownlint");
var fetch = require("node-fetch");

module.exports = async function(context) {
  const params = context.issue();
  const files = context.github.pullRequests.getFiles(params);

  console.log("mdlint starting");

  const contents = await Promise.all(
    files.map(file => {
      fetch(file.raw_url).then(function(res) {
        return res.text();
      }).then(function(text){
        return [file.filename, text];
      })
    })
  );

  const strings = {};

  contents.forEach(function(pair){
    strings[pair[0]] = pair[1];
    console.log(pair);
  });

  var options = {
    strings: contents
  };

  const lintResult = markdownlint(options, function callback(err, result) {
    if (!err) {
      return { body: result.toString() };
    }
  });

  console.log(lintResult);

  // Post a comment on the issue
  return context.github.issues.createComment(params(lintResult));
};
