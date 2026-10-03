export type ProjectAction = {
  label: 'GitHub' | 'Live Demo';
  href: string;
  variant: 'primary' | 'secondary';
};

export function getProjectActions(project: {
  private: boolean;
  repository?: string;
  demo?: string;
}): ProjectAction[] {
  if (project.private) return [];

  const actions: ProjectAction[] = [];
  if (project.repository) actions.push({ label: 'GitHub', href: project.repository, variant: 'secondary' });
  if (project.demo) actions.push({ label: 'Live Demo', href: project.demo, variant: 'primary' });
  return actions;
}
