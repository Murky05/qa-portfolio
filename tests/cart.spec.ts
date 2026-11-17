import { test, expect } from "../fixtures";

test.describe("Cart", () => {
  test("TC-03 add and remove items in cart", async ({
    loggedInPage,
    cartPage,
  }) => {
    await loggedInPage.addToCart("Sauce Labs Backpack");
    await loggedInPage.addToCart("Sauce Labs Bike Light");
    await expect(loggedInPage.cartBadge).toHaveText("2");

    await loggedInPage.cartLink.click();
    await expect(cartPage.title).toHaveText("Your Cart");
    await expect(cartPage.items).toHaveCount(2);

    await cartPage.removeItem("Sauce Labs Bike Light");
    await expect(cartPage.items).toHaveCount(1);
    await expect(cartPage.itemByName("Sauce Labs Backpack")).toBeVisible();
  });

  test("TC-07 sort products by price low to high", async ({ loggedInPage }) => {
    await loggedInPage.sortBy("lohi");
    const prices = await loggedInPage.prices();
    const sorted = [...prices].sort((a, b) => a - b);
    expect(prices).toEqual(sorted);
  });
});
