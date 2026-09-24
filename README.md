# TOP WELL Website (Next.js 16)

Website TOP WELL International, lấy nội dung từ Strapi. CMS nằm ở repo riêng: [topwell-cms](https://github.com/devtuanphu/topwell-cms).

- Next.js 16 (App Router), React 19, TypeScript, CSS thuần.
- Ba ngôn ngữ: Tiếng Việt (mặc định, không có tiền tố), English (`/en`), 中文 (`/zh`).
- Giao diện dựng theo Figma "TOP WELL — Website Redesign V1".

## Chạy trên máy

Cần Strapi chạy trước ở `http://localhost:1337`.

```bash
cp .env.example .env.local   # điền INQUIRY_SECRET giống hệt giá trị bên CMS
npm ci
npm run dev                  # http://localhost:3100
```

## Biến môi trường

| Biến | Ý nghĩa |
| --- | --- |
| `STRAPI_URL` | Địa chỉ CMS mà server Next.js gọi tới. |
| `NEXT_PUBLIC_STRAPI_URL` | Địa chỉ CMS/media mà trình duyệt truy cập được. |
| `NEXT_PUBLIC_SITE_URL` | Domain website thật, dùng cho canonical, hreflang, sitemap và ảnh chia sẻ. |
| `INQUIRY_SECRET` | Chuỗi bí mật dùng chung với CMS, chỉ tồn tại ở server. |
| `USE_DEMO_CONTENT` | `true` để xem giao diện bằng dữ liệu tĩnh trong `src/data/demo.json`. |

## Cấu trúc

```text
src/app/[lang]/        Route theo ngôn ngữ (layout, trang chủ, catch-all)
src/app/api/contact/   Nhận form, kiểm tra và chuyển sang CMS
src/app/site.css       Token màu, typography, header, footer, banner
src/app/styles/        CSS theo từng trang
src/components/        Header, Footer, PageView, SectionRenderer
src/components/sections/  Component cho từng loại khối nội dung trong CMS
src/lib/               cms.ts (fetch dữ liệu), i18n.ts, seo.ts, rich-text.ts
src/proxy.ts           Định tuyến ngôn ngữ (tiếng Việt ở đường dẫn gốc)
```

Nội dung được ghép từ Dynamic Zone của Strapi: `SectionRenderer` chọn component React theo `__component` của từng khối.

## Đa ngôn ngữ

- `/du-an` (vi), `/en/du-an`, `/zh/du-an`. `/vi/...` chuyển hướng 308 về đường dẫn gốc.
- Link nội bộ dùng `@/components/Link` để tự thêm tiền tố ngôn ngữ.
- Mỗi trang khai báo canonical theo ngôn ngữ, `hreflang` cho cả 3 bản và `x-default`; sitemap liệt kê đủ 3 phiên bản.

## SEO

Metadata, Open Graph, Twitter Card, JSON-LD (Organization, WebPage, Article, BreadcrumbList), `sitemap.xml`, `robots.txt`, ảnh Open Graph tự sinh.

## Nội dung CKEditor

Khối `sections.rich-text` chứa HTML do biên tập viên soạn trong CMS. `src/lib/rich-text.ts` lọc HTML trên server (bỏ script, thuộc tính sự kiện, link nguy hiểm), chuyển ảnh sang địa chỉ Strapi, thêm tiền tố ngôn ngữ cho link nội bộ và chỉ cho nhúng video từ YouTube/Vimeo.

## Kiểm thử

Cần cả hai server đang chạy.

```bash
npx playwright install chromium
npm test
```

Bộ kiểm thử duyệt toàn bộ route ở 3 ngôn ngữ (canonical, hreflang, metadata, một thẻ H1), kiểm tra tràn ngang ở 1280/768/390/320 px, menu di động, slider, FAQ, phân trang, chuyển ngôn ngữ, form liên hệ và form báo giá.

## Triển khai

```bash
npm run build     # cần CMS đang chạy để prerender
npm run start
```

Đặt `NEXT_PUBLIC_SITE_URL` theo domain thật, nếu không canonical và sitemap sẽ trỏ sai. Dữ liệu CMS hiện được gọi mới ở mỗi lượt xem (`cache: 'no-store'` trong `src/lib/cms.ts`) nên nội dung cập nhật ngay sau khi Publish; nếu cần giảm tải cho CMS, đổi sang `next: { revalidate: … }`.
