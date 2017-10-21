
module.exports = async function (context) {
	const params = context.issue({body: 'Hello World!'})

	// Post a comment on the issue
	return context.github.issues.createComment(params);
	
}
