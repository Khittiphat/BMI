import { test, expect } from '@playwright/test';

const generateRandomUser = () => {
  const timestamp = Date.now();
  return {
    username: `user_${timestamp}`,
    password: 'password123',
  };
};

test.describe('BMI App E2E Tests', () => {
  
  // Case 1: Protected Route
  test('should redirect unauthenticated user to login page when accessing dashboard', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/login/);
  });

  // Case 2: Register
  test('should register a new user successfully', async ({ page }) => {
    const user = generateRandomUser();
    
    await page.goto('/register');
    await page.fill('input[name="username"]', user.username);
    await page.fill('input[name="password"]', user.password);
    await page.fill('input[name="confirmPassword"]', user.password);
    await page.click('button[type="submit"]');

    // Should redirect to login page
    await expect(page).toHaveURL(/\/login/);
  });

  // Case 3: Login
  test('should login successfully with valid credentials', async ({ page }) => {
    const user = generateRandomUser();
    
    // Register first (setup)
    await page.goto('/register');
    await page.fill('input[name="username"]', user.username);
    await page.fill('input[name="password"]', user.password);
    await page.fill('input[name="confirmPassword"]', user.password);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/login/);

    // Login
    await page.fill('input[name="username"]', user.username);
    await page.fill('input[name="password"]', user.password);
    await page.click('button[type="submit"]');

    // Should redirect to dashboard
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.locator('h1')).toContainText('BMI Dashboard');
  });

  // Case 4: Add BMI Record
  test('should add a new BMI record', async ({ page }) => {
    const user = generateRandomUser();
    
    // Register & Login
    await page.goto('/register');
    await page.fill('input[name="username"]', user.username);
    await page.fill('input[name="password"]', user.password);
    await page.fill('input[name="confirmPassword"]', user.password);
    await page.click('button[type="submit"]');
    
    await page.fill('input[name="username"]', user.username);
    await page.fill('input[name="password"]', user.password);
    await page.click('button[type="submit"]');

    // Add BMI
    await page.fill('input[name="weight"]', '70');
    await page.fill('input[name="height"]', '175');
    await page.click('button[type="submit"]');

    // Verify record in history
    await expect(page.locator('text=BMI: 22.9')).toBeVisible(); // 70 / (1.75 * 1.75) = 22.857... -> 22.9
  });

  // Case 5: Logout
  test('should logout successfully', async ({ page }) => {
    const user = generateRandomUser();
    
    // Register & Login
    await page.goto('/register');
    await page.fill('input[name="username"]', user.username);
    await page.fill('input[name="password"]', user.password);
    await page.fill('input[name="confirmPassword"]', user.password);
    await page.click('button[type="submit"]');
    
    await page.fill('input[name="username"]', user.username);
    await page.fill('input[name="password"]', user.password);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/dashboard/);

    // Logout
    await page.click('button:has-text("Logout")'); // Assuming there is a logout button with text "Logout"
    
    // Should redirect to login or home
    await expect(page).toHaveURL(/\/login/);
    
    // Verify cannot access dashboard
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/login/);
  });

});
