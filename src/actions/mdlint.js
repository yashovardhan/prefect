var markdownlint = require("markdownlint");
var fetch = require("node-fetch");

module.exports = async function(context) {
  const params = context.issue();
  const files = await context.github.pullRequests.getFiles(params);

  console.log("mdlint starting");
  console.log(files);

  console.log("datas");

  console.log(files.data);

  const contents = await Promise.all(
    files.data.map(file => {
      fetch(file.raw_url).then(function(res) {
        return [file.filename, res.text()];
      });
    })
  );

  console.log(contents);

  const strings = {};

  contents.forEach(function(pair) {
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
