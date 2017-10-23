const Greeting = require('./actions/greeting')
const getComment = require('./actions/pr-template')
const defaultConfig = require('./actions/pr-template')
// const unchanged = require

module.exports = (robot) => {
  // Your code here
  console.log('Yay, the app was loaded!')

  robot.on('issues.opened', Greeting)
  robot.on(['pull_request.opened', 'issues.opened'], receive)
  async function receive (context) {
    let title
    let body
    let badTitle
    let user

    let eventSrc = 'issue'
    if (context.payload.pull_request) {
      ({title, body, user} = context.payload.pull_request)
      eventSrc = 'pullRequest'
    } else {
      ({title, body, user} = context.payload.issue)
    }

    try {
      const config = await context.config('config.yml', defaultConfig)

      if (!config.requestInfoOn[eventSrc]) {
        return
      }

      if (config.requestInfoDefaultTitles) {
        if (config.requestInfoDefaultTitles.includes(title.toLowerCase())) {
          badTitle = true
        }
      }

      let notExcludedUser = true
      if (config.requestInfoUserstoExclude) {
        if (config.requestInfoUserstoExclude.includes(user.login)) {
          notExcludedUser = false
        }
      }
      if ((!body || badTitle) && notExcludedUser) {
        const comment = getComment(config.requestInfoReplyComment, defaultConfig.requestInfoReplyComment)
        context.github.issues.createComment(context.issue({body: comment}))

        if (config.requestInfoLabelToAdd) {
            // Add label if there is one listed in the yaml file
          context.github.issues.addLabels(context.issue({labels: [config.requestInfoLabelToAdd]}))
        }
      }
    } catch (err) {
      if (err.code !== 404) {
        throw err
      }
    }
  }
}
