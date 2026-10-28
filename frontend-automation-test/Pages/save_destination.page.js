class SaveDestinationPage {
  constructor(page) {
    this.page = page
    this.destinationCards = page.locator('a[href^="/destination/"]')
    this.savedDestinationHrefs = []
  }

  async openExplore() {
    const baseUrl = (process.env.BASE_URL || 'https://samosirgo.web.id').replace(/\/$/, '')
    await this.page.goto(`${baseUrl}/explore`, { waitUntil: 'domcontentloaded' })
    await this.destinationCards.first()
      .getByRole('button', { name: 'Save destination', exact: true })
      .waitFor({ state: 'visible' })
  }

  async saveFirstDestinations(destinationCount) {
    const availableDestinationCount = await this.destinationCards.count()
    if (availableDestinationCount < destinationCount) {
      throw new Error(
        `Expected at least ${destinationCount} destinations on Explore, but found ${availableDestinationCount}`,
      )
    }

    this.savedDestinationHrefs = []
    for (let index = 0; index < destinationCount; index += 1) {
      const destinationCard = this.destinationCards.nth(index)
      const href = await destinationCard.getAttribute('href')
      if (!href) {
        throw new Error(`Destination ${index + 1} does not have a link`)
      }

      await destinationCard
        .getByRole('button', { name: 'Save destination', exact: true })
        .click()
      this.savedDestinationHrefs.push(href)
    }
  }

  async assertDestinationsAreSaved(expectedDestinationCount) {
    if (this.savedDestinationHrefs.length !== expectedDestinationCount) {
      throw new Error(
        `Expected ${expectedDestinationCount} saved destinations, but attempted ${this.savedDestinationHrefs.length}`,
      )
    }

    const baseUrl = (process.env.BASE_URL || 'https://samosirgo.web.id').replace(/\/$/, '')
    await this.page.goto(`${baseUrl}/saved`, { waitUntil: 'domcontentloaded' })
    for (const href of this.savedDestinationHrefs) {
      await this.page.locator(`a[href="${href}"]`).waitFor({ state: 'visible' })
    }
  }
}

module.exports = { SaveDestinationPage }