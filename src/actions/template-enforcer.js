const templateEnforcementMarket =
  process.env.TEMPLATE_ENFORCEMENT_MARKET ||
  "Please remove this before submitting.";

module.exports = async function(context) {
    robot.log("template-enforcer: new issue");

    let body;
    ({ body } = context.payload.issue);

    if (body.trim().endsWith(complianceMarker.toString())) {
      // The issue body contains the token, so we assume they've not read or
      // followed the template properly.
      robot.log("template-enforcer: issue bad");

      let response;
      try {
        const issueComment = context.issue({
          body:
            "It looks like you haven't followed the issue/PR template properly. " +
            "Please re-open this once you've filled in the template correctly, thanks!"
        });

        const response = context.github.issues.createComment(issueComment);

        // Now close the issue, but we can't because the github API is lacking
        // the ability to close an issue (and PR).
      } catch (err) {
        if (err != 404) {
          throw err;
        }
      }
    } else {
      robot.log("template-enforcer: issue ok");
    }
  }
};
