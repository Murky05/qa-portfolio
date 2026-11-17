import { test, expect } from "../fixtures";

test.describe("Checkout", () => {
  test("TC-04 complete checkout with valid details", async ({
    loggedInPage,
    cartPage,
    checkoutPage,
  }) => {
    await loggedInPage.addToCart("Sauce Labs Fleece Jacket");
    await loggedInPage.cartLink.click();
    await cartPage.checkout();
    await checkoutPage.fillInfo("Vikhyat", "Choudhary", "560001");
    await checkoutPage.continue();
    await expect(checkoutPage.summaryTotal).toBeVisible();
    await checkoutPage.finish();
    await expect(checkoutPage.completeHeader).toHaveText("Thank you for your order!");
  });

  test("TC-05 checkout validation for missing fields", async ({
    loggedInPage,
    cartPage,
    checkoutPage,
  }) => {
    await loggedInPage.addToCart("Sauce Labs Onesie");
    await loggedInPage.cartLink.click();
    await cartPage.checkout();
    await checkoutPage.continue();
    await expect(checkoutPage.error).toContainText("First Name is required");
  });
});
