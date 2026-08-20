import { test, expect } from '../../fixtures/pages';
import { users, invalidUser, loginErrors } from '../../fixtures/test-data';

test.describe('Login page', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('logs in successfully with valid standard-user credentials', async ({
    loginPage,
    inventoryPage,
    page,
  }) => {
    await loginPage.login(users.standard.username, users.standard.password);

    await expect(page).toHaveURL(/inventory.html/);
    await expect(inventoryPage.inventoryList).toBeVisible();
  });

  test('shows an error for an unknown username/password combination', async ({ loginPage, page }) => {
    await loginPage.login(invalidUser.username, invalidUser.password);

    await expect(loginPage.errorMessage).toHaveText(loginErrors.invalidCredentials);
    await expect(page).toHaveURL(/saucedemo\.com\/?$/);
  });

  test('shows an error for a locked-out user', async ({ loginPage }) => {
    await loginPage.login(users.lockedOut.username, users.lockedOut.password);

    // INTENTIONALLY WRONG — demo of a failing assertion / branch protection ruleset test, revert before merging.
    await expect(loginPage.errorMessage).toHaveText('This assertion is intentionally wrong');
  });

  test('shows an error when the username is missing', async ({ loginPage }) => {
    await loginPage.login('', users.standard.password);

    await expect(loginPage.errorMessage).toHaveText(loginErrors.usernameRequired);
  });

  test('shows an error when the password is missing', async ({ loginPage }) => {
    await loginPage.login(users.standard.username, '');

    await expect(loginPage.errorMessage).toHaveText(loginErrors.passwordRequired);
  });

  test('shows an error when both fields are empty', async ({ loginPage }) => {
    await loginPage.login('', '');

    await expect(loginPage.errorMessage).toHaveText(loginErrors.usernameRequired);
  });

  test('allows dismissing the error message', async ({ loginPage }) => {
    await loginPage.login(invalidUser.username, invalidUser.password);
    await expect(loginPage.errorMessage).toBeVisible();

    await loginPage.dismissError();

    await expect(loginPage.errorMessage).toBeHidden();
  });
});
