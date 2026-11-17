import type { Locator, Page } from "@playwright/test";

export class CartPage {
  readonly page: Page;
  readonly title: Locator;
  readonly items: Locator;
  readonly checkoutButton: Locator;
  readonly continueShopping: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.locator(".title");
    this.items = page.locator(".cart_item");
    this.checkoutButton = page.locator("[data-test='checkout']");
    this.continueShopping = page.locator("[data-test='continue-shopping']");
  }

  async goto() {
    await this.page.goto("/cart.html");
  }

  itemByName(name: string) {
    return this.items.filter({ hasText: name });
  }

  async removeItem(name: string) {
    await this.itemByName(name).locator("button").click();
  }

  async checkout() {
    await this.checkoutButton.click();
  }
}
