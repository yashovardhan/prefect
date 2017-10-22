var markdownlint = require("markdownlint");
var fetch = require("node-fetch");

module.exports = async function(context) {
  const params = context.issue();
  const files = context.github.pullRequests.getFiles(params);

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


  var options = {
    strings: contents
  };

  const lintResult = markdownlint(options, function callback(err, result) {
    if (!err) {
      return { body: result.toString() };
    }
  });

  // Post a comment on the issue
  return context.github.issues.createComment(params(lintResult));
};
