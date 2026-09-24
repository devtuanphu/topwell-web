import type { Section } from '@/lib/types';
import ProjectSplit from './ProjectSplit';
export default function ProjectResults({ section }: { section: Section }) {
  return <ProjectSplit section={section} strong />;
}
