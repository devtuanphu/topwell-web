'use client';
import { useCopy, useLocale } from '@/components/SiteCopyProvider';
import { useState, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from '@/components/Link';
import type { Entry, HeaderConfig, NavItem } from '@/lib/types';
import { childrenOf, pathOf } from '@/lib/tree';
import { mediaUrl, safeHref } from '@/lib/media';
import { LOCALES, LOCALE_COOKIE, localizePath, stripLocale } from '@/lib/i18n';

function Chevron() {
  return (
    <svg className="nav-chevron" width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
      <path d="M2 3.5 5 6.5 8 3.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

type MenuLink = { href: string; title: string; children?: MenuLink[] };

/** Mũi tên vàng cạnh mục cấp 2 trong menu con (Figma 217:341). */
function RowArrow() {
  return (
    <svg className="dropdown-arrow" width="13" height="18" viewBox="0 0 13 18" aria-hidden="true">
      <path d="M3 3l6 6-6 6" fill="none" stroke="#fc0" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

/**
 * Menu con. Khi có mục cấp 3, menu chỉ liệt kê các mục cấp 2 (Figma 217:341); rê chuột vào
 * mục cấp 2 nào thì menu cấp 3 của mục đó mới bật ra bên phải. Không có cấp 3 thì là danh sách
 * một cột.
 */
function Dropdown({ links }: { links: MenuLink[] }) {
  const nested = links.some((l) => l.children?.length);
  if (!nested)
    return (
      <div className="dropdown">
        {links.map((l) => (
          <Link key={l.href} href={l.href}>
            {l.title}
          </Link>
        ))}
      </div>
    );
  return (
    <div className="dropdown nested">
      {links.map((l) => (
        <div className="dropdown-row" key={l.href}>
          <Link className="dropdown-parent" href={l.href}>
            <span>{l.title}</span>
            {l.children?.length ? <RowArrow /> : null}
          </Link>
          {l.children?.length ? (
            <div className="dropdown-children">
              {l.children.map((c) => (
                <Link key={c.href} href={c.href}>
                  {c.title}
                </Link>
              ))}
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}

export default function Header({
  config,
  services,
  projects = [],
}: {
  config: HeaderConfig;
  services: Entry[];
  projects?: Entry[];
}) {
  const copy = useCopy();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const lang = useLocale();
  const [scrolled, setScrolled] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);
  const pathname = stripLocale(usePathname());
  useEffect(() => {
    setOpen(false);
    setLangOpen(false);
  }, [pathname]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        setLangOpen(false);
      }
    };
    const onClick = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) setLangOpen(false);
    };
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('keydown', onKey);
    window.addEventListener('click', onClick);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('click', onClick);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);
  const chooseLanguage = (code: (typeof LOCALES)[number]['code']) => {
    setLangOpen(false);
    if (code === lang) return;
    document.cookie = `${LOCALE_COOKIE}=${code}; path=/; max-age=31536000; samesite=lax`;
    // Tải lại cả trang: điều hướng phía client sang đường dẫn tiếng Việt (được proxy
    // rewrite sang /vi/...) có lúc không đổi URL, nên đổi ngôn ngữ luôn dùng điều hướng thật.
    window.location.assign(
      localizePath(pathname, code) + window.location.search + window.location.hash,
    );
  };
  // Menu lấy từ trường "Thanh menu" của CMS.
  const items: NavItem[] = config.menu || [];
  // Nguồn Dịch vụ / Dự án dựng cả cây: mục cấp 2 kèm các mục cấp 3 của nó (Figma 217:341).
  const tree = (list: Entry[], base: string): MenuLink[] =>
    childrenOf(undefined, list).map((root) => ({
      href: `${base}${pathOf(root, list)}`,
      title: root.title,
      children: childrenOf(root, list).map((child) => ({
        href: `${base}${pathOf(child, list)}`,
        title: child.title,
      })),
    }));
  const submenu = (item: NavItem): MenuLink[] => {
    if (item.source === 'manual')
      return (item.links || []).map((l) => ({ href: safeHref(l.href), title: l.title }));
    if (item.source === 'services') return tree(services, copy.routes.serviceBase);
    if (item.source === 'projects') return tree(projects, copy.routes.projectBase);
    return [];
  };
  return (
    <header
      className={`site-header ${pathname === '/' ? '' : 'inner'} ${scrolled ? 'is-scrolled' : ''}`}
    >
      <div className="header-inner">
        <Link
          href={copy.routes.home}
          className="brand-lockup"
          aria-label={copy.accessibility.homeLink}
        >
          <img
            className="brand-logo"
            src={mediaUrl({ media: config.logo, alt: config.logoAlt })}
            width={76}
            height={44}
            alt={config.logoAlt}
          />
        </Link>
        <button
          className="menu-toggle"
          aria-expanded={open}
          aria-controls="primary-nav"
          aria-label={open ? copy.accessibility.menuClose : copy.accessibility.menuOpen}
          onClick={() => setOpen(!open)}
        >
          <span aria-hidden="true" />
        </button>
        <div className={`header-panel ${open ? 'open' : ''}`}>
          <nav id="primary-nav" aria-label={copy.accessibility.navigation}>
            {items.map((n) => {
              const children = submenu(n);
              const active = n.href === '/' ? pathname === '/' : pathname.startsWith(n.href || '!');
              return (
                <div className={`nav-item ${children.length ? 'has-children' : ''}`} key={n.href}>
                  <Link aria-current={active ? 'page' : undefined} href={safeHref(n.href)}>
                    {n.title}
                    {children.length > 0 && <Chevron />}
                  </Link>
                  {children.length > 0 && <Dropdown links={children} />}
                </div>
              );
            })}
          </nav>
          <form
            className="header-search"
            role="search"
            onSubmit={(e) => {
              e.preventDefault();
              const q = String(new FormData(e.currentTarget).get('q') || '').trim();
              router.push(
                localizePath(copy.routes.news, lang) + (q ? `?q=${encodeURIComponent(q)}` : ''),
              );
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2.4" />
              <path d="m20 20-4-4" stroke="currentColor" strokeWidth="2.4" />
            </svg>
            <input
              name="q"
              type="search"
              placeholder={copy.common.searchPlaceholder}
              aria-label={copy.common.search}
            />
          </form>
          <div className="lang-switch" ref={langRef}>
            <button
              type="button"
              aria-haspopup="listbox"
              aria-expanded={langOpen}
              aria-label={copy.accessibility.language}
              onClick={(e) => {
                e.stopPropagation();
                setLangOpen(!langOpen);
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.8" />
                <path
                  d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3Z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />
              </svg>
              <span className="lang-current">{LOCALES.find((l) => l.code === lang)?.short}</span>
            </button>
            {langOpen && (
              <ul role="listbox" className="lang-menu">
                {LOCALES.map((l) => (
                  <li key={l.code}>
                    <button
                      type="button"
                      lang={l.code}
                      role="option"
                      aria-selected={l.code === lang}
                      onClick={() => chooseLanguage(l.code)}
                    >
                      <span>{l.short}</span> {l.label}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <Link href={safeHref(config.buttonHref)} className="header-cta">
            {config.buttonLabel} <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
