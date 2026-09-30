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

test('services run three levels deep, each level reusing its own layout', async ({ page }) => {
  await page.goto('/dich-vu');
  const cards = page.locator('.service-group-card');
  await expect(cards).toHaveCount(2);
  await expect(cards.first().locator('.service-group-features li')).toHaveCount(4);

  // Cấp 2: trang cha liệt kê mục con, có quy trình và dải kêu gọi.
  await cards.first().locator('.service-group-cta').click();
  await expect(page).toHaveURL(/\/dich-vu\/[^/]+$/);
  await expect(page.locator('.page-banner nav a')).toHaveCount(2);
  await expect(page.locator('.process-step-card')).toHaveCount(4);
  await expect(page.locator('.cta-bar')).toBeVisible();
  const child = page.locator('.service-card').first();
  await expect(child).toBeVisible();

  // Cấp 3: trang con dùng layout chi tiết với menu cùng cấp bên phải.
  await child.click();
  await expect(page).toHaveURL(/\/dich-vu\/[^/]+\/[^/]+$/);
  await expect(page.locator('.page-banner nav a')).toHaveCount(3);
  await expect(page.locator('.service-aside .service-menu a').first()).toBeVisible();
  await expect(page.locator('.service-intro')).toBeVisible();
});

test('the services page shows customer testimonials with a quality score', async ({ page }) => {
  await page.goto('/dich-vu');
  await expect(page.locator('.testimonial-card')).toHaveCount(3);
  await expect(page.locator('.testimonials-score-value strong')).toBeVisible();
});

test('the projects page lists wide rows without a category badge', async ({ page }) => {
  await page.goto('/du-an');
  const rows = page.locator('.project-row');
  expect(await rows.count()).toBeGreaterThan(0);
  await expect(page.locator('.project-badge')).toHaveCount(0);
  await expect(page.locator('.projects-listing .dot-badge')).toBeVisible();
  await rows.first().click();
  await expect(page.locator('.cta-bar')).toBeVisible();
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
  // Thẻ dịch vụ trang chủ không có nhãn chồng trên ảnh (Figma 127:1007, 127:1025, 127:1045).
  await expect(page.locator('.home-service-tag')).toHaveCount(0);
  const media = page.locator('.home-service-media').first();
  await expect(media).toHaveCSS('border-radius', '24px');
  await expect(media).toHaveCSS('background-color', 'rgb(23, 23, 23)');
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
    if (entry.source === 'services' || entry.source === 'projects')
      expect(await children.count()).toBeGreaterThan(0);
    else await expect(children).toHaveCount(0);
  }
});

test('the services menu is a two-tier submenu: level-2 rows with their level-3 pages', async ({
  page,
}) => {
  await page.goto('/');
  const services = page.locator('#primary-nav .nav-item').filter({ has: page.locator('.mega') });
  await services.hover();
  const rows = services.locator('.dropdown-row');
  await expect(rows).toHaveCount(2);
  await expect(rows.nth(0).locator('.dropdown-parent')).toHaveText('Thiết bị và giải pháp');
  await expect(rows.nth(0).locator('.dropdown-children a')).toHaveText([
    'Thiết bị',
    'Dây chuyền sản xuất',
    'Dự án chìa khóa trao tay',
  ]);
  await expect(rows.nth(1).locator('.dropdown-parent')).toHaveText('Phụ tùng và linh kiện');
  await expect(rows.nth(1).locator('.dropdown-children a')).toHaveText([
    'Cung cấp phụ tùng thay thế',
    'Hỗ trợ kỹ thuật & giải pháp linh kiện',
  ]);
  // Menu con theo Figma 217:341: nền #f8faff, chữ 18px đậm.
  await expect(services.locator('.mega')).toHaveCSS('background-color', 'rgb(248, 250, 255)');
  await expect(rows.nth(0).locator('.dropdown-children a').first()).toHaveCSS('font-size', '18px');
});

test('services and projects keep the layout of their level', async ({ page }) => {
  // Cấp 2 có mục con: layout trang cha.
  for (const url of ['/dich-vu/thiet-bi-va-giai-phap', '/dich-vu/phu-tung-va-linh-kien']) {
    await page.goto(url);
    await expect(page.locator('.services-listing'), url).toBeVisible();
    await expect(page.locator('.service-detail'), url).toHaveCount(0);
  }
  // Cấp 3: layout chi tiết với menu cùng cấp.
  for (const url of [
    '/dich-vu/thiet-bi-va-giai-phap/thiet-bi',
    '/dich-vu/thiet-bi-va-giai-phap/day-chuyen-san-xuat',
    '/dich-vu/thiet-bi-va-giai-phap/du-an-chia-khoa-trao-tay',
    '/dich-vu/phu-tung-va-linh-kien/cung-cap-phu-tung-thay-the',
    '/dich-vu/phu-tung-va-linh-kien/ho-tro-ky-thuat-giai-phap-linh-kien',
  ]) {
    await page.goto(url);
    await expect(page.locator('.service-detail'), url).toBeVisible();
    await expect(page.locator('.page-banner nav a'), url).toHaveCount(3);
  }
  // Dự án chưa có dự án con: layout chi tiết ngay ở cấp 2.
  for (const url of [
    '/du-an/oulide-ada-smart-warehouse',
    '/du-an/tongjun-environmental-new-materials',
  ]) {
    await page.goto(url);
    await expect(page.locator('.case-study'), url).toBeVisible();
  }
});

test('old service and project addresses redirect to the new tree', async ({ request }) => {
  for (const [from, to] of [
    ['/dich-vu/production-lines', '/dich-vu/thiet-bi-va-giai-phap/day-chuyen-san-xuat'],
    ['/dich-vu/thiet-bi-va-giai-phap/machinery', '/dich-vu/thiet-bi-va-giai-phap/thiet-bi'],
    ['/du-an/kho-thong-minh-asrs', '/du-an/oulide-ada-smart-warehouse'],
  ]) {
    const response = await request.get(from, { maxRedirects: 0 });
    expect(response.status(), from).toBe(308);
    expect(new URL(response.headers().location, 'http://x').pathname, from).toBe(to);
  }
});

test('the dark call-to-action bar matches Figma 244:1544', async ({ page }) => {
  await page.goto('/dich-vu/thiet-bi-va-giai-phap');
  const bar = page.locator('.cta-bar');
  await expect(bar).toBeVisible();
  // Nhãn là viên thuốc nền vàng trong suốt, không phải chữ trần.
  const eyebrow = bar.locator('.cta-bar-eyebrow');
  await expect(eyebrow).toHaveCSS('background-color', 'rgba(241, 223, 87, 0.1)');
  await expect(eyebrow).toHaveCSS('border-radius', '9999px');
  // Số điện thoại nằm trên nút, cả hai xếp dọc trong cột phải.
  const phone = await bar.locator('.cta-bar-phone').boundingBox();
  const button = await bar.locator('.cta-bar-button').boundingBox();
  expect(phone && button && phone.y + phone.height).toBeLessThanOrEqual(button!.y + 1);
  await expect(bar.locator('.cta-bar-button')).toHaveCSS('border-radius', '12px');
});

test('section eyebrows are plain yellow text, not badges', async ({ page }) => {
  for (const [url, selector] of [
    ['/dich-vu', '.service-groups .dot-badge'],
    ['/du-an', '.projects-listing .dot-badge'],
  ]) {
    await page.goto(url);
    const eyebrow = page.locator(selector).first();
    await expect(eyebrow).toHaveCSS('color', 'rgb(241, 223, 87)');
    await expect(eyebrow).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
    await expect(eyebrow).toHaveCSS('border-top-width', '0px');
  }
});

test('the news support card shows the hotline above the call button', async ({ page }) => {
  await page.goto('/tin-tuc');
  const promo = page.locator('.news-promo');
  await expect(promo.locator('.news-promo-badge')).toBeVisible();
  await expect(promo.locator('.news-promo-hotline strong')).toHaveCSS('color', 'rgb(241, 223, 87)');
  await expect(promo.locator('.news-promo-body > a')).toBeVisible();
  // Bản thiết kế mới bỏ nhãn danh mục trên ảnh bài viết.
  await expect(page.locator('.news-badge')).toHaveCount(0);
});

test('the project page opens with the image, without a facts strip', async ({ page }) => {
  await page.goto('/du-an/oulide-ada-smart-warehouse');
  await expect(page.locator('.project-facts')).toHaveCount(0);
  await expect(page.locator('.case-crumb')).toHaveCount(0);
  await expect(page.locator('.project-hero-card')).toBeVisible();
});

test('the process steps section carries the yellow rule under its heading', async ({ page }) => {
  await page.goto('/dich-vu/thiet-bi-va-giai-phap');
  const heading = page.locator('.process-steps-inner .center-heading h2');
  await expect(heading).toHaveCSS('font-size', '36px');
  const rule = await heading.evaluate((el) => {
    const s = getComputedStyle(el, '::after');
    return { width: s.width, height: s.height, background: s.backgroundColor };
  });
  expect(rule).toEqual({ width: '80px', height: '4px', background: 'rgb(241, 223, 87)' });
  await expect(page.locator('.process-step-card')).toHaveCount(4);
});

test('the contact map carries its credit line from the CMS', async ({ page }) => {
  const network = await fetch(`${CMS}/api/site/contact-page?locale=vi`)
    .then((r) => r.json())
    .then((r) =>
      r.data.sections.find((s: { __component: string }) => s.__component === 'sections.network'),
    );
  expect(network.supportLabel).toBeTruthy();
  await page.goto('/lien-he');
  await expect(page.locator('.map-credit')).toHaveText(network.supportLabel);
});

test('detail pages carry the Figma copy: project title, line FAQ and sample article', async ({
  page,
}) => {
  await page.goto('/du-an/oulide-ada-smart-warehouse');
  const title = page.locator('.project-overview .project-title');
  await expect(title).toHaveText('Oulide – ADA & Smart Warehouse');
  await expect(title).toHaveCSS('text-transform', 'uppercase');
  await expect(title).toHaveCSS('font-size', '50px');
  await expect(page.locator('.project-split h2').first()).toHaveText('Thách thức & Giải pháp');

  await page.goto('/dich-vu/thiet-bi-va-giai-phap/day-chuyen-san-xuat');
  await expect(page.locator('.faq-list')).toContainText(
    'Thời gian thiết kế, chế tạo và bàn giao dây chuyền tự động hóa mất bao lâu?',
  );

  await page.goto('/tin-tuc/quy-trinh-gia-cong-cnc-5-truc');
  await expect(page.locator('h1')).toHaveText(/Quy trình chuyển giao máy phay CNC 5 trục/);
  await expect(page.locator('.article-table thead')).toContainText('Hạng mục kiểm nghiệm');
  await expect(page.getByText('Bài viết gần đây')).toBeVisible();
});
