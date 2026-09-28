import copy from '../../src/data/site-settings.json';
import { test, expect } from '@playwright/test';
const CMS = (process.env.TEST_CMS_URL || 'http://localhost:1337').replace(/\/$/, '');

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

test('the home hero matches the reference: kicker, two pill buttons and the reviews row', async ({
  page,
}) => {
  await page.goto('/');
  const hero = page.locator('.home-hero');
  await expect(hero.locator('.hero-stats')).toHaveCount(0);
  const slide = hero.locator('.hero-slide').first();
  // Nhãn viết hoa nằm trên tiêu đề.
  const kicker = slide.locator('.hero-eyebrow');
  await expect(kicker).toBeVisible();
  const order = await slide.evaluate((el) => {
    const nodes = [
      ...el.querySelectorAll('.hero-eyebrow, h1, .hero-text, .hero-actions, .hero-reviews'),
    ];
    return nodes.map((n) => n.className.split(' ')[0] || n.tagName.toLowerCase());
  });
  expect(order).toEqual(['hero-eyebrow', 'h1', 'hero-text', 'hero-actions', 'hero-reviews']);
  await expect(slide.locator('.hero-button')).toHaveCount(2);
  const radius = await slide
    .locator('.hero-button')
    .first()
    .evaluate((el) => getComputedStyle(el).borderRadius);
  expect(radius).toBe('9999px');
  await expect(slide.locator('.hero-avatars img')).toHaveCount(4);
  await expect(slide.locator('.hero-stars')).toHaveText('★★★★★');
  const box = await slide.locator('h1').boundingBox();
  expect(Math.round(box!.x)).toBe(32);
});

test('the home sections use the brand yellow and drop the parts the redesign removed', async ({
  page,
}) => {
  await page.goto('/');
  // Thẻ chồng trên ảnh ghép dùng vàng thương hiệu, không còn cam (Figma 145:6898).
  const badge = page.locator('.about-badge');
  await expect(badge).toHaveCSS('background-color', 'rgb(241, 223, 87)');
  // Gạch nhãn đầu mục cũng là vàng thương hiệu.
  await expect(page.locator('.eyebrow-line.before span').first()).toHaveCSS(
    'background-color',
    'rgb(241, 223, 87)',
  );
  // Thiết kế mới bỏ khối liên hệ trong phần Giới thiệu và nhãn danh mục trên ảnh tin tức.
  await expect(page.locator('.about-contact')).toHaveCount(0);
  await expect(page.locator('.home-news-media > span')).toHaveCount(0);
  await expect(page.locator('.showcase-kicker')).toHaveCount(0);
});

test('the header menu and its dropdowns come from the CMS', async ({ page, request }) => {
  const header = (await (await request.get(`${CMS}/api/site/header?locale=vi`)).json()).data;
  const menu = header.menu as { title: string; source?: string }[];
  expect(menu.length).toBeGreaterThan(0);
  await page.goto('/');
  const items = page.locator('#primary-nav .nav-item');
  await expect(items).toHaveCount(menu.length);
  for (const [i, entry] of menu.entries()) {
    const item = items.nth(i);
    await expect(item.locator('> a')).toContainText(entry.title);
    const children = item.locator('.dropdown a');
    if (
      entry.source === 'services' ||
      entry.source === 'projects' ||
      entry.source === 'service-groups'
    )
      expect(await children.count()).toBeGreaterThan(0);
    else await expect(children).toHaveCount(0);
  }
});
