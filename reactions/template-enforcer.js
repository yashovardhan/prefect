const configFileName = 'template-enforcer.yml';
const defaultMarker = 'Please remove this before submitting.';
const defaultResponse = "Hi there, it looks like you haven't followed the template completely." +
    "Please re-read the template and make any nessasary edits," + 
    "this will help our the team a bunch!";

module.exports = robot => {
    robot.on('issues.opened', enforceTemplate);
    robot.on('pull_request.opened', enforceTemplate);

    async function enforceTemplate(context) {
        robot.log('template-enforcer: new issue');
        
        let body;
        ({body} = context.payload.issue);

        let config;
        let complianceMarker;
        try {
            config = await context.config(configFileName);
            complianceMarker = config.complianceMarker.trim() || defaultMarker;
        } catch (err) {
            throw err;
        }
        
        if (complianceMarker && body.trim().endsWith(complianceMarker.toString())) {
            // The issue body contains the token, so we assume they've not read or
            // followed the template properly.
            robot.log('template-enforcer: issue bad');
            
            let response;
            try {
                const issueComment = context.issue({
                    body: config.response || defaultResponse
                });

                context.github.issues.createComment(issueComment);
            } catch (err) {
                if (err != 404) {
                    throw err;
                }
            }
        } else {
            robot.log('template-enforcer: issue ok');
        }
    }
};
