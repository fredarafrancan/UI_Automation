class ExploreDestinationPage {
  constructor(page) {
    this.page = page
    this.destinationCards = page.locator('a[href^="/destination/"]')
    this.selectedCard = null
    this.selectedDestinationName = null
  }

  async openExplore() {
    const baseUrl = (process.env.BASE_URL || 'https://samosirgo.web.id').replace(/\/$/, '')
    await this.page.goto(`${baseUrl}/explore`, { waitUntil: 'domcontentloaded' })
    await this.waitForDestinationList()
  }

  async waitForDestinationList() {
    await this.destinationCards.first().waitFor({ state: 'visible' })
  }

  async assertDestinationsAreCards() {
    const count = await this.destinationCards.count()
    if (count === 0) {
      throw new Error('Expected destination cards on the Explore page, but found none')
    }

    for (let index = 0; index < count; index += 1) {
      const card = this.destinationCards.nth(index)
      const name = card.locator('h3')
      if (!(await name.isVisible())) {
        throw new Error(`Destination card ${index + 1} is missing its name heading`)
      }
    }
  }

  async assertAtLeastOneCardIsVisible() {
    const count = await this.destinationCards.count()
    if (count === 0 || !(await this.destinationCards.first().isVisible())) {
      throw new Error('Expected at least one visible destination card')
    }
  }

  async assertNoErrorMessage() {
    const visibleMessages = await this.page.locator('[role="alert"], [aria-live="assertive"]')
      .evaluateAll(elements => elements
        .filter(element => element.getClientRects().length > 0)
        .map(element => element.innerText.trim())
        .filter(Boolean))
    if (visibleMessages.length > 0) {
      throw new Error(`Expected no error message, but found: ${visibleMessages[0]}`)
    }

    const errorCopy = this.page.getByText(/^(error|failed to load|something went wrong)(:|\b)/i)
    if (await errorCopy.count() > 0 && await errorCopy.first().isVisible()) {
      throw new Error(`Expected no error message, but found: ${(await errorCopy.first().innerText()).trim()}`)
    }
  }

  async assertEveryCardShowsName() {
    const count = await this.destinationCards.count()
    for (let index = 0; index < count; index += 1) {
      const name = this.destinationCards.nth(index).locator('h3')
      if (!(await name.isVisible()) || !(await name.innerText()).trim()) {
        throw new Error(`Destination card ${index + 1} does not show a destination name`)
      }
    }
  }

  async assertEveryCardShowsCategory() {
    await this.assertEveryCardShowsTextInParagraph(1, 'category')
  }

  async assertEveryCardShowsDistrict() {
    await this.assertEveryCardShowsTextInParagraph(0, 'district')
  }

  async assertEveryCardShowsTextInParagraph(paragraphIndex, detailName) {
    const count = await this.destinationCards.count()
    for (let index = 0; index < count; index += 1) {
      const detail = this.destinationCards.nth(index).locator('p').nth(paragraphIndex)
      if (!(await detail.isVisible()) || !(await detail.innerText()).trim()) {
        throw new Error(`Destination card ${index + 1} does not show its ${detailName}`)
      }
    }
  }

  async selectDestinationWithImage() {
    const card = this.destinationCards.filter({ has: this.page.locator('img') }).first()
    if (await card.count() === 0) {
      throw new Error('No destination with an image is currently displayed on Explore')
    }

    this.selectedCard = card
    this.selectedDestinationName = (await card.locator('h3').innerText()).trim()
  }

  async selectDestinationWithoutImage() {
    const count = await this.destinationCards.count()
    for (let index = 0; index < count; index += 1) {
      const card = this.destinationCards.nth(index)
      if (await card.locator('img').count() === 0) {
        this.selectedCard = card
        this.selectedDestinationName = (await card.locator('h3').innerText()).trim()
        return
      }
    }

    throw new Error(
      `No destination without an image is currently displayed on Explore (checked ${count} cards)`,
    )
  }

  async focusSelectedCard() {
    if (!this.selectedCard) {
      throw new Error('No destination card has been selected')
    }
    await this.selectedCard.scrollIntoViewIfNeeded()
  }

  async assertSelectedCardShowsImage() {
    const image = this.selectedCard?.locator('img')
    if (!image || await image.count() === 0) {
      throw new Error('Expected the selected destination card to contain an image')
    }
    await image.waitFor({ state: 'visible' })
  }

  async assertSelectedImageIsNotBrokenOrStretched() {
    const image = this.selectedCard?.locator('img')
    if (!image || await image.count() === 0) {
      throw new Error('Expected the selected destination card to contain an image')
    }

    await image.evaluate(element => element.decode())
    const imageDetails = await image.evaluate(element => {
      const bounds = element.getBoundingClientRect()
      return {
        complete: element.complete,
        naturalWidth: element.naturalWidth,
        naturalHeight: element.naturalHeight,
        objectFit: getComputedStyle(element).objectFit,
        renderedWidth: bounds.width,
        renderedHeight: bounds.height,
      }
    })

    if (!imageDetails.complete || imageDetails.naturalWidth === 0 || imageDetails.naturalHeight === 0) {
      throw new Error('The destination image is broken or has no intrinsic dimensions')
    }
    if (imageDetails.objectFit !== 'cover' && imageDetails.objectFit !== 'contain') {
      throw new Error(`Expected the destination image to preserve its aspect ratio, found object-fit: ${imageDetails.objectFit}`)
    }
    if (imageDetails.renderedWidth === 0 || imageDetails.renderedHeight === 0) {
      throw new Error('The destination image has no rendered size')
    }
  }

  async assertSelectedCardShowsPlaceholder() {
    if (!this.selectedCard || await this.selectedCard.locator('img').count() > 0) {
      throw new Error('Expected the selected destination card to show a placeholder without an image')
    }

    const placeholder = this.selectedCard.locator(':scope > div').first()
    if (!(await placeholder.isVisible())) {
      throw new Error('Expected a visible image placeholder in the destination card')
    }

    const bounds = await placeholder.boundingBox()
    if (!bounds || bounds.width === 0 || bounds.height === 0) {
      throw new Error('The destination image placeholder has no rendered size')
    }
  }

  async assertSelectedCardHasNoBrokenImageIcon() {
    if (!this.selectedCard || await this.selectedCard.locator('img').count() > 0) {
      throw new Error('The destination card contains an image element instead of an image-free placeholder')
    }
  }

  async assertSelectedCardLayoutMatchesOtherCards() {
    if (!this.selectedCard) {
      throw new Error('No destination card has been selected')
    }

    const referenceCard = this.destinationCards.filter({ has: this.page.locator('img') }).first()
    if (await referenceCard.count() === 0) {
      throw new Error('Cannot compare the placeholder layout because no image card is available')
    }

    const selectedFrame = await this.selectedCard.locator(':scope > div').first().boundingBox()
    const referenceFrame = await referenceCard.locator(':scope > div').first().boundingBox()
    if (!selectedFrame || !referenceFrame || selectedFrame.height === 0 || referenceFrame.height === 0) {
      throw new Error('Could not measure the destination image and placeholder frames')
    }

    const selectedRatio = selectedFrame.width / selectedFrame.height
    const referenceRatio = referenceFrame.width / referenceFrame.height
    if (Math.abs(selectedRatio - referenceRatio) > 0.05) {
      throw new Error('The destination placeholder does not match the image card layout')
    }
  }

  async assertSelectedCardShowsDetails() {
    if (!this.selectedCard) {
      throw new Error('No destination card has been selected')
    }

    const name = this.selectedCard.locator('h3')
    const district = this.selectedCard.locator('p').nth(0)
    const category = this.selectedCard.locator('p').nth(1)
    for (const [label, element] of [
      ['name', name],
      ['district', district],
      ['category', category],
    ]) {
      if (!(await element.isVisible()) || !(await element.innerText()).trim()) {
        throw new Error(`The selected destination card does not show its ${label}`)
      }
    }
  }

  async openFirstDestination() {
    await this.waitForDestinationList()
    const firstCard = this.destinationCards.first()
    this.selectedDestinationName = (await firstCard.locator('h3').innerText()).trim()
    await firstCard.click()
    await this.page.waitForURL(/\/destination\/[^/]+$/)
  }

  async assertDestinationDetailIsOpen() {
    if (!this.selectedDestinationName) {
      throw new Error('No destination was selected before opening the detail page')
    }

    await this.page.getByRole('heading', { level: 1, name: this.selectedDestinationName, exact: true })
      .waitFor({ state: 'visible' })
  }

  async assertDetailNameMatchesCard() {
    const detailName = this.page.getByRole('heading', {
      level: 1,
      name: this.selectedDestinationName,
      exact: true,
    })
    if (!(await detailName.isVisible())) {
      throw new Error(`The detail page does not show the selected destination name: ${this.selectedDestinationName}`)
    }
  }
}

module.exports = { ExploreDestinationPage }
