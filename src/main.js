const Greeting = require('./actions/greeting')
const CheckIfMoreThanOneModuleIsBeingSubmitted = require('./actions/multiple-module-warning')

module.exports = (robot) => {
  // Your code here
  console.log('Yay, the app was loaded!')

	
	robot.on('issues.opened', Greeting)
	robot.on('pull_request.opened', CheckIfMoreThanOneModuleIsBeingSubmitted)

  // For more information on building apps:
  // https://probot.github.io/docs/

  // To get your app running against GitHub, see:
  // https://probot.github.io/docs/development/
}
