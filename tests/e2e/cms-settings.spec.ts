import { test, expect } from '@playwright/test';

test('published CMS settings supply header, footer, forms and list actions', async ({
  page,
  request,
}) => {
  const cms = async (type: string) => {
    const response = await request.get(`http://localhost:1337/api/site/${type}?locale=en`);
    expect(response.status()).toBe(200);
    return (await response.json()).data;
  };
  const [copy, header, footer] = await Promise.all(['site-settings', 'header', 'footer'].map(cms));
  expect(copy.assets.phoneIcon.media.url).toMatch(/^\/uploads\//);
  expect(header.logo.url).toMatch(/^\/uploads\//);
  expect(footer.logo.media.url).toMatch(/^\/uploads\//);
  await page.goto('/en');
  const cta = page.locator('.header-cta');
  await expect(cta).toContainText(header.buttonLabel);
  await expect(cta).toHaveAttribute('href', '/en' + header.buttonHref);
  await expect(page.locator('.site-header .brand-logo')).toHaveAttribute(
    'src',
    new RegExp(header.logo.url),
  );
  await expect(page.locator('footer')).toContainText(footer.description);
  for (const column of footer.columns) {
    await expect(page.locator('footer')).toContainText(column.title);
    for (const link of column.links)
      await expect(
        page.locator('footer').getByRole('link', { name: link.title, exact: true }).first(),
      ).toHaveAttribute('href', '/en' + link.href);
  }
  await page.goto('/en/lien-he');
  await expect(page.getByLabel(copy.forms.name, { exact: true })).toHaveAttribute(
    'placeholder',
    copy.forms.nameShort,
  );
  await expect(page.getByRole('button', { name: copy.forms.submit })).toBeVisible();
  await page.goto('/en/tin-tuc');
  await expect(page.locator('.news-search input')).toHaveAttribute(
    'placeholder',
    copy.common.searchPlaceholder,
  );
  await expect(page.locator('.news-card .read-more-button').first()).toHaveText(copy.common.readMore);
});
