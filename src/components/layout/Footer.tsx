import Link from '@/components/Link';
import type { SectionContext } from '@/lib/types';
import { mediaUrl, safeHref } from '@/lib/media';
export default function Footer({ context }: { context: SectionContext }) {
  const { global, footer } = context;
  return (
    <footer className="site-footer">
      <div className="footer-shell">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link href={safeHref(footer.logoHref)} className="footer-company">
              {footer.companyName || global.title}
            </Link>
            <p className="footer-tagline">{footer.description}</p>
          </div>
          {footer.columns.map((column) => (
            <div className="footer-column" key={column.title}>
              <h3>{column.title}</h3>
              {column.links.map((link) => (
                <Link key={link.href + link.title} href={safeHref(link.href)}>
                  {link.title}
                </Link>
              ))}
            </div>
          ))}
        </div>
        <div className="footer-bottom">
          <address>
            <p>
              <strong>{footer.phoneLabel}</strong>{' '}
              <a href={`tel:${global.phone.replace(/[^+0-9]/g, '')}`}>{global.phone}</a> -{' '}
              {footer.phoneSuffix}
            </p>
            <p>
              <strong>{footer.emailLabel}</strong>{' '}
              <a href={`mailto:${global.email}`}>{global.email}</a>
            </p>
            <p>
              <strong>{footer.addressLabel}</strong> {global.address}
            </p>
          </address>
          {footer.socialLinks?.length > 0 && (
            <div className="footer-follow">
              <p>{footer.followTitle || 'Follow us'}</p>
              <div className="footer-socials">
                {footer.socialLinks.map((link) => {
                  const icon = link.icon ? (
                    <img src={mediaUrl(link.icon)} width={20} height={20} alt="" />
                  ) : (
                    <span aria-hidden="true">{link.title.slice(0, 1)}</span>
                  );
                  return link.href ? (
                    <a
                      key={link.title}
                      href={safeHref(link.href)}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={link.title}
                      title={link.title}
                    >
                      {icon}
                    </a>
                  ) : (
                    <span key={link.title} role="img" aria-label={link.title} title={link.title}>
                      {icon}
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </div>
        <div className="copyright">
          {footer.copyright.replace('{year}', String(new Date().getFullYear()))}
        </div>
      </div>
    </footer>
  );
}
