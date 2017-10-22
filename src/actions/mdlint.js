var markdownlint = require("markdownlint");
var fetch = require("node-fetch");

module.exports = async function(context) {
  const params = context.issue();
  const files = await context.github.pullRequests.getFiles(params);

  console.log("mdlint starting");
  console.log(files);

  console.log("datas");

  console.log(files.data);

  async function fetchOne(url) {
    let res = await fetch(url);
    return await res.text();
  }

  const contents = await Promise.all(
    files.data.map(async file => {
      return [file.filename, await fetchOne(file.raw_url)];
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
