import type { SiteCopy } from '@/components/SiteCopyProvider';
export interface Media {
  url: string;
  width?: number;
  height?: number;
  alternativeText?: string;
}
export interface Picture {
  localPath?: string;
  alt: string;
  media?: Media;
}
export interface Card {
  title: string;
  highlight?: string;
  description?: string;
  eyebrow?: string;
  image?: Picture;
  icon?: Picture;
  href?: string;
  label?: string;
  tags?: string;
}
export type SectionKind =
  | 'hero-slider'
  | 'services'
  | 'about'
  | 'capabilities'
  | 'projects'
  | 'news'
  | 'cta'
  | 'partners'
  | 'about-hero'
  | 'metrics'
  | 'values'
  | 'timeline'
  | 'team'
  | 'page-hero'
  | 'service-intro'
  | 'feature-grid'
  | 'commitments'
  | 'gallery'
  | 'faq'
  | 'project-overview'
  | 'project-challenge'
  | 'project-process'
  | 'project-results'
  | 'article-body'
  | 'related-articles'
  | 'contact-form'
  | 'network'
  | 'article-steps'
  | 'article-comparison'
  | 'article-author'
  | 'video-cta'
  | 'quote-form'
  | 'rich-text';
export interface Section {
  story?: Section;
  id?: number;
  __component: `sections.${SectionKind}`;
  title?: string;
  highlight?: string;
  subtitle?: string;
  description?: string;
  eyebrow?: string;
  image?: Picture;
  cards?: Card[];
  variant?: string;
  ctaLabel?: string;
  ctaHref?: string;
  quote?: string;
  body?: string;
  images?: Picture[];
  videoUrl?: string;
  videoLabel?: string;
  stats?: Card[];
  badges?: Card[];
  secondaryLabel?: string;
  secondaryHref?: string;
  contactTitle?: string;
  contactText?: string;
  panelEyebrow?: string;
  panelTitle?: string;
  panelText?: string;
  panelLabel?: string;
  panelHref?: string;
  supportLabel?: string;
  supportValue?: string;
  requestTitle?: string;
  requestText?: string;
  logo?: Picture;
  rating?: string;
  promo?: Card;
  mapUrl?: string;
  imageTag?: string;
  imageCaption?: string;
  imageNote?: string;
  checklistTitle?: string;
  checklist?: string;
  role?: string;
  supportIcon?: Picture;
  panelIcon?: Picture;
  eyebrowIcon?: Picture;
  content?: string;
}
export interface SEO {
  metaTitle?: string;
  metaDescription?: string;
  canonicalUrl?: string;
  keywords?: string;
  noIndex?: boolean;
  shareImage?: Picture;
}
export interface PageContent {
  documentId?: string;
  title: string;
  seo: SEO;
  sections: Section[];
  updatedAt?: string;
}
export interface Entry extends PageContent {
  group?: 'industrial' | 'logistics';
  slug: string;
  category: string;
  summary: string;
  image: Picture;
  icon?: Picture;
  location?: string;
  year?: string;
  featured?: boolean;
  homeOrder?: number;
  homeTitle?: string;
  homeSummary?: string;
  homeImage?: Picture;
  homeCategory?: string;
  author?: string;
  publishedDate?: string;
  tags?: string;
  tag?: string;
  readingTime?: string;
  authorRole?: string;
  authorImage?: Picture;
  bannerImage?: Picture;
}
export interface Global {
  title: string;
  logo: Picture;
  description: string;
  email: string;
  phone: string;
  address: string;
  supportImage: Picture;
  bannerImage?: Picture;
  supportEmail?: string;
  supportPhone?: string;
  promo?: Card;
  workingHours?: Card[];
  navigation: Card[];
}
export interface HeaderConfig {
  logo: Media;
  logoAlt: string;
  navigation: Card[];
  buttonLabel: string;
  buttonHref: string;
}
export interface FooterConfig {
  logo: Picture;
  logoHref: string;
  description: string;
  phoneLabel: string;
  phoneSuffix: string;
  emailLabel: string;
  addressLabel: string;
  copyright: string;
  columns: { title: string; links: Card[] }[];
  socialLinks: Card[];
  followTitle?: string;
  companyName?: string;
}
export interface SectionContext {
  locale: import('./i18n').Locale;
  copy: SiteCopy;
  footer: FooterConfig;
  header: HeaderConfig;
  services: Entry[];
  projects: Entry[];
  articles: Entry[];
  global: Global;
  currentSlug?: string;
}
