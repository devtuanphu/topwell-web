import type { Section, SectionContext } from '@/lib/types';
import HeroSlider from './sections/HeroSlider';
import Services from './sections/Services';
import About from './sections/About';
import Capabilities from './sections/Capabilities';
import Projects from './sections/Projects';
import News from './sections/News';
import Cta from './sections/Cta';
import Partners from './sections/Partners';
import AboutHero from './sections/AboutHero';
import Metrics from './sections/Metrics';
import Values from './sections/Values';
import Timeline from './sections/Timeline';
import Team from './sections/Team';
import PageHero from './sections/PageHero';
import ServiceIntro from './sections/ServiceIntro';
import FeatureGrid from './sections/FeatureGrid';
import Commitments from './sections/Commitments';
import Gallery from './sections/Gallery';
import Faq from './sections/Faq';
import ProjectOverview from './sections/ProjectOverview';
import ProjectChallenge from './sections/ProjectChallenge';
import ProjectProcess from './sections/ProjectProcess';
import ProjectResults from './sections/ProjectResults';
import ArticleBody from './sections/ArticleBody';
import RelatedArticles from './sections/RelatedArticles';
import ContactForm from './sections/ContactForm';
import ArticleSteps from './sections/ArticleSteps';
import ArticleComparison from './sections/ArticleComparison';
import ArticleAuthor from './sections/ArticleAuthor';
import Network from './sections/Network';
import VideoCta from './sections/VideoCta';
import QuoteForm from './sections/QuoteForm';
import RichText from './sections/RichText';
export default function SectionRenderer({
  section,
  context,
}: {
  section: Section;
  context: SectionContext;
}) {
  switch (section.__component) {
    case 'sections.hero-slider':
      return <HeroSlider section={section} />;
    case 'sections.services':
      return <Services section={section} context={context} />;
    case 'sections.about':
      return <About section={section} />;
    case 'sections.capabilities':
      return <Capabilities section={section} />;
    case 'sections.projects':
      return <Projects section={section} context={context} />;
    case 'sections.news':
      return <News section={section} context={context} />;
    case 'sections.cta':
      return <Cta section={section} />;
    case 'sections.partners':
      return <Partners section={section} />;
    case 'sections.about-hero':
      return <AboutHero section={section} />;
    case 'sections.metrics':
      return <Metrics section={section} />;
    case 'sections.values':
      return <Values section={section} />;
    case 'sections.timeline':
      return <Timeline section={section} />;
    case 'sections.team':
      return <Team section={section} />;
    case 'sections.page-hero':
      return <PageHero section={section} />;
    case 'sections.service-intro':
      return <ServiceIntro section={section} />;
    case 'sections.feature-grid':
      return <FeatureGrid section={section} />;
    case 'sections.commitments':
      return <Commitments section={section} />;
    case 'sections.gallery':
      return <Gallery section={section} />;
    case 'sections.faq':
      return <Faq section={section} />;
    case 'sections.project-overview':
      return <ProjectOverview section={section} />;
    case 'sections.project-challenge':
      return <ProjectChallenge section={section} />;
    case 'sections.project-process':
      return <ProjectProcess section={section} />;
    case 'sections.project-results':
      return <ProjectResults section={section} />;
    case 'sections.article-body':
      return <ArticleBody section={section} />;
    case 'sections.related-articles':
      return <RelatedArticles section={section} context={context} />;
    case 'sections.contact-form':
      return <ContactForm section={section} global={context.global} footer={context.footer} />;
    case 'sections.article-steps':
      return <ArticleSteps section={section} />;
    case 'sections.article-comparison':
      return <ArticleComparison section={section} />;
    case 'sections.article-author':
      return <ArticleAuthor section={section} />;
    case 'sections.network':
      return <Network section={section} global={context.global} />;
    case 'sections.video-cta':
      return <VideoCta section={section} />;
    case 'sections.rich-text':
      return <RichText section={section} context={context} />;
    case 'sections.quote-form':
      return <QuoteForm section={section} context={context} />;
    default: {
      const exhaustive: never = section.__component;
      throw new Error(`Unknown CMS section: ${exhaustive}`);
    }
  }
}
