import { test, expect } from '../../fixtures/pages';
import { users, checkoutInfo, products } from '../../fixtures/test-data';

test.describe('Checkout flow', () => {
  test.beforeEach(async ({ loginPage, page }) => {
    await loginPage.goto();
    await loginPage.login(users.standard.username, users.standard.password);
    await expect(page).toHaveURL(/inventory.html/);
  });

  test('completes checkout with one product', async ({
    inventoryPage,
    cartPage,
    checkoutStepOnePage,
    checkoutStepTwoPage,
    checkoutCompletePage,
  }) => {
    await inventoryPage.addProductToCart(products.backpack);
    await expect(inventoryPage.cartBadge).toHaveText('1');

    await inventoryPage.goToCart();
    await expect(cartPage.cartItems).toHaveCount(1);

    await cartPage.checkout();
    await checkoutStepOnePage.fillInformation(
      checkoutInfo.firstName,
      checkoutInfo.lastName,
      checkoutInfo.postalCode
    );
    await checkoutStepOnePage.continueToStepTwo();

    await expect(checkoutStepTwoPage.cartItems).toHaveCount(1);
    await checkoutStepTwoPage.finish();

    await expect(checkoutCompletePage.completeHeader).toHaveText('Thank you for your order!');
  });

  test('completes checkout with multiple products', async ({
    inventoryPage,
    cartPage,
    checkoutStepOnePage,
    checkoutStepTwoPage,
    checkoutCompletePage,
  }) => {
    await inventoryPage.addProductToCart(products.backpack);
    await inventoryPage.addProductToCart(products.bikeLight);
    await expect(inventoryPage.cartBadge).toHaveText('2');

    await inventoryPage.goToCart();
    await expect(cartPage.cartItems).toHaveCount(2);

    await cartPage.checkout();
    await checkoutStepOnePage.fillInformation(
      checkoutInfo.firstName,
      checkoutInfo.lastName,
      checkoutInfo.postalCode
    );
    await checkoutStepOnePage.continueToStepTwo();
    await checkoutStepTwoPage.finish();

    await expect(checkoutCompletePage.completeHeader).toHaveText('Thank you for your order!');
  });

  test('shows an error when postal code is missing', async ({
    inventoryPage,
    cartPage,
    checkoutStepOnePage,
  }) => {
    await inventoryPage.addProductToCart(products.backpack);
    await inventoryPage.goToCart();
    await cartPage.checkout();

    await checkoutStepOnePage.fillInformation(checkoutInfo.firstName, checkoutInfo.lastName, '');
    await checkoutStepOnePage.continueToStepTwo();

    await expect(checkoutStepOnePage.errorMessage).toContainText('Postal Code is required');
  });
});
