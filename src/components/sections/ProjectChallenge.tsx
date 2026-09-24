import type { Section } from '@/lib/types';
import ProjectSplit from './ProjectSplit';
export default function ProjectChallenge({ section }: { section: Section }) {
  return <ProjectSplit section={section} />;
}
