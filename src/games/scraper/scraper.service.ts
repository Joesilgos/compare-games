import { Injectable, Logger } from '@nestjs/common';
import { chromium, Browser, Page } from 'playwright';

@Injectable()
export class ScraperService {
  private readonly logger = new Logger(ScraperService.name);

  async getHowLongToBeatData(gameTitle: string): Promise<any | null> {
    let browser: Browser | null = null;
    try {
      this.logger.log(
        `Launching browser to scrape HowLongToBeat for: ${gameTitle}`,
      );
      // Launch browser - ensure chromium path is correct or rely on default installation
      browser = await chromium.launch({
        headless: true, // Run in headless mode
        args: ['--no-sandbox', '--disable-setuid-sandbox'], // Necessary arguments for running in some environments like Docker
      });
      const page: Page = await browser.newPage();

      this.logger.log(`Navigating to HowLongToBeat.com`);
      await page.goto('https://howlongtobeat.com/');

      // Search for the game
      this.logger.log(`Searching for game: ${gameTitle}`);
      await page.locator('input[name="q"]').type(gameTitle);
      // Wait for search results to appear - HLTB uses dynamic loading
      // We might need a more robust way, like waiting for a specific element containing results
      await page.waitForSelector('div[class*="search_list_details"]', {
        timeout: 10000,
      }); // Wait for results container

      // Try to find the first result that closely matches the title
      // HLTB search results can be tricky, this is a basic approach
      const firstResultLink = page
        .locator('div[class*="search_list_details"] h3 a')
        .first();
      const resultTitle = await firstResultLink.textContent();
      this.logger.log(`Found potential match: ${resultTitle}`);

      // Basic check if the result title seems relevant (can be improved)
      if (
        !resultTitle ||
        !resultTitle
          .toLowerCase()
          .includes(gameTitle.toLowerCase().substring(0, 5))
      ) {
        this.logger.warn(
          `No close match found for ${gameTitle} on HowLongToBeat.`,
        );
        await browser.close();
        return null;
      }

      // Click the first result link
      this.logger.log(`Navigating to game page: ${resultTitle}`);
      await firstResultLink.click();
      await page.waitForNavigation({ waitUntil: 'domcontentloaded' }); // Wait for game page to load

      // Extract playtime data
      this.logger.log(`Extracting playtime data`);
      const playtimeData = {};
      const playtimeElements = page.locator(
        'div[class*="GameStats_game_times"] ul li',
      );
      const count = await playtimeElements.count();

      for (let i = 0; i < count; i++) {
        const element = playtimeElements.nth(i);
        const categoryElement = element.locator('h5');
        const timeElement = element.locator('div');

        const category = await categoryElement.textContent();
        const time = await timeElement.textContent();

        if (category && time) {
          playtimeData[category.trim()] = time.trim();
        }
      }

      this.logger.log(
        `Successfully scraped data: ${JSON.stringify(playtimeData)}`,
      );
      await browser.close();
      return playtimeData;
    } catch (error) {
      this.logger.error(
        `Error scraping HowLongToBeat for ${gameTitle}: ${error.message}`,
        error.stack,
      );
      if (browser) {
        await browser.close();
      }
      return null; // Return null or throw error based on desired handling
    }
  }
}
