import { chromium } from '@playwright/test';
import fs from 'node:fs';
const phase = process.argv[2] || 'after';
if (!['before', 'after'].includes(phase)) throw new Error('Expected before or after');
const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1280, height: 900 },
  reducedMotion: 'reduce',
});
const result = {};
for (const [name, url] of Object.entries({
  home: '/',
  about: '/ve-chung-toi',
  services: '/dich-vu',
  service: '/dich-vu/production-lines',
  projects: '/du-an',
  project: '/du-an/tu-dong-hoa-day-chuyen-fdi',
  news: '/tin-tuc',
  article: '/tin-tuc/quy-trinh-gia-cong-cnc-5-truc',
  contact: '/lien-he',
})) {
  await page.goto('http://localhost:3100' + url);
  await page.evaluate(async () => {
    await document.fonts.ready;
    for (const img of document.images) {
      img.loading = 'eager';
      await img.decode().catch(() => {});
    }
  });
  result[name] = await page.evaluate(() => ({
    height: document.documentElement.scrollHeight,
    sections: [...document.querySelectorAll('main section')]
      .filter((e) => !e.parentElement.closest('section'))
      .map((e) => ({
        class: e.className,
        y: Math.round(e.getBoundingClientRect().top + scrollY),
        height: Math.round(e.getBoundingClientRect().height),
      })),
  }));
  await page.screenshot({ path: `../design-reference/audit/${name}-${phase}.png`, fullPage: true });
}
fs.writeFileSync(
  `../design-reference/audit/measurements-${phase}.json`,
  JSON.stringify(result, null, 2),
);
await browser.close();
