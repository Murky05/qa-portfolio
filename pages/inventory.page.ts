import type { Locator, Page } from "@playwright/test";

export class InventoryPage {
  readonly page: Page;
  readonly title: Locator;
  readonly cartBadge: Locator;
  readonly cartLink: Locator;
  readonly sortSelect: Locator;
  readonly menuButton: Locator;
  readonly logoutLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.locator(".title");
    this.cartBadge = page.locator(".shopping_cart_badge");
    this.cartLink = page.locator(".shopping_cart_link");
    this.sortSelect = page.locator("[data-test='product-sort-container']");
    this.menuButton = page.locator("#react-burger-menu-btn");
    this.logoutLink = page.locator("#logout_sidebar_link");
  }

  itemByName(name: string) {
    return this.page.locator(".inventory_item").filter({ hasText: name });
  }

  async addToCart(name: string) {
    await this.itemByName(name).locator("button").click();
  }

  async removeFromCart(name: string) {
    await this.itemByName(name).locator("button").click();
  }

  async sortBy(option: string) {
    await this.sortSelect.selectOption(option);
  }

  async prices(): Promise<number[]> {
    const texts = await this.page.locator(".inventory_item_price").allTextContents();
    return texts.map((t) => Number(t.replace("$", "")));
  }

  async logout() {
    await this.menuButton.click();
    await this.logoutLink.click();
  }
}
