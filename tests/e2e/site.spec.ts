import copy from '../../src/data/site-settings.json';
import { test, expect } from '@playwright/test';
import content from '../../src/data/demo.json';
const pages = [
  '/',
  '/ve-chung-toi',
  '/dich-vu',
  '/du-an',
  '/tin-tuc',
  '/lien-he',
  '/chinh-sach-bao-mat',
  '/tieu-chuan-ky-thuat',
  ...content.services.map((s) => '/dich-vu/' + s.slug),
  ...content.projects.map((s) => '/du-an/' + s.slug),
  ...content.articles.map((s) => '/tin-tuc/' + s.slug),
];
test('all pages render with unique canonical, metadata and one H1 in every language', async ({
  page,
}) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  for (const [prefix, lang] of [
    ['/en', 'en'],
    ['', 'vi'],
    ['/zh', 'zh'],
  ]) {
    for (const path of pages) {
      const url = prefix + (path === '/' && prefix ? '' : path);
      const response = await page.goto(url);
      expect(response?.status(), url).toBe(200);
      await expect(page.locator('h1'), url).toHaveCount(1);
      await expect(page.locator('html')).toHaveAttribute('lang', lang);
      if (lang === 'en')
        expect(await page.locator('main').innerText(), url + ' untranslated text').not.toMatch(
          /[ĂăÂâĐđÊêÔôƠơƯưẠ-ỹ\u4e00-\u9fff]/u,
        );
      if (lang === 'zh')
        expect(await page.locator('main').innerText(), url + ' Chinese text').toMatch(/[\u4e00-\u9fff]/u);
      await expect(page.locator('meta[name="description"]'), url).toHaveAttribute('content', /.{10,}/);
      await expect(page.locator('link[rel="canonical"]'), url).toHaveAttribute(
        'href',
        'http://localhost:3100' + (url === '/' ? '' : url),
      );
      await expect(page.locator('link[rel="alternate"][hreflang="x-default"]'), url).toHaveCount(1);
      const schemas = await page.locator('script[type="application/ld+json"]').allTextContents();
      expect(schemas.length).toBeGreaterThan(1);
      schemas.forEach((s) => expect(() => JSON.parse(s)).not.toThrow());
    }
  }
  expect(errors).toEqual([]);
});
test('language switcher keeps the current page and links stay in the chosen language', async ({
  page,
}) => {
  await page.goto('/dich-vu/production-lines');
  await page.locator('.lang-switch > button').click();
  await page.locator('.lang-menu [lang="zh"]').click();
  await expect(page).toHaveURL(/\/zh\/dich-vu\/production-lines$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'zh');
  await expect(page.locator('#primary-nav a').first()).toHaveAttribute('href', '/zh');
  await page.locator('.lang-switch > button').click();
  await page.locator('.lang-menu [lang="vi"]').click();
  await expect(page).toHaveURL(/localhost:3100\/dich-vu\/production-lines$/);
  expect((await page.goto('/vi/du-an'))?.url()).toBe('http://localhost:3100/du-an');
});
test('responsive pages have no viewport overflow, and original images load', async ({ page }) => {
  for (const width of [1280, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 900 });
    for (const path of [
      '/',
      '/ve-chung-toi',
      '/dich-vu',
      '/dich-vu/production-lines',
      '/du-an',
      '/du-an/tu-dong-hoa-day-chuyen-fdi',
      '/tin-tuc',
      '/tin-tuc/quy-trinh-gia-cong-cnc-5-truc',
      '/lien-he',
    ]) {
      await page.goto(path);
      await page.evaluate(async () => {
        for (const image of document.images) {
          image.loading = 'eager';
          await image.decode().catch(() => {});
        }
      });
      const stats = await page.evaluate(() => ({
        viewport: innerWidth,
        width: document.documentElement.scrollWidth,
        broken: [...document.images]
          .filter((i) => !i.complete || i.naturalWidth === 0)
          .map((i) => i.src),
      }));
      expect(stats.width, `${width} ${path} overflow`).toBeLessThanOrEqual(stats.viewport + 1);
      expect(stats.broken, `${width} ${path} broken images`).toEqual([]);
      if ([1280, 390].includes(width))
        await page.screenshot({
          path: `../design-reference/qa-${path === '/' ? 'home' : path.slice(1).replaceAll('/', '-')}-${width}.png`,
          fullPage: true,
        });
    }
  }
});
test('mobile menu, carousel, service FAQ, language menu and news pagination work', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/en');
  await page.getByRole('button', { name: copy.accessibility.menuOpen }).click();
  await expect(page.getByRole('navigation', { name: copy.accessibility.navigation })).toBeVisible();
  await page
    .getByRole('navigation', { name: copy.accessibility.navigation })
    .getByRole('link', { name: 'About us', exact: true })
    .click();
  await expect(page).toHaveURL(/en\/ve-chung-toi/);
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/en');
  const dots = page.locator('.hero-dots button');
  await expect(dots.first()).toHaveAttribute('aria-current', 'true');
  await page.getByRole('button', { name: copy.accessibility.nextSlide, exact: true }).click();
  await expect(dots.nth(1)).toHaveAttribute('aria-current', 'true');
  await page.getByRole('button', { name: copy.accessibility.language }).click();
  await expect(page.locator('.lang-menu').getByRole('option')).toHaveCount(3);
  await page.goto('/en/dich-vu/production-lines');
  const faq = page.locator('.faq-item button');
  await expect(faq.nth(0)).toHaveAttribute('aria-expanded', 'true');
  await faq.nth(1).click();
  await expect(faq.nth(1)).toHaveAttribute('aria-expanded', 'true');
  await expect(faq.nth(0)).toHaveAttribute('aria-expanded', 'false');
  await page.goto('/en/du-an');
  await expect(page.locator('.project-row')).toHaveCount(6);
  await page.goto('/en/tin-tuc');
  await page.getByRole('button', { name: '2', exact: true }).click();
  await expect(page.locator('.news-card')).toHaveCount(1);
  await page.locator('.news-search input').fill('no matching article xyz');
  await page.locator('.news-search').evaluate((f: HTMLFormElement) => f.requestSubmit());
  await expect(page.locator('.news-empty')).toHaveText(copy.common.noResults);
});
test('contact form stores an inquiry and rejects invalid or unauthenticated requests', async ({
  page,
  request,
}) => {
  const email = `topwell-qa-${Date.now()}@example.test`;
  await page.goto('/en/lien-he');
  await page.getByLabel(copy.forms.name, { exact: true }).fill('TOP WELL QA');
  await page.getByLabel(copy.forms.phone, { exact: true }).fill('+84 1900 8899');
  await page.getByLabel(copy.forms.email, { exact: true }).fill(email);
  await page
    .getByLabel(copy.forms.message, { exact: true })
    .fill('Integration test request for the TOP WELL contact form.');
  await page.getByLabel('Electrical').check();
  await page.getByRole('button', { name: copy.forms.submit }).click();
  await expect(page.locator('.form-message')).toContainText(copy.forms.success);
  expect((await request.post('/api/contact', { data: { name: 'X', email: 'bad' } })).status()).toBe(
    400,
  );
  expect(
    (
      await request.post('/api/contact', {
        headers: { Origin: 'https://invalid.example' },
        data: {},
      })
    ).status(),
  ).toBe(403);
  expect(
    (
      await request.post('http://localhost:1337/api/site-inquiry', { data: { name: 'X' } })
    ).status(),
  ).toBe(401);
  expect((await request.get('http://localhost:1337/api/inquiries')).status()).toBe(403);
  expect((await request.get('http://localhost:1337/api/site/inquiries')).status()).toBe(404);
});
test('SEO endpoints and unknown URLs are correct', async ({ page, request }) => {
  const sitemap = await request.get('/sitemap.xml');
  expect(sitemap.status()).toBe(200);
  const xml = await sitemap.text();
  for (const path of pages) {
    expect(xml).toContain('http://localhost:3100' + path);
    expect(xml).toContain('http://localhost:3100/zh' + (path === '/' ? '' : path));
  }
  expect((await request.get('/robots.txt')).status()).toBe(200);
  expect((await request.get('/opengraph-image')).status()).toBe(200);
  expect((await page.goto('/en/dich-vu/not-a-service'))?.status()).toBe(404);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(copy.system.notFoundTitle);
});

test('home quote form offers a calendar date picker and service list', async ({ page }) => {
  await page.route('**/api/contact', async (route) => {
    const body = route.request().postDataJSON();
    expect(body.kind).toBe('quote');
    expect(body.preferredDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    await route.fulfill({ status: 201, contentType: 'application/json', body: '{"ok":true}' });
  });
  await page.goto('/en');
  const form = page.locator('.quote-form');
  await form.getByPlaceholder(copy.forms.quoteName).fill('Quote QA');
  await form.getByPlaceholder(copy.forms.quoteEmail).fill('quote-qa@example.test');
  await expect(form.locator('select option')).not.toHaveCount(1);
  await form.getByRole('button', { name: copy.forms.quoteDate }).click();
  await page.locator('.calendar-grid button:not([disabled])').last().click();
  await form.locator('.quote-submit').click();
  await expect(form.locator('.form-message')).toContainText(copy.forms.quoteSuccess);
});
