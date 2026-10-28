const languageSettings = {
  English: { code: 'en', heading: 'Profile' },
  Indonesia: { code: 'id', heading: 'Profil' },
}

class ProfilePage {
  constructor(page) {
    this.page = page
    this.profileLink = page.getByRole('link', { name: /^Profil$/i })
  }

  async openHome() {
    await this.page.goto(process.env.BASE_URL || 'https://samosirgo.web.id/', {
      waitUntil: 'domcontentloaded',
    })
    await this.profileLink.waitFor({ state: 'visible' })
  }

  async openProfile() {
    await this.profileLink.click()
    await this.page.waitForURL('**/profile')
  }

  async selectLanguage(language) {
    const settings = languageSettings[language]
    if (!settings) {
      throw new Error(`Unsupported preferred language: ${language}`)
    }

    await this.page.getByRole('button', { name: language, exact: true }).click()
    await this.page.getByRole('heading', { name: settings.heading, exact: true }).waitFor()
  }

  async assertLanguageSelected(language) {
    const settings = languageSettings[language]
    if (!settings) {
      throw new Error(`Unsupported preferred language: ${language}`)
    }

    const languageButton = this.page.getByRole('button', { name: language, exact: true })
    const isSelected = await languageButton.getAttribute('aria-pressed')
    if (isSelected !== 'true') {
      throw new Error(`${language} is not marked as the selected language`)
    }

    await this.page.getByRole('heading', { name: settings.heading, exact: true }).waitFor()
  }
}

module.exports = { ProfilePage }