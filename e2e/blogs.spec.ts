import { baseURL } from '@/config';
import { test, expect } from '@playwright/test';



const targetUrl = `${baseURL}/blogs`;

// Description: Render Test for Blogs Page

test('goto target page', async ({ page }) => {
  await page.goto(targetUrl);
});

test('should render 4 article cards', async ({ page }) => {
  await page.goto(targetUrl);
  await page.waitForSelector('[data-testid=pw-article-card-3]');
  const articleCard = await page.$('[data-testid=pw-article-card-3]');
  expect(articleCard).not.toBeNull();
});

test('should render "New" label', async ({ page }) => {
  await page.goto(targetUrl);
  await page.waitForSelector('[data-testid=pw-new-label]');
  const label = await page.$('[data-testid=pw-new-label]');
  expect(label).not.toBeNull();
});

test('should render search bar', async ({ page }) => {
  await page.goto(targetUrl);
  await page.waitForSelector('[data-testid=pw-search-bar]');
  const pagination = await page.$('[data-testid=pw-search-bar]');
  expect(pagination).not.toBeNull();
});

test('should render category list', async ({ page }) => {
  await page.goto(targetUrl);
  await page.waitForSelector('[data-testid=pw-category-list]');
  const pagination = await page.$('[data-testid=pw-category-list]');
  expect(pagination).not.toBeNull();
});

// Description: Navigation Test for Blogs Page

test('should navigate to the first article', async ({ page }) => {
  await page.goto(targetUrl);
  await page.waitForSelector('[data-testid=pw-card-title-0]');
  await page.click('[data-testid=pw-article-card-0]');
  const url = new URL(page.url());
  expect(url.pathname).toContain('/blogs');
});

test('should navigate to category page', async ({ page }) => {
  await page.goto(targetUrl);
  await page.waitForSelector('[data-testid=pw-category-list-css]');
  await page.click('[data-testid=pw-category-list-css]');

  await page.waitForURL(`${baseURL}/blogs?category=CSS`);
  const url = new URL(page.url());
  expect(url.href).toContain('?category=CSS');
});

test('should navigate to the Zenn page', async ({ page }) => {
  await page.goto(targetUrl);
  await page.waitForSelector('[data-testid=pw-blog-type-tabs-zenn]');
  await page.click('[data-testid=pw-blog-type-tabs-zenn]');

  await page.waitForURL(`${baseURL}/blogs?blogType=zenn`);
  const url = new URL(page.url());
  expect(url.href).toContain('?blogType=zenn');
});

test('should navigate to the default page', async ({ page }) => {
  await page.goto(`${baseURL}/blogs?blogType=zenn`);
  await page.waitForSelector('[data-testid=pw-blog-type-tabs-blogs]');
  await page.click('[data-testid=pw-blog-type-tabs-blogs]');

  await page.waitForURL(targetUrl);
  const url = new URL(page.url());
  expect(url.href).toContain('/blogs');
});

// Description: Search Test for Blogs Page

test('should search articles', async ({ page }) => {
  await page.goto(targetUrl);
  await page.waitForSelector('[data-testid=pw-search-bar-input]');
  await page.fill('[data-testid=pw-search-bar-input]', 'test');
  await page.click('[data-testid=pw-search-bar-button]');

  await page.waitForURL(`${baseURL}/blogs?keyword=test`);
  const url = new URL(page.url());
  expect(url.href).toContain('?keyword=test');
});

test('should render Search State Chip', async ({ page }) => {
  await page.goto(`${baseURL}/blogs?keyword=test`);
  await page.waitForSelector('[data-testid=pw-search-chip-keyword]');
  const chip = await page.$('[data-testid=pw-search-chip-keyword]');
  expect(chip).not.toBeNull();
});

test('should render No content page', async ({ page }) => {
  await page.goto(`${baseURL}/blogs?keyword=@@@@@@@@@@@@`);
  await page.waitForSelector('[data-testid=pw-no-content-page]');
  const noContent = await page.$('[data-testid=pw-no-content-page]');
  expect(noContent).not.toBeNull();
});

test('should reset search condition', async ({ page }) => {
  await page.goto(`${baseURL}/blogs?keyword=test`);
  await page.waitForSelector('[data-testid=pw-reset-search-state]');
  await page.click('[data-testid=pw-reset-search-state]');

  await page.waitForURL(targetUrl);
  const url = new URL(page.url());
  expect(url.href).toContain('/blogs');
});

test('should search articles with category', async ({ page }) => {
  await page.goto(`${baseURL}/blogs?category=TypeScript`);
  await page.waitForSelector('[data-testid=pw-search-bar-input]');
  await page.fill('[data-testid=pw-search-bar-input]', 'API');
  await page.click('[data-testid=pw-search-bar-button]');

  await page.waitForURL(`${baseURL}/blogs?category=TypeScript&keyword=API`);
  const url = new URL(page.url());
  expect(url.href).toContain('?category=TypeScript&keyword=API');
});