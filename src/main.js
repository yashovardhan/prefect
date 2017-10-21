const Greeting = require('./actions/greeting')
const createScheduler = require('probot-scheduler')
const Stale = require('./actions/stale')

module.exports = (robot) => {
  // Your code here
  console.log('Yay, the app was loaded!')

  robot.on('issues.opened', Greeting)
  const scheduler = createScheduler(robot)

// Unmark stale issues if a user comments
  const staleEvents = [
    'issue_comment',
    'issues',
    'pull_request',
    'pull_request_review',
    'pull_request_review_comment'
  ]

  robot.on(staleEvents, unmark)
  robot.on('schedule.repository', markAndSweep)

  async function unmark (context) {
    if (!context.isBot) {
      const stale = await forRepository(context)
      let issue = context.payload.issue || context.payload.pull_request

      // Some payloads don't include labels
      if (!issue.labels) {
        issue = (await context.github.issues.get(context.issue())).data
      }

      const staleLabelAdded = context.payload.action === 'labeled' &&
        context.payload.label.name === stale.config.staleLabel

      if (stale.hasStaleLabel(issue) && issue.state !== 'closed' && !staleLabelAdded) {
        stale.unmark(issue)
      }
    }
  }

  async function markAndSweep (context) {
    const stale = await forRepository(context)
    if (stale.config.perform) {
      return stale.markAndSweep()
    }
  }

  async function forRepository (context) {
    return new Stale(context.github, context.repo({logger: robot.log}))
  }
}
