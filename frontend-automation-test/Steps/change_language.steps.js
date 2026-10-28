const { After, Before, Given, Then, When } = require('@cucumber/cucumber')
const { chromium } = require('playwright')
const { ProfilePage } = require('../Pages/profile.page')

Before(async function () {
  this.browser = await chromium.launch({
    headless: false,
    channel: process.env.BROWSER_CHANNEL || 'msedge',
  })
  this.context = await this.browser.newContext()
  this.page = await this.context.newPage()
  this.profilePage = new ProfilePage(this.page)
  this.preferredLanguage = process.env.PREFERRED_LANGUAGE || 'English'
})

After(async function () {
  await this.browser?.close()
})

Given('user is on home page', async function () {
  await this.profilePage.openHome()
})

When('user clicks on profile page', async function () {
  await this.profilePage.openProfile()
})

Then('user chooses the preferred language', async function () {
  await this.profilePage.selectLanguage(this.preferredLanguage)
})

Then('the language changes according to user preference', async function () {
  await this.profilePage.assertLanguageSelected(this.preferredLanguage)
})

When('user closes the website', async function () {
  await this.page.close()
})

Then('the preferred language is saved', async function () {
  this.page = await this.context.newPage()
  this.profilePage = new ProfilePage(this.page)
  await this.profilePage.openHome()
  await this.profilePage.openProfile()
  await this.profilePage.assertLanguageSelected(this.preferredLanguage)
})