export type ProjectFolderId = 'programs' | 'websites' | 'music';

export interface ProjectFolderMeta {
  id: ProjectFolderId;
  label: string;
  note: string;
}

export const projectFolders: ProjectFolderMeta[] = [
  { id: 'programs', label: 'Programs', note: 'apps, tools and systems' },
  { id: 'websites', label: 'Websites', note: 'sites for clients and projects' },
  { id: 'music', label: 'Music', note: 'pieces, sound and experiments' },
];

export const localizedProjectFolders: Record<'en' | 'es', ProjectFolderMeta[]> = {
  en: projectFolders,
  es: [
    { id: 'programs', label: 'Programas', note: 'aplicaciones, herramientas y sistemas' },
    { id: 'websites', label: 'Sitios web', note: 'sitios para clientes y proyectos' },
    { id: 'music', label: 'Música', note: 'piezas, sonido y experimentos' },
  ],
};
