
module.exports = async function (context) {
	
	const labels = context.payload.issue.labels.reduce((arr, el)=>{return arr.concat(el.name)}, [])
	.filter((label)=>{return label.startsWith('MODULE')})
	
	
	if(labels.length > 1) {
		let warning = `## Whoops!

	It looks like you're trying to submit multiple modules in this PR.
	Please split each module submission into its own PR. It makes reviewing them
	much easier for us and we'll be able to give you better feedback.

	---
	Am I acting strange? Please report any erroneous activity to my repo: REPOURL
	`		
		const params = context.issue({body: warning})
		
		
		// Close the issue
		context.github.issues.edit(context.issue({state: 'closed'}));

		// Post a comment on the issue
		return context.github.issues.createComment(params);
	}
	
	
}
