import copy from '../../src/data/site-settings.json';
import { test, expect } from '@playwright/test';

test('article categories lead to a filtered list and can be cleared', async ({ page }) => {
  await page.goto('/en/tin-tuc/quy-trinh-gia-cong-cnc-5-truc');
  await page.locator('.category-list a[aria-current]').click();
  await expect(page).toHaveURL(/category=/);
  await expect(page.locator('.news-filter')).toBeVisible();
  await expect(page.locator('.news-card')).toHaveCount(1);
  await page.locator('.news-filter button').click();
  await expect(page.locator('.news-card')).toHaveCount(6);
});

test('newsletter submits a consented request and reports server failure honestly', async ({
  page,
}) => {
  await page.goto('/en/tin-tuc/quy-trinh-gia-cong-cnc-5-truc');
  await page.route('**/api/contact', async (route) => {
    const body = route.request().postDataJSON();
    expect(body.email).toBe('visual-check@example.test');
    expect(body.consent).toBe(true);
    expect(body.subject).toBe(copy.newsletter.requestSubject);
    await route.fulfill({
      status: 503,
      contentType: 'application/json',
      body: JSON.stringify({ code: 'UNAVAILABLE' }),
    });
  });
  const widget = page.locator('.newsletter-box');
  await widget.getByRole('textbox').fill('visual-check@example.test');
  await widget.getByRole('button').click();
  await expect(widget.getByRole('status')).toHaveText(copy.forms.failure);
  await expect(widget.getByRole('textbox')).toHaveValue('visual-check@example.test');
  await page.unroute('**/api/contact');
  await page.route('**/api/contact', (route) =>
    route.fulfill({ status: 201, contentType: 'application/json', body: '{"ok":true}' }),
  );
  await widget.getByRole('button').click();
  await expect(widget.getByRole('status')).toContainText(copy.newsletter.success);
  await expect(widget.getByRole('textbox')).toBeEmpty();
});

test('the services page lists service groups, each with its own page, process and metrics', async ({
  page,
}) => {
  await page.goto('/dich-vu');
  const cards = page.locator('.service-group-card');
  await expect(cards).toHaveCount(2);
  await expect(cards.first().locator('.service-group-features li')).toHaveCount(4);
  await cards.first().locator('.service-group-cta').click();
  await expect(page).toHaveURL(/\/dich-vu\/nhom\//);
  await expect(page.locator('.page-banner nav [aria-current="page"]')).toBeVisible();
  await expect(page.locator('.service-card').first()).toBeVisible();
  await expect(page.locator('.process-step-card')).toHaveCount(4);
  await expect(page.locator('.metrics-strip > div')).toHaveCount(3);
});

test('the footer shows the CMS logo in the first column', async ({ page }) => {
  await page.goto('/');
  const logo = page.locator('.footer-brand .footer-logo img');
  await expect(logo).toBeVisible();
  expect(await logo.evaluate((el: HTMLImageElement) => el.naturalWidth)).toBeGreaterThan(0);
});

test('the home hero matches the redesign: yellow lead, two buttons, no stats', async ({ page }) => {
  await page.goto('/');
  const hero = page.locator('.home-hero');
  await expect(hero.locator('.hero-stats')).toHaveCount(0);
  const slide = hero.locator('.hero-slide').first();
  await expect(slide.locator('.hero-lead')).toBeVisible();
  await expect(slide.locator('.hero-button')).toHaveCount(2);
  await expect(slide.locator('.hero-button.ghost')).toBeVisible();
  const box = await slide.locator('h1').boundingBox();
  expect(Math.round(box!.x)).toBe(32);
  const lead = await slide.locator('.hero-lead').evaluate((el) => getComputedStyle(el).color);
  expect(lead).toBe('rgb(241, 223, 87)');
});
