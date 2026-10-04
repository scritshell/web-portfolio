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
