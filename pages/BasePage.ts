import { Page } from '@playwright/test';

/**
 * Common functionality shared by all page objects.
 */
export class BasePage {
  constructor(protected readonly page: Page) {}

  /**
   * saucedemo.com occasionally resets the connection on the first request
   * (ERR_CONNECTION_RESET) under automated traffic. Retry a couple of times
   * before letting the error surface, so tests fail on real issues only.
   */
  async goto(path: string = '/') {
    const attempts = 3;
    for (let attempt = 1; attempt <= attempts; attempt++) {
      try {
        await this.page.goto(path);
        return;
      } catch (error) {
        if (attempt === attempts) throw error;
        await this.page.waitForTimeout(1000 * attempt);
      }
    }
  }

  get title() {
    return this.page.title();
  }
}
