const { Given, Then, When } = require('@cucumber/cucumber')
const { ExploreDestinationPage } = require('../Pages/explore_destination.page')

Given('the user sees the list of destination cards', async function () {
  this.exploreDestinationPage = new ExploreDestinationPage(this.page)
  await this.exploreDestinationPage.openExplore()
})

When('the destination list is displayed', async function () {
  await this.exploreDestinationPage.waitForDestinationList()
})

Then('the destinations are shown as cards', async function () {
  await this.exploreDestinationPage.assertDestinationsAreCards()
})

Then('at least one destination card is visible', async function () {
  await this.exploreDestinationPage.assertAtLeastOneCardIsVisible()
})

Then('no error message is displayed', async function () {
  await this.exploreDestinationPage.assertNoErrorMessage()
})

Then('every card shows the destination name', async function () {
  await this.exploreDestinationPage.assertEveryCardShowsName()
})

Then('every card shows the category', async function () {
  await this.exploreDestinationPage.assertEveryCardShowsCategory()
})

Then('every card shows the district', async function () {
  await this.exploreDestinationPage.assertEveryCardShowsDistrict()
})

Given('a destination has an image', async function () {
  await this.exploreDestinationPage.selectDestinationWithImage()
})

Given('a destination does not have an image', async function () {
  await this.exploreDestinationPage.selectDestinationWithoutImage()
})

When('the user looks at the card of that destination', async function () {
  await this.exploreDestinationPage.focusSelectedCard()
})

Then('the card shows the image', async function () {
  await this.exploreDestinationPage.assertSelectedCardShowsImage()
})

Then('the image is not broken or stretched', async function () {
  await this.exploreDestinationPage.assertSelectedImageIsNotBrokenOrStretched()
})

Then('the card shows a placeholder instead of an image', async function () {
  await this.exploreDestinationPage.assertSelectedCardShowsPlaceholder()
})

Then('no broken image icon is displayed', async function () {
  await this.exploreDestinationPage.assertSelectedCardHasNoBrokenImageIcon()
})

Then('the card layout is the same as the other cards', async function () {
  await this.exploreDestinationPage.assertSelectedCardLayoutMatchesOtherCards()
})

Then('the card still shows the name, category, and district', async function () {
  await this.exploreDestinationPage.assertSelectedCardShowsDetails()
})

When('the user clicks the first destination card', async function () {
  await this.exploreDestinationPage.openFirstDestination()
})

Then('the detail page of that destination opens', async function () {
  await this.exploreDestinationPage.assertDestinationDetailIsOpen()
})

Then('the detail page shows the same destination name as the card', async function () {
  await this.exploreDestinationPage.assertDetailNameMatchesCard()
})
