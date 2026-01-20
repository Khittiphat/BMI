import { test, expect } from '@playwright/test';

const generateRandomUser = () => {
  const timestamp = Date.now();
  return {
    username: `ui_test_${timestamp}`,
    password: 'password123',
  };
};

test.describe('UI Testing Focus Scenarios', () => {
  
  // Scenario 1: Login UI
  test('Login UI Flow', async ({ page }) => {
    // Setup: Create a user first (so we can log in)
    const user = generateRandomUser();
    await page.goto('/register');
    await page.fill('input[name="username"]', user.username);
    await page.fill('input[name="password"]', user.password);
    await page.fill('input[name="confirmPassword"]', user.password);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/login/);

    // --- Start of Login UI Test ---
    await page.goto('/login');
    
    // Check UI Elements
    await expect(page.locator('h2')).toContainText('Sign in to your account');
    await expect(page.locator('input[name="username"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();

    // Perform Login
    await page.fill('input[name="username"]', user.username);
    await page.fill('input[name="password"]', user.password);
    await page.click('button[type="submit"]');

    // Verify Success
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.locator('text=Welcome')).toBeVisible();
  });

  // Scenario 2: Weight Input (Add BMI)
  test('Weight Input & Calculation UI', async ({ page }) => {
    // Setup: Create User & Login
    const user = generateRandomUser();
    await page.goto('/register');
    await page.fill('input[name="username"]', user.username);
    await page.fill('input[name="password"]', user.password);
    await page.fill('input[name="confirmPassword"]', user.password);
    await page.click('button[type="submit"]');
    
    await page.fill('input[name="username"]', user.username);
    await page.fill('input[name="password"]', user.password);
    await page.click('button[type="submit"]');

    // --- Start of Weight Input UI Test ---
    // Check Form UI
    await expect(page.locator('h2:has-text("Calculate BMI")')).toBeVisible();
    await expect(page.locator('input[name="weight"]')).toBeVisible();
    await expect(page.locator('input[name="height"]')).toBeVisible();

    // Test Input Validation (Empty Submit)
    // Note: Browser validation might block submit, or server side. 
    // Let's test valid input.
    
    // Input Weight and Height
    await page.fill('input[name="weight"]', '80');
    await page.fill('input[name="height"]', '180');
    
    // Submit
    await page.click('button:has-text("Calculate & Save")');

    // Verify Result UI
    // 80 / (1.80 * 1.80) = 24.69
    await expect(page.locator('text=BMI: 24.7')).toBeVisible();
    await expect(page.locator('text=80 kg')).toBeVisible();
  });

});
