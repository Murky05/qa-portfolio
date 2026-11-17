import { test, expect } from "../fixtures";
import negativeCases from "../data/login-negative.json";

test.describe("Login", () => {
  test("TC-01 valid credentials open the products page", async ({
    loginPage,
    inventoryPage,
  }) => {
    await loginPage.goto();
    await loginPage.login("standard_user", "secret_sauce");
    await expect(inventoryPage.title).toHaveText("Products");
    await expect(loginPage.page).toHaveURL(/inventory/);
  });

  for (const row of negativeCases) {
    test(`${row.id} shows expected error`, async ({ loginPage }) => {
      await loginPage.goto();
      await loginPage.login(row.username, row.password);
      await expect(loginPage.error).toBeVisible();
      await expect(loginPage.error).toContainText(row.expectedError);
    });
  }

  test("TC-06 logged-in user can logout", async ({ loggedInPage, loginPage }) => {
    await loggedInPage.logout();
    await expect(loginPage.loginButton).toBeVisible();
  });
});
