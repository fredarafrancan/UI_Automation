const { Given, setDefaultTimeout, Then, When } = require('@cucumber/cucumber')
const { SaveDestinationPage } = require('../Pages/save_destination.page')

setDefaultTimeout(30_000)

Given('the user is on the Explore page', async function () {
  this.saveDestinationPage = new SaveDestinationPage(this.page)
  await this.saveDestinationPage.openExplore()
})

When('the user saves the first {int} destinations', async function (destinationCount) {
  await this.saveDestinationPage.saveFirstDestinations(destinationCount)
})

Then('the first {int} destinations are saved and displayed on the Saved page', async function (destinationCount) {
  await this.saveDestinationPage.assertDestinationsAreSaved(destinationCount)
})